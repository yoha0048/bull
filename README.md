# 株式会社bull コーポレートサイト

Astro で作った静的サイトです。GitHub Pages で公開します。
プロジェクトの方針と決定事項は [CLAUDE.md](./CLAUDE.md)、要望書は [docs/requirements.md](./docs/requirements.md) にあります。

## 自分のパソコンでプレビューする

### 1. 準備（最初の1回だけ）

1. **Node.js をインストールする**
   [https://nodejs.org/](https://nodejs.org/) から「LTS」と書かれた版（バージョン22以上）をダウンロードしてインストールします。
2. **ターミナルを開く**
   Mac の場合は「アプリケーション」→「ユーティリティ」→「ターミナル」で開きます。
3. **このフォルダに移動する**
   ```sh
   cd ~/websites/bull
   ```
4. **必要な部品をインストールする**
   ```sh
   npm install
   ```

### 2. プレビューを起動する

```sh
npm run dev
```

表示された `http://localhost:4321/` をブラウザで開くと、サイトを確認できます。
ファイルを保存すると、ブラウザの表示が自動で更新されます。
終了するときは、ターミナルで `control` キーを押しながら `C` を押します。

### スマートフォンで確認したいとき

パソコンとスマートフォンを同じWi-Fiにつないで、次のコマンドを実行します。

```sh
npm run dev -- --host
```

表示された `Network: http://192.168.x.x:4321/` のアドレスを、スマートフォンのブラウザで開きます。

### 公開用のファイルを作って確認する

```sh
npm run build    # dist/ フォルダに公開用のファイルを作る
npm run preview  # 作ったファイルをブラウザで確認する
```

## よく触るファイル

| やりたいこと | 編集するファイル |
|---|---|
| 会社情報（【要入力】の項目）を埋める | `src/data/company.ts` |
| TOPページの文章を変える | `src/data/top.ts` |
| サイト名・説明文・メニューを変える | `src/data/site.ts` |
| ロゴ・写真・OGP画像を差し替える | 画像を `public/images/` に置き、`src/data/assets.ts` にパスを書く |
| 色・フォント・文字サイズを変える | `src/styles/tokens.css` |

詳しい運用方法は [docs/operations.md](./docs/operations.md) を見てください。
