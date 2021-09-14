# Deploy & Destory

ここでは実際に構築するのと、後片付けとしての破棄を実施してみます

- 0. いろいろ下準備
  - aws のアカウントの設定を準備して、cdk を流せるようにする
    - 詳細は割愛します
  - backend のコードを build しておきます
    - `cd base/backend && yarn build` -> `dist` が生成されます
- 1. `yarn run cdk list` と叩いてみる
  - `cdk.ts` で各リソースの `id` に指定しているものがリスト化されて表示されるはずです
  - なにかエラーがあったりすると、このリストがうまく表示されなかったりします
- 2. 実際にスタックを流してみる
  - `yarn run cdk deploy {RESOURCE_NAME}`
  - ものによっては途中で y/N の選択を聞かれるものがあるので注意してみておくこと
- 3. すべてがうまく流れ終わったらフロントエンドの準備をする
  - `base/frontend/src/app.ts` の `const url = "";` に `api-gateway` の URL を記載する
  - frontend を build する ( `yarn build` )
  - dist の中身を AWS コンソールにて作成した `S3` に配置する
- 4. URL を調べて画面表示してみる
  - AWS コンソールの cloudfront のページで URL を確認して、ブラウザで開いてみる
  - -> `This message comes from serverless backend!!!` が表示されてたら OK
- 5. スタックを削除する
  - `yarn run cdk destory {RESOURCE_NAME}`
  - s3 のバケットが消えてない可能性があるので、AWS コンソールで調べて、必要に応じて削除する
