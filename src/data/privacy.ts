/**
 * プライバシーポリシーの文面（案）。
 * 法的な文書のため、公開前に必ず内容を確認すること。必要に応じて専門家の確認を受けること。
 *
 * 本文中の {company} は会社名に置き換えて表示されます。
 */
import { TBD } from './company';

export const privacyMeta = {
  /** 制定日（例：'2026年11月1日'） */
  enactedOn: TBD,
  /** 最終改定日。改定したときに設定する（空なら表示しない） */
  revisedOn: '',
};

/** お問い合わせ窓口 */
export const privacyContact = {
  department: TBD,
  email: TBD,
  tel: TBD,
};

export type PrivacyLink = { label: string; href: string };

export type PrivacySection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  afterList?: string[];
  links?: PrivacyLink[];
};

export const privacyIntro =
  '{company}（以下「当社」といいます）は、当社のウェブサイト（以下「当サイト」といいます）をご利用になる皆さまの個人情報を適切に取り扱うことが、社会的な責務であると考えています。当社は、個人情報の保護に関する法律その他の関係法令を遵守し、以下のとおりプライバシーポリシーを定め、個人情報の適切な取り扱いに努めます。';

export const privacySections: PrivacySection[] = [
  {
    id: 'collect',
    heading: '取得する個人情報',
    paragraphs: ['当社は、当サイトのお問い合わせフォームを通じて、次の情報を取得します。'],
    list: [
      '会社名',
      'お名前',
      'メールアドレス',
      '電話番号',
      'お問い合わせカテゴリ',
      'お問い合わせ内容',
      '送信日時',
    ],
  },
  {
    id: 'purpose',
    heading: '利用目的',
    paragraphs: ['当社は、取得した個人情報を次の目的のために利用します。'],
    list: [
      'お問い合わせへの回答、およびご連絡のため',
      'お問い合わせを受け付けたことをお知らせする、自動返信メールの送信のため',
      'ご相談内容に関するご提案、お打ち合わせ等のご連絡のため',
      'お問い合わせの内容と対応の記録・管理のため',
    ],
    afterList: ['当社は、上記の利用目的の範囲を超えて個人情報を利用することはありません。'],
  },
  {
    id: 'google-forms',
    heading: 'Googleフォームによる情報の管理',
    paragraphs: [
      '当サイトのお問い合わせフォームに入力された情報は、Google LLC（以下「Google社」といいます）が提供するサービス「Googleフォーム」に送信され、Google社のサービス上で保管・管理されます。また、自動返信メールおよび当社への通知メールの送信には、Google社のサービス（Google Apps Script、Gmail）を利用しています。',
      'これらの情報は、Google社のサーバー（日本国外に所在する場合があります）に保存されます。Google社による情報の取り扱いについては、Google社のプライバシーポリシーをご確認ください。',
    ],
    links: [{ label: 'Google プライバシーポリシー', href: 'https://policies.google.com/privacy?hl=ja' }],
  },
  {
    id: 'third-party',
    heading: '第三者への提供',
    paragraphs: ['当社は、次の場合を除き、ご本人の同意を得ることなく個人情報を第三者に提供することはありません。'],
    list: [
      '法令に基づく場合',
      '人の生命、身体または財産の保護のために必要がある場合であって、ご本人の同意を得ることが困難であるとき',
      '国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ご本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき',
    ],
  },
  {
    id: 'security',
    heading: '安全管理',
    paragraphs: [
      '当社は、取得した個人情報の漏えい、滅失またはき損を防ぐため、情報にアクセスできる者を限定するなど、必要かつ適切な安全管理措置を講じます。',
    ],
  },
  // 「Cookie・アクセス解析」の章は、site.useGoogleAnalytics の設定に応じて
  // privacyAnalyticsOff / privacyAnalyticsOn のどちらかがここに入ります。
  {
    id: 'disclosure',
    heading: '開示・訂正・利用停止等のご請求',
    paragraphs: [
      'ご本人から、ご自身の個人情報について開示、訂正、追加、削除、利用の停止等のご請求があった場合は、ご本人であることを確認したうえで、法令に従い速やかに対応します。ご請求は、下記のお問い合わせ窓口までご連絡ください。',
    ],
  },
  {
    id: 'revision',
    heading: 'プライバシーポリシーの改定',
    paragraphs: [
      '当社は、法令の変更や事業内容の変化等に応じて、本ポリシーの内容を改定することがあります。改定後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。',
    ],
  },
];

/** Cookie・アクセス解析：Google Analytics を使わない場合（現在の設定） */
export const privacyAnalyticsOff: PrivacySection = {
  id: 'cookie',
  heading: 'Cookie・アクセス解析について',
  paragraphs: [
    '当サイトでは現在、Google Analytics等のアクセス解析ツールは使用しておらず、Cookieを利用して閲覧履歴などの情報を収集することはありません。',
    '今後アクセス解析ツール等を導入する場合は、本ポリシーを改定し、当サイトでお知らせします。',
  ],
};

/** Cookie・アクセス解析：Google Analytics を使う場合 */
export const privacyAnalyticsOn: PrivacySection = {
  id: 'cookie',
  heading: 'Cookie・アクセス解析（Google Analytics）について',
  paragraphs: [
    '当サイトでは、サイトの利用状況を把握し、サービスの向上に役立てるため、Google社が提供するアクセス解析ツール「Google Analytics」を利用しています。',
    'Google Analyticsは、Cookieを使用して、当サイトの閲覧状況（閲覧したページ、滞在時間、ご利用の端末やブラウザの種類、おおよその地域など）に関する情報を収集します。これらの情報は個人を特定するものではなく、Google社のプライバシーポリシーに基づいて管理されます。',
    'Cookieによる情報の収集を望まない場合は、ブラウザの設定でCookieを無効にするか、Google社が提供する「Google Analytics オプトアウト アドオン」を利用することで、収集を拒否することができます。',
  ],
  links: [
    {
      label: 'Google のサービスを使用するサイトやアプリから収集した情報の Google による使用',
      href: 'https://policies.google.com/technologies/partner-sites?hl=ja',
    },
    { label: 'Google Analytics オプトアウト アドオン', href: 'https://tools.google.com/dlpage/gaoptout?hl=ja' },
  ],
};
