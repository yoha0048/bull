/**
 * ロゴ・写真などの差し替え用設定。
 *
 * 画像ファイルは public/images/ 以下にまとめて置きます。
 *   public/images/logo/    ロゴ（SVG推奨）
 *   public/images/photos/  写真
 *   public/images/ogp/     SNSで共有されたときの画像（1200×630px）
 *
 * ファイルを置いたら、下のパスを書き換えてください（public/ は含めない）。
 * 空文字のままなら、ロゴは文字ロゴ、OGP画像は出力なしになります。
 */

export const assets = {
  /** ヘッダー用ロゴ（白背景用）例: '/images/logo/bull-logo.svg' */
  logo: '',
  /** フッター用ロゴ（濃紺背景用）例: '/images/logo/bull-logo-white.svg' */
  logoOnDark: '',
  /** OGP画像 例: '/images/ogp/ogp.png' */
  ogpImage: '',
} as const;
