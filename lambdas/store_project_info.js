const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { userId, project, url } = requestBody;

    if (!userId || !project || !url) {
      return buildResponse(400, { message: "All fields are required." });
    }

    const params = {
      TableName: "UserProjectsInfo",
      Item: {
        Id: AWS.util.uuid.v4(),
        userId,
        project,
        url,
      },
    };
    await dynamoDb.put(params).promise();
    console.log("Project info stored successfully in DynamoDB");
    return buildResponse(200, { message: "Project info stored successfully" });
  } catch (error) {
    console.error("Error storing Project info:", error);

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
