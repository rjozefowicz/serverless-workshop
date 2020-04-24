const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.func = async (event, context) => {

    const userId = event.requestContext.authorizer.claims["cognito:username"];

    await documentClient.delete({
        TableName: process.env.TABLE_NAME,
        Key: {
            userId,
            noteId: event.pathParameters.id
        }
    }).promise();

    return response(200);
};

function response(statusCode, body) {
    let response = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        statusCode
    };
    if (body) {
        response.body = JSON.stringify(body)
    }
    return response;
}
