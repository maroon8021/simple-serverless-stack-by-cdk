import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

type LambdaProps = {
  code: lambda.Code;
  functionName: string;
  handler: string;
} & cdk.StackProps;

export class Lambda extends cdk.Stack {
  public readonly lambdaFunction: lambda.Function;
  constructor(parent: cdk.Construct, id: string, props: LambdaProps) {
    super(parent, id, props);

    const { code, functionName, handler } = props;

    this.lambdaFunction = new lambda.Function(
      this,
      "simple-serverless-stack-by-cdk-lambda",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName,
        code,
        handler,
      }
    );
  }
}
