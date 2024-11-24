export function useDataFetch(url, options = {}) {
  const config = useRuntimeConfig(); // nuxt3 환경에서 config 설정 가져옴

  return $fetch(`${config.public.apiBase}/${url}`, options); // 설정파일에 / 로 끝냈으면 / 빼줘야함. 경로 설정
}

// auth fetch -> usefetch SSR
