const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { dbInstanceIdentifier } = JSON.parse(event.body);

  if (!dbInstanceIdentifier) {
    return buildResponse(400, {
      error: "dbInstanceIdentifier parameter is required.",
    });
  }

  const params = {
    TableName: "UserDatabaseConfigurations",
    FilterExpression: "dbInstanceIdentifier = :identifier",
    ExpressionAttributeValues: {
      ":identifier": dbInstanceIdentifier,
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    if (result.Items.length > 0) {
      return buildResponse(200, {
        exists: true,
        message: "Identifier exists in the database.",
      });
    } else {
      return buildResponse(200, {
        exists: false,
        message: "Identifier does not exist in the database.",
      });
    }
  } catch (error) {
    console.error("Database query failed:", error);
    return buildResponse(500, { error: "Failed to query the database." });
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
