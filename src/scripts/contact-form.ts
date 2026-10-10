/**
 * お問い合わせフォームの入力チェックと送信。
 *
 * 送信の流れ：
 *   入力チェック → スパム判定 → Googleフォームへ送信 → /contact/thanks/ へ移動
 *
 * Googleフォームは別のサイト（docs.google.com）なので、送信結果の中身は読み取れない（no-cors）。
 * 通信自体が失敗したときだけエラーを表示する。
 */
import {
  fields,
  googleForm,
  isGoogleFormConfigured,
  minFillTimeMs,
  type FieldDef,
} from '../data/contactForm';

const THANKS_URL = '/contact/thanks/';

// メールアドレスの形式（一般的な形のみを許可する簡易チェック）
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 電話番号：数字・ハイフン・括弧・プラス・空白のみ、数字は10〜15桁
const TEL_CHARS = /^[0-9０-９+＋\-－‐ー()（）\s]+$/;

type FieldKey = FieldDef['key'] | 'agree';

const messages = {
  required: (label: string) => `${label}を入力してください。`,
  requiredSelect: (label: string) => `${label}を選択してください。`,
  email: 'メールアドレスの形式が正しくありません（例：taro@example.co.jp）。',
  tel: '電話番号は、数字とハイフンで入力してください（例：03-1234-5678）。',
  agree: 'プライバシーポリシーへの同意が必要です。',
  tooLong: (label: string, max: number) => `${label}は${max}文字以内で入力してください。`,
};

export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const summary = form.querySelector<HTMLElement>('[data-form-summary]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const submitButton = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const honeypot = form.querySelector<HTMLInputElement>('[data-honeypot]');
  const openedAt = Date.now();
  let submitting = false;
  let submitted = false;

  const inputsOf = (key: FieldKey) =>
    Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`[data-input="${key}"]`));

  const valueOf = (key: FieldKey) => {
    const inputs = inputsOf(key);
    if (inputs[0] instanceof HTMLInputElement && inputs[0].type === 'radio') {
      return (inputs as HTMLInputElement[]).find((el) => el.checked)?.value ?? '';
    }
    return inputs[0]?.value.trim() ?? '';
  };

  /** 1項目をチェックし、エラー文（なければ空文字）を返す */
  const validate = (key: FieldKey): string => {
    if (key === 'agree') {
      const checkbox = inputsOf('agree')[0] as HTMLInputElement | undefined;
      return checkbox?.checked ? '' : messages.agree;
    }

    const def = fields.find((f) => f.key === key)!;
    const value = valueOf(key);

    if (!value) {
      if (!def.required) return '';
      return def.type === 'radio' ? messages.requiredSelect(def.label) : messages.required(def.label);
    }
    if (def.maxLength && value.length > def.maxLength) return messages.tooLong(def.label, def.maxLength);
    if (def.type === 'email' && !EMAIL_PATTERN.test(value)) return messages.email;
    if (def.type === 'tel') {
      const digits = value.replace(/[^0-9０-９]/g, '');
      if (!TEL_CHARS.test(value) || digits.length < 10 || digits.length > 15) return messages.tel;
    }
    return '';
  };

  /** エラー表示を更新 */
  const showError = (key: FieldKey, message: string) => {
    const errorEl = form.querySelector<HTMLElement>(`[data-error-for="${key}"]`);
    if (errorEl) errorEl.textContent = message;

    const invalid = message ? 'true' : 'false';
    const fieldset = form.querySelector<HTMLFieldSetElement>(`fieldset[data-field="${key}"]`);
    if (fieldset) {
      fieldset.setAttribute('aria-invalid', invalid);
      return;
    }
    inputsOf(key).forEach((el) => el.setAttribute('aria-invalid', invalid));
  };

  const allKeys: FieldKey[] = [...fields.map((f) => f.key), 'agree'];

  // 入力欄を離れたとき・入力し直したときにチェック（一度エラーになった項目は入力中も更新）
  allKeys.forEach((key) => {
    inputsOf(key).forEach((el) => {
      el.addEventListener('blur', () => {
        if (el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox')) return;
        if (el.value.trim() !== '' || el.getAttribute('aria-invalid') === 'true') {
          showError(key, validate(key));
        }
      });
      el.addEventListener('input', () => {
        if (el.getAttribute('aria-invalid') === 'true') showError(key, validate(key));
      });
      el.addEventListener('change', () => {
        if (el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox')) {
          showError(key, validate(key));
        }
      });
    });
  });

  const showSummary = (html: string) => {
    summary.innerHTML = html;
    summary.hidden = false;
    summary.focus();
  };

  const setSending = (sending: boolean) => {
    submitting = sending;
    submitButton.disabled = sending;
    submitButton.setAttribute('aria-busy', String(sending));
    submitLabel.textContent = sending ? '送信しています…' : '入力内容を送信する';
    status.textContent = sending ? '送信しています。しばらくお待ちください。' : '';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // 二重送信の防止
    if (submitting || submitted) return;

    // 1. 入力チェック
    const errors = allKeys
      .map((key) => ({ key, message: validate(key) }))
      .filter((e) => e.message !== '');
    allKeys.forEach((key) => showError(key, errors.find((e) => e.key === key)?.message ?? ''));

    if (errors.length > 0) {
      const items = errors
        .map((e) => {
          const target = form.querySelector(`[data-field="${e.key}"] [data-input]`)?.id;
          const text = escapeHtml(e.message);
          return `<li>${target ? `<a href="#${target}">${text}</a>` : text}</li>`;
        })
        .join('');
      showSummary(`<strong>入力内容をご確認ください（${errors.length}件）</strong><ul>${items}</ul>`);
      return;
    }
    summary.hidden = true;

    // 2. スパム判定：隠し欄に入力がある／開いてすぐの送信 → 送信せずに完了画面へ
    const tooFast = Date.now() - openedAt < minFillTimeMs;
    if ((honeypot && honeypot.value !== '') || tooFast) {
      submitted = true;
      window.location.assign(THANKS_URL);
      return;
    }

    if (!isGoogleFormConfigured) {
      showSummary(
        '<strong>送信先が設定されていません</strong>Googleフォームの送信先URLと項目IDを src/data/contactForm.ts に設定してください（docs/form-setup.md）。',
      );
      return;
    }

    // 3. Googleフォームへ送信
    const body = new URLSearchParams();
    fields.forEach((f) => {
      const value = valueOf(f.key);
      if (value !== '') body.append(googleForm.entries[f.key], value);
    });

    setSending(true);
    try {
      await fetch(googleForm.actionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body,
      });
      submitted = true;
      window.location.assign(THANKS_URL);
    } catch {
      setSending(false);
      showSummary(
        '<strong>送信できませんでした</strong>通信環境をご確認のうえ、時間をおいてもう一度お試しください。入力内容はそのまま残っています。',
      );
    }
  });

  // 戻るボタンで送信完了ページから戻ってきたときに、ボタンを押せる状態に戻す
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      submitted = false;
      setSending(false);
    }
  });
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
