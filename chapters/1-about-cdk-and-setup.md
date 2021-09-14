# 1. CDK について、そしてセットアップ

## CDK とは

詳細は以下の記事に譲りますが、ざっくりいうと、ソースコードでインフラの構築/管理をすることができるものです
https://aws.amazon.com/jp/cdk/
https://dev.classmethod.jp/articles/cdk-practice-1-introduction/

## セットアップ

```sh
cd base/cdk
npx cdk init --language typescript
```

`npx cdk init --language typescript` の実行で、cdk の実装をすすめる上で必要なもの一式が用意できます。

## インストール関連の注意点

- `@aws-cdk/core`、 `@aws-cdk/assert`、 その他 `@aws-cdk/{SERVICE}` の cdk のライブラリは同じバージョンである必要があります。(このハンズオン内ではすべて `1.122.0` に統一されています )

## フォルダ構成について

- `cdk/bin/cdk.ts` に実際のスタック生成の処理を書きます(現時点で意味がわからなくても大丈夫です。後ほど説明します)
- `cdk/lib/*.ts` に各サービスの class を用意します
