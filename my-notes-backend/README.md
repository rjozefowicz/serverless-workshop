# Deployment setup

1. Create IAM role and set ARN in top-level serverless.yml
2. Create Cognito User Pool and set ARN in top-level serverless.yml

```shell script
./deploy STAGE_NAME
```

### Branches order:
1. todo - empty branch to start working
2. lambda-1 - create-note lambda
3. lambda-2 - list-notes lambda
4. lambda-3 - create-note lambda. update note
5. lambda-3-updateitem - updated lambda-3 to use UpdateItem
6. lambda-4 - delete-note lambda
7. cognito - added cognito integration
8. file-upload
9. process-file
10. download-file
11. delete-note-s3 - updated delete note to remove from S3 bucket
12. master - completed solution with Machine Learning integration