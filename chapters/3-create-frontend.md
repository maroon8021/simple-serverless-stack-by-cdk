# 3. フロントエンドの作成

せっかくなので、簡単にフロントエンドも作成してみましょう。
今回は cloudfront × s3 でシンプルなホスティングを実現します(Route53 を使ってドメインを貼ったりはしません)

cdk の書き方の大枠は前チャプターで把握できたかと思うので、以下には全体のコードと、要点だけコメントしておきます

## cloud-front.ts

```typescript
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";

type CloudFrontProps = {
  bucketName: string;
} & cdk.StackProps;

export class CloudFront extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: CloudFrontProps) {
    super(scope, id, props);
    const { bucketName } = props;

    // s3.tsに切り出したかったけど、`Cross stack references` で怒られたので一旦中にかく
    const bucket = new s3.Bucket(
      this,
      `simple-serverless-stack-by-cdk-bucket`,
      {
        bucketName,
        websiteIndexDocument: "index.html",
        // frontendとしてホスティングする際には外部からS3に直接触れる必要がないため、強めに縛っておくほうがよい
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        publicReadAccess: false,
      }
    );

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      `simple-serverless-stack-by-cdk-identity`,
      {}
    );

    bucket.grantRead(originAccessIdentity); // cloudfrontからのアクセスを許可する

    new cloudfront.CloudFrontWebDistribution(
      this,
      `simple-serverless-stack-by-cdk-WebDistribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                minTtl: cdk.Duration.seconds(0),
                maxTtl: cdk.Duration.days(365),
                defaultTtl: cdk.Duration.days(1),
              },
            ],
          },
        ],
        errorConfigurations: [
          {
            responseCode: 200,
            responsePagePath: "/index.html",
            errorCachingMinTtl: 0,
            errorCode: 403,
          },
          {
            responseCode: 200,
            responsePagePath: "/index.html",
            errorCachingMinTtl: 0,
            errorCode: 404,
          },
        ],
      }
    );
  }
}
```

## cdk.ts

```typescript
// ファイルの末尾のほうに追加

new CloudFront(app, "SimpleServerlessCloudFront", {
  bucketName: "hogehogehoge",
  env,
});
```
