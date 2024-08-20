const AWS = require("aws-sdk");
const secretsManager = new AWS.SecretsManager();
const dynamoDb = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const {
      userId,
      dbInstanceIdentifier,
      dbName,
      dbUser,
      dbPassword,
      dbEndpoint,
      port,
    } = requestBody;
    if (
      !userId ||
      !dbInstanceIdentifier ||
      !dbName ||
      !dbUser ||
      !dbPassword ||
      !dbEndpoint ||
      !port
    ) {
      return buildResponse(400, { message: "All fields are required." });
    }
    const secretName = `${userId}-${dbInstanceIdentifier}-db-credentials`;
    const secretValue = JSON.stringify({ dbUser, dbPassword });
    const secret = await secretsManager
      .createSecret({
        Name: secretName,
        SecretString: secretValue,
      })
      .promise();
    console.log("Secret created successfully:", secret);
    const params = {
      TableName: "UserDatabaseConfigurations",
      Item: {
        Id: AWS.util.uuid.v4(),
        userId,
        dbInstanceIdentifier,
        dbName,
        dbEndpoint,
        port,
        secretArn: secret.ARN,
      },
    };
    await dynamoDb.put(params).promise();
    console.log("Database configuration stored successfully in DynamoDB");
    return buildResponse(200, { message: "User database setup complete" });
  } catch (error) {
    console.error("Error storing user database credentials:", error);
    if (error.code === "ResourceExistsException") {
      return buildResponse(400, {
        message: "A secret with this name already exists.",
      });
    }
    return buildResponse(500, { message: "Internal Server Error" });
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
