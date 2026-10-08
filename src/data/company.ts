/**
 * 会社情報。
 * 未定の項目は【要入力】のままにしてあります。決まったら値を書き換えてください。
 * 情報を推測で埋めないこと（CLAUDE.md 参照）。
 */

export const TBD = '【要入力】';

export const company = {
  name: '株式会社bull',
  representative: '谷川 豪',
  representativeTitle: TBD,
  postalCode: TBD,
  address: '東京都港区新橋3-3-14 田村町ビル10F',
  established: TBD,
  capital: TBD,
  tel: TBD,
  email: TBD,
  business: [
    '営業支援・営業代行',
    '販路拡大支援',
    '海外展開・国際ビジネス支援',
    'ビジネスマッチング・ネットワーク支援',
  ],
} as const;

/** 値が未入力（【要入力】）かどうか */
export const isTBD = (value: string) => value === TBD;
