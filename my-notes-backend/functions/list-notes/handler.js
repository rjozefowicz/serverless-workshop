'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.func = async (event, context) => {

    if (event.httpMethod !== "GET") {
        return response(405);
    }

    if (!event.requestContext.authorizer) {
        return response(401, {
            msg: `Authorization not configured. ${context.awsRequestId}`}
        );
    }

    const userId = event.requestContext.authorizer.claims['cognito:username']; // id from Cognito user pool. We can get email as well

    /**
     * TODO challenging task: Add query parameter to API Gateway and prepare search.
     * Add filter expression https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
     *
     * @type {{TableName: string}}
     */

    // const items = await docClient.scan(params).promise();
    const items = await docClient.query({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "#userId = :userId",
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":userId": userId
        }
    }).promise();
    const result = {
        elements: items.Items.map(item => {
            return {
                noteId: item.noteId,
                title: item.title,
                text: item.text || undefined,
                timestamp: item.timestamp,
                type: item.type,
                size: item.size || undefined,
                labels: item.labels || undefined
            }
        }),
        hasNext: items.LastEvaluatedKey !== undefined
    };
    return response(200, result);
};

function response(statusCode, body) {
    let response = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        statusCode
    }
    if (body) {
        response.body = JSON.stringify(body)
    }
    return response;
}