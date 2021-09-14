import * as cdk from "@aws-cdk/core";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";

type ApiGatewayProps = {
  lambdaFunction: lambda.Function;
} & cdk.StackProps;

export class ApiGateway extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ApiGatewayProps) {
    super(scope, id, props);

    const { lambdaFunction } = props;

    new apigw.LambdaRestApi(this, "simple-serverless-stack-by-cdk-api", {
      handler: lambdaFunction,
      restApiName: "simple-serverless-stack-by-cdk-api",
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowCredentials: true,
      },
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });
  }
}
