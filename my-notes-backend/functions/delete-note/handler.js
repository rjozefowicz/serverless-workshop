const AWS = require('aws-sdk');
const S3 = new AWS.S3({
    signatureVersion: 'v4'
});
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.func = async (event, context) => {

    const userId = event.requestContext.authorizer.claims["cognito:username"];

    const deletedNote = await documentClient.delete({
        TableName: process.env.TABLE_NAME,
        Key: {
            userId,
            noteId: event.pathParameters.id
        },
        ReturnValues: 'ALL_OLD'
    }).promise();

    if (deletedNote.Attributes.s3Location !== undefined) {
        await S3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: deletedNote.Attributes.s3Location
        }).promise();
    }

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
