#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import { Lambda } from "../lib/lambda";
import { ApiGateway } from "../lib/api-gateway";
import { CloudFront } from "../lib/cloud-front";

const app = new cdk.App();

const env: cdk.Environment = {
  region: "ap-northeast-1",
};

const { lambdaFunction } = new Lambda(app, "SimpleServerlessLambda", {
  env,
  functionName: "simple-serverless-backend",
  handler: "dist/lambda.handler",
  code: lambda.Code.fromAsset(`${__dirname}/../../backend/`),
});

new ApiGateway(app, "SimpleServerlessApiGateway", {
  env,
  lambdaFunction,
});

new CloudFront(app, "SimpleServerlessCloudFront", {
  bucketName: "simple-serverless-stack-by-cdk-bucket",
  env,
});
