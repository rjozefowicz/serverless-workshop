const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const USER_ID = "23";

module.exports.func = async (event, context) => {

    await documentClient.delete({
        TableName: process.env.TABLE_NAME,
        Key: {
            userId: USER_ID,
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
