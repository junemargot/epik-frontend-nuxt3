// plugins/kakao.js 전체 코드
export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const runtimeConfig = useRuntimeConfig();
    const kakaoLoginKey = runtimeConfig.public.kakaoLoginApiKey;

    let isKakaoLoaded = false;

    // SDK 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.defer = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoLoginKey);
        isKakaoLoaded = true;
        console.log('Kakao SDK 초기화 완료');
      }
    };
    document.head.appendChild(script);

    return {
      provide: {
        kakao: {
          login: () => {
            return new Promise((resolve, reject) => {
              const checkInterval = setInterval(() => {
                if (isKakaoLoaded) {
                  clearInterval(checkInterval);
                  window.Kakao.Auth.login({
                    success: resolve,
                    fail: reject,
                  });
                }
              }, 100);
            });
          }
        }
      }
    };
  }
});
