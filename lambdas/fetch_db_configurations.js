const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "UserDatabaseConfigurations";
const INDEX_NAME = "UserIdIndex";

exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { userId } = requestBody;

    if (!userId) {
      return buildResponse(400, {
        message: "userId is required.",
      });
    }

    const params = {
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const data = await dynamoDb.query(params).promise();

    if (data.Items.length === 0) {
      return buildResponse(200, {
        message: "No configurations found for this userId.",
      });
    }

    const body = {
      message: "Configurations retrieved successfully.",
      configurations: data.Items,
    };

    return buildResponse(200, body);
  } catch (error) {
    console.error("Error retrieving configurations:", error);
    return buildResponse(500, {
      message: "Internal Server Error while retrieving configurations",
    });
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
