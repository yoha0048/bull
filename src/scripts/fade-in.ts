/**
 * 下層ページ用の軽いフェードイン（GSAPを使わない）。
 * data-fade を付けた要素が画面に入ったら表示する。
 *
 * - 動きを減らす設定のときは何もしない（最初から表示されたまま）
 * - スクリプトが動かなかった場合も、要素は表示されたままになる
 *   （html に fade-ready クラスが付いたときだけ、CSSで非表示にするため）
 */
export function initFadeIn() {
  const root = document.documentElement;
  if (!root.classList.contains('motion-ok') || !('IntersectionObserver' in window)) return;

  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-fade]'));
  if (items.length === 0) return;

  // 最初から画面内にある要素は、ちらつかないよう先に表示済みにしておく
  items.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
  });
  root.classList.add('fade-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px' },
  );

  items.filter((el) => !el.classList.contains('is-in')).forEach((el) => observer.observe(el));
}
