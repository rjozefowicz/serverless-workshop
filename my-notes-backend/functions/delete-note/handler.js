const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3();

module.exports.func = async (event, context) => {

    if (event.httpMethod !== "DELETE") {
        return response(405);
    }

    if (!event.requestContext.authorizer) {
        return response(401, {
            msg: `Authorization not configured. ${context.awsRequestId}`
        });
    }

    const userId = event.requestContext.authorizer.claims['cognito:username']; // id from Cognito user pool. We can get email as well

    if (event.pathParameters && event.pathParameters.id) {
        let params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                userId,
                noteId: event.pathParameters.id
            },
            ReturnValues: 'ALL_OLD'
        };

        try {
            const deletedNote = await docClient.delete(params).promise();
            if (['FILE', 'IMAGE'].indexOf(deletedNote.Attributes.type) !== -1 && deletedNote.Attributes.s3Location) {
                await S3.deleteObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: deletedNote.Attributes.s3Location
                }).promise();
            }
        } catch (e) {
            console.log("Cannot delete note", e);
            return response(500);
        }

        return response(200);
    }
    return response(400);
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
