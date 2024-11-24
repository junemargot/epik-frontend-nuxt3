// plugins/api.js
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  return {
    provide: {
      // api: $fetch.create({
      //   baseURL: config.public.apiBase || 'http://localhost:8081/api/v1'
      // })
      api: (url, options = {}) => {
        return useFetch(url, {
          baseUrl: config.public.apiBase || 'http://localhost:8081/api/v1',
          ...options // 추가 옵션을 전달
        })
      }
    }
  }
})

// 'http://localhost:8081/api/v1/