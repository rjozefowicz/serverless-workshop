'use strict';

const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.func = async(event, context) => {

    const note = JSON.parse(event.body);
    note.userId = "23";
    note.noteId = v4();
    note.timestamp = new Date().getTime();
    note.type = "TEXT";

    await documentClient.put({
        Item: note,
        TableName: process.env.TABLE_NAME
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
        response.body = JSON.stringify(body);
    }
    return response;
}
