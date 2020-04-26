# serverless-workshop

## my-notes architecture


* [REST API endpoints](http://rj-stacja-it-wprowadzenie-do-serverless.s3-website.eu-west-2.amazonaws.com/api/index.html)
* Note data model
```json
{
  "labels": [
    "Building",
    "Cottage",
    "Countryside",
    "House",
    "Housing",
    "Nature",
    "Outdoors",
    "Person",
    "Roof",
    "Shelter"
  ],
  "noteId": "e7466188-c0e9-4cd4-b9fc-533561c25498",
  "s3Location": "fd3be9de-bd0d-44c9-85e5-bf24a4c5503d/e7466188-c0e9-4cd4-b9fc-533561c25498/krzykowdom.jpg",
  "size": "123165",
  "timestamp": "1563820937739",
  "title": "krzykowdom.jpg",
  "text": "my note text",
  "type": "IMAGE",
  "userId": "fd3be9de-bd0d-44c9-85e5-bf24a4c5503d"
}
```

### Overall architecture

![alt text](http://rj-stacja-it-wprowadzenie-do-serverless.s3-website.eu-west-2.amazonaws.com/advanced_architecture.png "")

### File upload

![alt text](http://rj-stacja-it-wprowadzenie-do-serverless.s3-website.eu-west-2.amazonaws.com/upload_diagram.png
"")

### File download

![alt text](http://rj-stacja-it-wprowadzenie-do-serverless.s3-website.eu-west-2.amazonaws.com/download_diagram.png
"")

## my-notes-frontend

React-based already bundled client application configured via index.html

```javascript
window.API_ENDPOINT = ""; //API Gateway endpoint
window.USER_POOL_ID = ""; //Cognito User Pool
window.CLIENT_ID = ""; //Cognito User Pool Client Id - please note that client for JS SDK cannot have client secret
```

Tasks:
1. Create S3 bucket to host static website and upload my-notes-frontend

```shell script
aws s3 rm s3://YOUR_BUCKET --recursive && aws s3 sync . s3://YOUR_BUCKET
```

## my-notes-backend

Serverless backend - please check README.md in my-notes-backend/
