/**
 * お問い合わせフォームの設定。
 *
 * ★ Googleフォームを作ったら、このファイルの googleForm だけを書き換えてください。
 *   調べ方は docs/form-setup.md の「2. 送信先URLと項目IDを調べて、サイトに反映する」を参照。
 */
import { company, TBD } from './company';

/**
 * お問い合わせの受付方法。
 * - 'tel'  … 電話での受付のみ（2026-10-24 決定。フォームは表示しない）
 * - 'form' … サイト独自フォーム（送信先Googleフォーム）
 * フォームを再開するときは 'form' に戻し、下の googleForm を設定する。
 */
export const contactMode: 'tel' | 'form' = 'tel';

/** 電話受付の表示内容（contactMode が 'tel' のとき使用）。電話番号は company.tel */
export const telContact = {
  tel: company.tel,
  /** 受付時間（例：'平日 10:00〜18:00'） */
  hours: TBD,
  /** 受付時間の補足（例：'土日祝・年末年始を除く'）。空なら表示しない */
  hoursNote: '',
};

export const googleForm = {
  /**
   * 送信先URL。Googleフォームの URL の末尾を「viewform」から「formResponse」に変えたもの。
   * 例: 'https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxxxxxxxxxx/formResponse'
   */
  actionUrl: '',
  /** 各項目のID（「entry.」+ 数字）。例: 'entry.123456789' */
  entries: {
    company: '',
    name: '',
    email: '',
    tel: '',
    category: '',
    message: '',
  },
};

/** 送信先URLとすべての項目IDが設定済みかどうか */
export const isGoogleFormConfigured =
  /^https:\/\/docs\.google\.com\/forms\/.+\/formResponse$/.test(googleForm.actionUrl) &&
  Object.values(googleForm.entries).every((id) => /^entry\.\d+$/.test(id));

/**
 * お問い合わせカテゴリ。
 * ★ Googleフォーム側の選択肢と、1文字も違わないように合わせてください。
 */
export const categories = [
  '営業支援について',
  '販路拡大について',
  '海外ビジネスについて',
  'ビジネスマッチングについて',
  'その他',
] as const;

export type FieldKey = keyof typeof googleForm.entries;

export type FieldDef = {
  key: FieldKey;
  label: string;
  required: boolean;
  type: 'text' | 'email' | 'tel' | 'radio' | 'textarea';
  autocomplete?: string;
  placeholder?: string;
  maxLength?: number;
  note?: string;
};

/** 入力欄の定義（並び順もこのとおり）。必須・任意は required で切り替えられる */
export const fields: FieldDef[] = [
  {
    key: 'company',
    label: '会社名',
    required: true,
    type: 'text',
    autocomplete: 'organization',
    placeholder: '例）株式会社〇〇',
    maxLength: 100,
  },
  {
    key: 'name',
    label: 'お名前',
    required: true,
    type: 'text',
    autocomplete: 'name',
    placeholder: '例）山田 太郎',
    maxLength: 50,
  },
  {
    key: 'email',
    label: 'メールアドレス',
    required: true,
    type: 'email',
    autocomplete: 'email',
    placeholder: '例）taro@example.co.jp',
    maxLength: 254,
    note: '入力されたアドレスに、受付完了の自動返信メールをお送りします。',
  },
  {
    key: 'tel',
    label: '電話番号',
    required: false,
    type: 'tel',
    autocomplete: 'tel',
    placeholder: '例）03-1234-5678',
    maxLength: 20,
  },
  {
    key: 'category',
    label: 'お問い合わせカテゴリ',
    required: true,
    type: 'radio',
  },
  {
    key: 'message',
    label: 'お問い合わせ内容',
    required: true,
    type: 'textarea',
    placeholder: 'ご相談内容をご自由にお書きください。まだ具体的になっていないご相談でもかまいません。',
    maxLength: 3000,
  },
];

export const contactPage = {
  labelEn: 'Contact',
  title: ['お問い合わせ'],
  lead: ['まだかたちになっていないご相談でも、歓迎します。', 'まずはお気軽にお聞かせください。'],
  /** 返信までの目安（例：'3営業日以内'）。お問い合わせページと送信完了ページに表示 */
  replyEstimate: TBD,
  /** 電話受付時の補足文（案） */
  telNote: 'お電話の際は、会社名・お名前と、ご相談の内容を簡単にお伝えください。',
};

export const thanksPage = {
  labelEn: 'Thank you',
  title: ['お問い合わせ', 'ありがとうございます。'],
  body: [
    'お問い合わせを受け付けました。',
    'ご入力いただいたメールアドレスに、受付完了の自動返信メールをお送りしています。',
  ],
  noMailNote:
    '自動返信メールが届かない場合は、迷惑メールフォルダに振り分けられていないかご確認ください。それでも見当たらない場合は、メールアドレスの入力に誤りがあった可能性があります。お手数ですが、もう一度お問い合わせください。',
};

/** スパム対策：ページを開いてから送信までの最短時間（ミリ秒）。これより早い送信は機械的な送信とみなす */
export const minFillTimeMs = 3000;
