import Lenis from "lenis";

export default defineNuxtPlugin((nuxtApp) => {
  // client-side에서만 실행
  if(process.client) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'verttical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    // 스크롤 이벤트와 RAF 연결
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // 글로벌 속성으로 Lenis 인스턴스 노출
    nuxtApp.provide('lenis', lenis);

    // 페이지 전환 시 상단으로 스크롤
    nuxtApp.hook('page: finish', () => {
      setTimeout(() => {
        lenis.scrollTo(0, { immediate: true });
      }, 50);
    });
  }
});