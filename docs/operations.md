# 運用メモ

## フォルダ構成

```
src/
  data/          文言・会社情報・画像パスの設定（更新はまずここ）
    site.ts        サイト名、説明文、メニュー、公開URL
    company.ts     会社情報（未定の項目は【要入力】）
    top.ts         TOPページの文言
    assets.ts      ロゴ・OGP画像のパス
  styles/
    tokens.css     配色・フォント・文字サイズ・余白（デザインの変数）
    global.css     全ページ共通の基本スタイル
  components/    共通部品（ヘッダー、フッター、ロゴ、ボタン、お問い合わせ誘導）
  layouts/       ページの共通レイアウト（<head>、SEO、フォント読み込み）
  pages/         各ページ（URLと対応）
  scripts/       TOPページのスクロール演出（GSAP）
public/
  images/
    logo/        ロゴ（SVG推奨。白背景用と濃紺背景用）
    photos/      写真
    ogp/         SNS共有用画像（1200×630px）
  favicon.svg    ブラウザのタブに出るアイコン（仮）
.github/workflows/deploy.yml   GitHub Pages への自動公開
```

## ロゴ・写真の差し替え

1. 画像を `public/images/logo/` などに置く
2. `src/data/assets.ts` にパスを書く（例：`logo: '/images/logo/bull-logo.svg'`）
3. 空のままなら、ロゴは文字ロゴ「bull」が表示される

## 独自ドメインを設定するとき（ドメイン決定後）

1. `astro.config.mjs` の `site` に `https://【ドメイン名】` を設定する
2. `src/data/site.ts` の `url` に同じURLを設定する（canonical・OGPのURLが出力される）
3. `public/CNAME` を作り、ドメイン名を1行だけ書く
4. GitHub リポジトリの Settings → Pages → Custom domain にドメインを入力し、「Enforce HTTPS」をオンにする
5. ドメインのDNS設定で GitHub Pages を向ける（GitHub の公式手順に従う）
6. サイトマップ（@astrojs/sitemap）を追加し、robots.txt に記載する

## GitHub Pages での公開（初回）

1. GitHub にリポジトリを作り、このプロジェクトを push する
2. リポジトリの Settings → Pages → Source を「GitHub Actions」にする
3. 以後は `main` ブランチに push すると自動で公開される

## お問い合わせフォーム

- 設定手順は [form-setup.md](./form-setup.md)、メール送信のコードは [google-apps-script.gs](./google-apps-script.gs)
- 送信先URL・項目IDは `src/data/contactForm.ts` の `googleForm` だけを書き換える

## アニメーションについて

- TOPのスクロール演出は `src/scripts/top-animations.ts`、最初の表示アニメーションは `src/pages/index.astro` のCSSにある
- OSの「視差効果を減らす／動きを減らす」設定がオンのときは、すべての演出を止めて静止表示にする
- JavaScriptが動かない場合も、内容はすべて読めるようにしている
