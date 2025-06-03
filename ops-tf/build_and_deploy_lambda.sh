#!/bin/sh

rm -rf ./artifacts/lambda/*.zip && \
cd ../apps/todo-pro-trpc-server && \
docker build -t rockyj/todo-pro-trpc-server . && \
docker run -v .:/opt/artifact rockyj/todo-pro-trpc-server && \
cd ../../ops-tf/ && \
mv ../apps/todo-pro-trpc-server/lambda_payload.zip ./artifacts/lambda/ && \
aws lambda update-function-code --function-name yetanotherapp-xyz-function --zip-file fileb://artifacts/lambda/lambda_payload.zip
