# Simple Serverless Stack by CDK

AWS CDK を使ってカンタンなサーバーレスな構成の Web アプリケーションをつくってみよう、という内容です。

## 対象範囲

- CDK のざっくりとした操作
- 対象 AWS サービス
  - lambda
  - api-gateway
  - s3
  - cloudfront

## ディレクトリについて

- `base` というディレクトリにひな形となるものを用意しています。
  - `frontend` と `backend` にシンプルなソースコードを用意しています。基本はそれらをいじることがありません。
- `output` というディレクトリには以下の `chapters` のステップを最後までやりきった状態のコードを入れています
- `chapters` の中にそれぞれ進め方を書いてあるので、そちらを見ながら `base` に書き込み、CDK のスタックを完成させてみてください。

## チャプター

- [CDK について、そしてセットアップ](./chapters/1-about-cdk-and-setup.md)
- [サーバーレスなバックエンドの作成](./chapters/2-create-serverless-backend.md)
- [フロントエンドの作成](./chapters/3-create-frontend.md)
- [Deploy & Destory](./chapters/4-deploy-and-destory.md)
