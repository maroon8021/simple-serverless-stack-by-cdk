import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";

type S3Props = {
  bucketName: string;
} & cdk.StackProps;

export class S3 extends cdk.Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props: S3Props) {
    super(scope, id, props);

    const { bucketName } = props;

    this.bucket = new s3.Bucket(this, `yattaneCloudFrontBucket`, {
      bucketName,
      websiteIndexDocument: "index.html",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
    });
  }
}
