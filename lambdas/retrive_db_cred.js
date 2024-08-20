const AWS = require("aws-sdk");
const crypto = require("crypto");
const secretsManager = new AWS.SecretsManager();
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { dbId, email, password } = requestBody;

    if (!dbId || !email || !password) {
      return buildResponse(400, {
        message: "DB ID, email and password are required.",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const userParams = {
      TableName: "Users",
      Key: {
        email: email,
      },
    };

    const userResult = await dynamoDb.get(userParams).promise();
    const user = userResult.Item;
    if (!user || user.password !== hashedPassword) {
      return buildResponse(401, { message: "Invalid user credentials." });
    }

    const dbParams = {
      TableName: "UserDatabaseConfigurations",
      Key: {
        Id: dbId,
      },
    };

    const { Item } = await dynamoDb.get(dbParams).promise();
    if (!Item) {
      return buildResponse(404, {
        message: "Database configuration not found.",
      });
    }

    const secret = await secretsManager
      .getSecretValue({ SecretId: Item.secretArn })
      .promise();
    if (!secret || !secret.SecretString) {
      return buildResponse(404, { message: "Secret not found." });
    }
    const credentials = JSON.parse(secret.SecretString);

    const message = `Your database credentials are ready. Username: ${credentials.dbUser}, Password: ${credentials.dbPassword} `;

    const messageAttributes = {
      email: {
        DataType: "String",
        StringValue: email,
      },
    };

    const params = {
      Message: message,
      Subject: "Database Credentials Request",
      MessageAttributes: messageAttributes,
      TopicArn: process.env.SNS_TOPIC_ARN,
    };

    const publishTextPromise = await sns.publish(params).promise();
    console.log(
      `Message sent to SNS with MessageId: ${publishTextPromise.MessageId}`
    );

    const body = {
      message: "Credentials sent to your registered email.",
    };
    return buildResponse(200, body);
  } catch (error) {
    console.error("Error retrieving and sending credentials:", error);
    const body = {
      message: "Internal Server Error",
    };
    return buildResponse(500, body);
  }
};
function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(body),
  };
}
