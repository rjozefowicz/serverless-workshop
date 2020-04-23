const AWS = require('aws-sdk');

module.exports.func = async (event, context) => {
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
