# 2. サーバーレスなバックエンドの作成

ここからは `lambda` と `api-gateway` のスタックを用意し、サーバーレスなバックエンドを構築することを目指します。

## lambda の用意

- 1. `base/cdk/lib` に `lambda.ts` を作りましょう
- 2.  以下のように大枠を書いてみましょう。今後別のリソースを作る際も以下の class の書き方が基準となります

```typescript
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

export class Lambda extends cdk.Stack {
  // cdk.Stack を extendsする
  constructor(parent: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(parent, id, props); // superを呼ばないと怒られる
  }
}
```

- 3. lambda の Function を書いてみましょう
  - https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda.Function.html
  - api-gateway のリソースにこの lambda.ts で作った `lambda.Function` を参照させる必要があるので、メンバとして `lambda.Function` を保持できるようにしましょう
  - 以下のように記載してみてください

```typescript
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

export class Lambda extends cdk.Stack {
  public readonly lambdaFunction: lambda.Function; // NEW

  constructor(parent: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(parent, id, props);

    // NEW ↓↓↓
    this.lambdaFunction = new lambda.Function(
      this,
      "simple-serverless-stack-by-cdk-lambda",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
      }
    );
  }
}
```

- 4. 足りない値を引数として受け取れるようにする
  - 上記のように書くと、ts の補完などが聞いてるエディター上ではエラーが出ているかと思います。
  - 以下のプロパティが足りていません
    - functionName
    - code
    - handler
  - この class 内にベタがきしてもよいですが、例えば lambda を複数作りたいとなったときに、lib 配下にその数だけ lambda.ts を用意しなければいけなくなってしまいます。
  - 再利用できるようにするため、 `props` から必要な情報を受け取れるようにしてみましょう

```typescript
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

// NEW ↓↓↓
type LambdaProps = {
  code: lambda.Code;
  functionName: string;
  handler: string;
} & cdk.StackProps;

export class Lambda extends cdk.Stack {
  public readonly lambdaFunction: lambda.Function;
  constructor(
    parent: cdk.Construct,
    id: string,
    props: LambdaProps /* <- NEW */
  ) {
    super(parent, id, props);

    const { code, functionName, handler } = props; // NEW

    this.lambdaFunction = new lambda.Function(
      this,
      "simple-serverless-stack-by-cdk-lambda",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        // NEW ↓↓↓
        functionName,
        code,
        handler,
      }
    );
  }
}
```

ここまでで `lambda.ts` は完成です

## api-gateway の用意

- 1. `base/cdk/lib` に `api-gateway.ts` を作りましょう

```typescript
import * as cdk from "@aws-cdk/core";
import * as apigw from "@aws-cdk/aws-apigateway";

export class ApiGateway extends cdk.Stack {
  constructor(parent: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(parent, id, props);
  }
}
```

- 2. api-gateway の `LambdaRestApi` を書いてみましょう
  - https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigateway.LambdaRestApi.html

```typescript
import * as cdk from "@aws-cdk/core";
import * as apigw from "@aws-cdk/aws-apigateway";

export class ApiGateway extends cdk.Stack {
  constructor(parent: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(parent, id, props);

    new apigw.LambdaRestApi(this, "simple-serverless-stack-by-cdk-api", {
      restApiName: "simple-serverless-stack-by-cdk-api",
      defaultCorsPreflightOptions: {
        // 今回はセキュリティとかを厳密にやりたいわけではないので緩めに設定しておく
        allowOrigins: ["*"],
        allowCredentials: true,
      },
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });
  }
}
```

- 3. props で `lambda.Function` を受け取れるようにする
  - 上記のような記載をしていると `handler` がない、というところで怒られるかと思います。
  - その `handler` には `lambda.ts` で作られた `lambda.Function` を渡す必要があります。
  - そのため、props で受け取れるようにしましょう

```typescript
import * as cdk from "@aws-cdk/core";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";

// NEW ↓↓↓
type ApiGatewayProps = {
  lambdaFunction: lambda.Function;
} & cdk.StackProps;

export class ApiGateway extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ApiGatewayProps) {
    super(scope, id, props);

    const { lambdaFunction } = props; // NEW

    new apigw.LambdaRestApi(this, "simple-serverless-stack-by-cdk-api", {
      handler: lambdaFunction, // NEW
      restApiName: "simple-serverless-stack-by-cdk-api",
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowCredentials: true,
      },
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });
  }
}
```

## cdk.ts に書いてみる

- `lib` 配下に書いているだけではリソースとして生成されません
- そのため、 `bin/cdk.ts` に実際にリソース生成のコードを記載してみます。

```typescript
#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import { Lambda } from "../lib/lambda";
import { ApiGateway } from "../lib/api-gateway";
import { CloudFront } from "../lib/cloud-front";

// ↓ おまじない
const app = new cdk.App();
// ↓ おまじない
const env: cdk.Environment = {
  region: "ap-northeast-1",
};

// lambda.tsで作ったclassを記載する
const { lambdaFunction } = new Lambda(app, "SimpleServerlessLambda", {
  env,
  functionName: "simple-serverless-backend",
  handler: "dist/lambda.handler",
  code: lambda.Code.fromAsset(`${__dirname}/../../backend/`),
});

new ApiGateway(app, "SimpleServerlessApiGateway", {
  env,
  lambdaFunction, //lambda.tsで作ったlambdaFunctionを食わせる
});
```
