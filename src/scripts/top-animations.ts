/**
 * TOPページのスクロール演出（演出A「Horizon Line」）
 *
 * - 動きを減らす設定（prefers-reduced-motion: reduce）のときは何もしない。
 *   その場合、HTML/CSSだけで全ての内容が静止状態で読めるようになっている。
 * - 動かすのは transform / opacity / SVGの線の描画だけにして、スマホでも軽くする。
 * - Heroの最初の表示アニメーションはCSSで行っている（index.astro）。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  root.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

export function initTopAnimations() {
  // スマホのアドレスバーの伸び縮みで再計算しない（カクつき防止）
  ScrollTrigger.config({ ignoreMobileResize: true });

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    heroParallax();
    reveals();
    connection();
    forYou();
    ctaLine();
    // フォント読み込み後に位置を再計算する
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  // What We Do はPCとスマホで線の向きが違う
  mm.add(
    {
      desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
    },
    (context) => {
      whatWeDo(Boolean(context.conditions?.desktop));
    },
  );

  // 動きを減らす設定に切り替えたときは、CSSの初期状態も解除する
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
    document.documentElement.classList.toggle('motion-ok', !event.matches);
  });
}

/** Hero：スクロールでコピーがゆっくり上へ抜ける */
function heroParallax() {
  const copy = $('[data-hero-copy]');
  const horizon = $('[data-hero-horizon]');
  if (!copy || !horizon) return;

  const trigger = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to(copy, { yPercent: -18, ease: 'none', scrollTrigger: trigger });
  gsap.to(horizon, { xPercent: -8, ease: 'none', scrollTrigger: trigger });
}

/** data-reveal：画面に入ったらふわっと表示 */
function reveals() {
  const items = $$('[data-reveal]');
  gsap.set(items, { autoAlpha: 0, y: 32 });
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }),
  });
}

/** 線の長さに合わせて「描画前」の状態にする */
function prepareStroke(paths: SVGPathElement[]) {
  paths.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  });
}

/**
 * Connection：画面を固定し、スクロールに合わせて
 * 「点が現れる → 線が伸びる → 画面の外へ → 流れ出す」を6段階で見せる
 */
function connection() {
  const section = $('[data-connection]');
  const stage = $('[data-connection-stage]');
  if (!section || !stage) return;

  const phrases = $$('[data-connection-phrase]', section);
  const counter = $('[data-connection-counter]', section);
  const progress = $('[data-connection-progress]', section);
  const group = (i: number) => $<SVGGElement>(`[data-group="${i}"]`, section);
  const steps = phrases.length;

  // 初期状態
  const edges = $$<SVGPathElement>('.edge', section);
  prepareStroke(edges);
  gsap.set($$<SVGGElement>('.node', section), {
    scale: 0,
    opacity: 0,
    transformOrigin: '50% 50%',
  });
  gsap.set($$<SVGCircleElement>('.spark', section), {
    scale: 0,
    opacity: 0,
    transformOrigin: '50% 50%',
  });
  const flows = $$<SVGPathElement>('.flow', section);
  flows.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: `${length * 0.05} ${length * 0.12}`, strokeDashoffset: 0 });
  });

  let currentStep = 0;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: () => `+=${window.innerHeight * steps * 0.85}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const step = Math.min(steps - 1, Math.floor(self.progress * steps));
        if (step !== currentStep && counter) {
          currentStep = step;
          counter.textContent = String(step + 1).padStart(2, '0');
        }
      },
    },
  });

  for (let i = 0; i < steps; i++) {
    const at = `step${i}`;
    tl.addLabel(at, i === 0 ? 0 : '+=0.5');

    // 文言の切り替え
    if (i > 0) {
      tl.to(phrases[i - 1], { autoAlpha: 0, y: -24, duration: 0.4, ease: 'power1.in' }, at);
      tl.fromTo(
        phrases[i],
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        `${at}+=0.3`,
      );
    }

    const g = group(i);
    if (!g) continue;

    if (i <= 3) {
      // 0〜3：点が現れ、線が伸びる（3は画面の外まで伸びる線）
      tl.to($$('.node', g), { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, at);
      tl.to($$('.edge', g), { strokeDashoffset: 0, duration: 1, stagger: 0.12 }, at);
    } else if (i === 4) {
      // 4：新しい可能性 ＝ 小さな点が次々に生まれる
      tl.to($$('.spark', g), { scale: 1, opacity: 0.6, duration: 0.3, stagger: { each: 0.03, from: 'random' } }, at);
    } else {
      // 5：ビジネスが動き出す ＝ すべての線の上を光が右へ流れる
      tl.to(flows, { opacity: 0.85, duration: 0.3 }, at);
      tl.to(flows, { strokeDashoffset: (_, el: SVGPathElement) => -el.getTotalLength() * 0.6, duration: 1.6 }, at);
    }
  }

  // 最後の余韻
  tl.to({}, { duration: 0.4 });

  if (progress) {
    tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: tl.duration() }, 0);
  }

  // スマホでは画面より大きい図をスクロールに合わせて右へ送り、伸びていく線の先を追いかける
  const svg = $<SVGSVGElement>('.connection__svg', section);
  if (svg) {
    const panX = () =>
      window.innerWidth < 768
        ? -Math.max(0, svg.getBoundingClientRect().width * 0.85 - window.innerWidth)
        : 0;
    tl.fromTo(svg, { x: 0 }, { x: panX, duration: tl.duration() }, 0);
  }
}

/** For You：線が下へ伸び、通過した項目の点が灯る */
function forYou() {
  const list = $('[data-foryou-list]');
  const track = $('[data-foryou-track]');
  if (!list || !track) return;

  gsap.fromTo(
    track,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 60%', scrub: 0.4 },
    },
  );

  $$('[data-foryou-item]', list).forEach((item) => {
    gsap.from(item, {
      autoAlpha: 0,
      x: 24,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%', once: true },
    });
    ScrollTrigger.create({
      trigger: item,
      start: 'top 62%',
      toggleClass: { targets: item, className: 'is-active' },
      end: 'max',
    });
  });
}

/** What We Do：4つの事業を一本の線がつなぐ（PCは横、スマホは縦） */
function whatWeDo(isDesktop: boolean) {
  const section = $('[data-wwd]');
  const rail = $('[data-wwd-rail]');
  if (!section || !rail) return;

  const items = $$('[data-wwd-item]', section);
  const track = items[0]?.parentElement;
  if (!track) return;

  gsap.fromTo(
    rail,
    isDesktop ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
    {
      scaleX: 1,
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: track,
        start: 'top 80%',
        end: isDesktop ? 'top 30%' : 'bottom 70%',
        scrub: 0.4,
      },
    },
  );

  gsap.set(items, { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch(items, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15 }),
  });
}

/** CTA：水平線が左から伸びる */
function ctaLine() {
  const line = $('[data-cta-line]');
  if (!line) return;

  gsap.fromTo(
    line,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '[data-cta]', start: 'top 80%', end: 'center 50%', scrub: 0.4 },
    },
  );
}
