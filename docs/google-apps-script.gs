/**
 * 株式会社bull お問い合わせフォーム用 Google Apps Script
 *
 * Googleフォームに回答が送信されたときに、次の2通のメールを送ります。
 *   1. 送信者への自動返信メール（入力内容の控えつき）
 *   2. bull宛ての通知メール（カテゴリが件名に入る）
 *
 * 使い方は docs/form-setup.md の「3. Apps Script を設定する」を参照してください。
 * このファイルの中身をすべて、Googleフォームの Apps Script エディタに貼り付けて使います。
 *
 * ★ 変更してよいのは、下の「設定」の部分だけです。
 */

// =====================================================================
// 設定（ここを書き換えてください）
// =====================================================================

/** 通知メールの送り先（bull側）。複数ある場合は「,」で区切る 例: 'info@example.com, tanigawa@example.com' */
const NOTIFY_TO = '【要入力】通知先メールアドレス';

/** メールの差出人として表示される名前 */
const FROM_NAME = '株式会社bull';

/**
 * 自動返信メールに送信者が「返信」したときの宛先。
 * 空のままなら、このスクリプトを設定したGoogleアカウントのアドレスに返信が届きます。
 */
const REPLY_TO = '';

/** 返信までの目安（自動返信メールの本文に入ります） 例: '3営業日以内' */
const REPLY_ESTIMATE = '【要入力】';

/** 自動返信メールの件名 */
const AUTO_REPLY_SUBJECT = '【株式会社bull】お問い合わせを受け付けました';

/**
 * 自動返信メールの本文。
 * 次の文字は、送信時に実際の内容に置き換わります。
 *   {name}     … お名前
 *   {company}  … 会社名
 *   {estimate} … 返信までの目安（REPLY_ESTIMATE）
 *   {details}  … 入力内容の控え
 */
const AUTO_REPLY_BODY = `{company}
{name} 様

このたびは、株式会社bullにお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けました。

内容を確認のうえ、担当者より{estimate}にご連絡いたします。
しばらくお待ちくださいますよう、お願いいたします。

――――――――――――――――――――
■ お問い合わせ内容の控え
――――――――――――――――――――
{details}
――――――――――――――――――――

※このメールは、お問い合わせフォームの送信時に自動でお送りしています。
※お心当たりのない場合は、お手数ですが本メールを破棄してください。
`;

/** 署名（自動返信メールの最後に入ります） */
const SIGNATURE = `――――――――――――――――――――
株式会社bull
〒【要入力】 東京都港区新橋3-3-14 田村町ビル10F
【要入力】ウェブサイトURL
――――――――――――――――――――`;

/**
 * 通知メール（bull宛て）の件名。
 * {category} はお問い合わせカテゴリ、{company} は会社名、{name} はお名前に置き換わります。
 */
const NOTIFY_SUBJECT = '【お問い合わせ】{category}／{company} {name} 様';

/**
 * Googleフォームの質問のタイトル。
 * ★ Googleフォームで付けた質問のタイトルと、1文字も違わないようにしてください。
 */
const QUESTIONS = {
  company: '会社名',
  name: 'お名前',
  email: 'メールアドレス',
  tel: '電話番号',
  category: 'お問い合わせカテゴリ',
  message: 'お問い合わせ内容',
};

// =====================================================================
// ここから下は、通常は変更しなくて大丈夫です
// =====================================================================

const TIME_ZONE = 'Asia/Tokyo';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * フォーム送信時に実行される関数。
 * トリガー（イベントの種類：フォーム送信時）にこの関数を設定してください。
 */
function onFormSubmit(e) {
  const answers = readAnswers_(e.response);
  const submittedAt = Utilities.formatDate(e.response.getTimestamp(), TIME_ZONE, 'yyyy年M月d日 HH:mm');

  sendNotification_(answers, submittedAt);
  sendAutoReply_(answers);
}

/** 回答を { company, name, ... } の形に整える */
function readAnswers_(response) {
  const byTitle = {};
  response.getItemResponses().forEach(function (itemResponse) {
    const answer = itemResponse.getResponse();
    byTitle[itemResponse.getItem().getTitle()] = Array.isArray(answer) ? answer.join(', ') : String(answer);
  });

  const answers = {};
  Object.keys(QUESTIONS).forEach(function (key) {
    answers[key] = (byTitle[QUESTIONS[key]] || '').trim();
  });
  return answers;
}

/** 入力内容を文章にまとめる */
function formatDetails_(answers) {
  return [
    '会社名：' + (answers.company || '（未入力）'),
    'お名前：' + (answers.name || '（未入力）'),
    'メールアドレス：' + (answers.email || '（未入力）'),
    '電話番号：' + (answers.tel || '（未入力）'),
    'お問い合わせカテゴリ：' + (answers.category || '（未入力）'),
    '',
    '【お問い合わせ内容】',
    answers.message || '（未入力）',
  ].join('\n');
}

/** {name} などの文字を、実際の内容に置き換える */
function fillTemplate_(template, values) {
  return template.replace(/\{(\w+)\}/g, function (match, key) {
    return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match;
  });
}

/** bull宛ての通知メール */
function sendNotification_(answers, submittedAt) {
  const subject = fillTemplate_(NOTIFY_SUBJECT, {
    category: answers.category || 'カテゴリ未選択',
    company: answers.company,
    name: answers.name,
  });

  const body = [
    'ウェブサイトのお問い合わせフォームから、新しいお問い合わせが届きました。',
    '',
    '受付日時：' + submittedAt,
    '',
    formatDetails_(answers),
    '',
    '――――――――――――――――――――',
    'このメールに返信すると、お問い合わせいただいた方（' + (answers.email || 'アドレス不明') + '）宛てになります。',
    '回答の一覧は、Googleフォームの「回答」タブで確認できます。',
  ].join('\n');

  const options = { name: FROM_NAME };
  if (EMAIL_PATTERN.test(answers.email)) options.replyTo = answers.email;

  MailApp.sendEmail(NOTIFY_TO, subject, body, options);
}

/** 送信者への自動返信メール */
function sendAutoReply_(answers) {
  // メールアドレスの形式が正しくない場合は送らない（いたずら・入力ミス対策）
  if (!EMAIL_PATTERN.test(answers.email)) {
    console.warn('メールアドレスの形式が正しくないため、自動返信を送りませんでした: ' + answers.email);
    return;
  }

  const body =
    fillTemplate_(AUTO_REPLY_BODY, {
      company: answers.company,
      name: answers.name,
      estimate: REPLY_ESTIMATE,
      details: formatDetails_(answers),
    }) +
    '\n' +
    SIGNATURE;

  const options = { name: FROM_NAME };
  if (REPLY_TO) options.replyTo = REPLY_TO;

  MailApp.sendEmail(answers.email, AUTO_REPLY_SUBJECT, body, options);
}

/**
 * 動作確認用。フォームに送信しなくても、メールの見え方を確認できます。
 * エディタ上部の関数の選択欄で「testSendMails」を選んで「実行」を押してください。
 * 自動返信メールも NOTIFY_TO の先頭のアドレスに届きます。
 */
function testSendMails() {
  const testAddress = NOTIFY_TO.split(',')[0].trim();
  const answers = {
    company: 'テスト株式会社',
    name: 'テスト 太郎',
    email: testAddress,
    tel: '03-0000-0000',
    category: '営業支援について',
    message: 'これはテスト送信です。\n2行目のテキストです。',
  };
  const now = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy年M月d日 HH:mm');

  sendNotification_(answers, now);
  sendAutoReply_(answers);
  console.log('テストメールを送信しました: ' + testAddress);
}
