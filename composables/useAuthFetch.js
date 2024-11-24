export function useAuthFetch(url, options={}){
  // 이 부분에서 `token.value`는 현재 사용자의 인증 토큰을 가져옵니다.
const { token } = useUserDetails();

options.headers = {
    ...options.headers,
    ...(token.value && {Authorization: `Bearer ${token.value}`})
}

const config = useRuntimeConfig();
return useFetch(`${config.public.apiBase}${url}`, options);
}