const AWS = require("aws-sdk");
const crypto = require("crypto");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Users";

const sns = new AWS.SNS();
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);

    const { firstname, lastname, email, password } = requestBody;

    if (!firstname || !lastname || !email || !password) {
      const body = {
        message: "Username, email, and password are required.",
      };
      return buildResponse(400, body);
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = {
      userId: AWS.util.uuid.v4(),
      firstname,
      lastname,
      email,
      password: hashedPassword,
    };

    const params = {
      TableName: TABLE_NAME,
      Item: user,
    };

    await dynamoDb.put(params).promise();

    const subscribeParams = {
      Protocol: "email",
      TopicArn: SNS_TOPIC_ARN,
      Endpoint: email,
      Attributes: {
        FilterPolicy: JSON.stringify({
          email: [email],
        }),
      },
    };

    const subscribeResult = await sns.subscribe(subscribeParams).promise();
    console.log("Subscription ARN:", subscribeResult.SubscriptionArn);

    const body = {
      message:
        "User signed up successfully! A confirmation email has been sent.",
      user: {
        userId: user.userId,
        email: user.email,
      },
    };

    return buildResponse(200, body);
  } catch (error) {
    console.error("Error signing up user:", error);
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
