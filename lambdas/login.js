const AWS = require("aws-sdk");
const crypto = require("crypto");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Users";

exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { email, password } = requestBody;

    if (!email || !password) {
      return buildResponse(400, {
        message: "Email and password are required.",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const params = {
      TableName: TABLE_NAME,
      Key: {
        email: email,
      },
    };

    const { Item: user } = await dynamoDb.get(params).promise();

    if (!user) {
      return buildResponse(404, { message: "User not found." });
    }

    if (hashedPassword !== user.password) {
      return buildResponse(401, {
        message: "Authentication failed. Wrong password.",
      });
    }

    const body = {
      message: "User logged in successfully!",
      user: {
        userId: user.userId,
        email: user.email,
      },
    };

    return buildResponse(200, body);
  } catch (error) {
    console.error("Error logging in user:", error);
    return buildResponse(500, { message: "Internal Server Error" });
  }
};

function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(body),
  };
}
