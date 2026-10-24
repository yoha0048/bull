/**
 * サイト全体の基本設定。
 * 文言やリンクを変えたいときは、まずこのファイルを確認してください。
 */

export const site = {
  name: '株式会社bull',
  /** ロゴ画像がないときに表示する文字ロゴ */
  logoText: 'bull',
  /**
   * 公開URL。独自ドメインが決まったら 'https://【ドメイン名】' の形で設定する。
   * 空のままだと canonical URL などは出力されない。
   */
  url: '',
  description:
    '株式会社bullは、人と人、企業と企業、サービスと市場をつなぎ、ビジネスを前に進める会社です。営業支援・営業代行、販路拡大支援、海外展開・国際ビジネス支援、ビジネスマッチングに取り組んでいます。',
  tagline: '人とつながる、そして世界とつなぐ。',
  taglineEn: 'From one connection, to the world.',
  locale: 'ja_JP',
  /**
   * Google Analytics を使うかどうか（2026-10-08 時点の決定：使わない）。
   * true にすると、プライバシーポリシーに Google Analytics の条文が表示される。
   * ※計測タグ自体は未実装。導入する場合は計測タグの追加も必要。
   */
  useGoogleAnalytics: false,
  /**
   * お問い合わせ機能を表示するか（2026-10-24 時点の決定：いったん非表示）。
   * false の間は、ヘッダー・フッターのリンク、各ページ下部の相談誘導、会社概要の「お問い合わせ」行を表示せず、
   * /contact/ ページは検索結果に出さない（noindex）。電話番号・メールアドレスが決まったら true に戻す。
   */
  contactEnabled: false,
} as const;

export type NavItem = {
  label: string;
  labelEn: string;
  href: string;
};

/** ヘッダー・フッターのナビゲーション */
export const mainNav: NavItem[] = [
  { label: '事業紹介', labelEn: 'Business', href: '/business/' },
  { label: '会社概要', labelEn: 'Company', href: '/company/' },
];

export const contactNav: NavItem = {
  label: 'お問い合わせ',
  labelEn: 'Contact',
  href: '/contact/',
};

/** お問い合わせを含むナビゲーション（お問い合わせ非表示の間は mainNav と同じ） */
export const navWithContact: NavItem[] = site.contactEnabled ? [...mainNav, contactNav] : mainNav;

export const privacyNav: NavItem = {
  label: 'プライバシーポリシー',
  labelEn: 'Privacy Policy',
  href: '/privacy/',
};
