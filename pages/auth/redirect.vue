<template>
  <div class="oauth-redirect">
    <div v-if="loading" class="loading">
      <p>로그인 처리 중입니다...</p>
    </div>
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="goToLogin">로그인 페이지로 돌아가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { useRuntimeConfig } from '#app';
definePageMeta({
  middleware: ['auth'] // 이런 미들웨어가 있는지 확인
})

const loading = ref(true);
const error = ref(null);
const userDetails = useUserDetails();
const router = useRouter();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const goToLogin = () => {
  router.push('/login');
};

/**
 * 토큰 처리 함수
 * 전달받은 JWT 토큰을 저장하고 사용자 정보 설정
 * 
 * @param token JWT 토큰
 */
const handleToken = (token) => {
  try {
    // 토큰 저장 (HTTP-Only 쿠키를 사용하지 않는 경우)
    localStorage.setItem('access_token', token);
    
    // 토큰에서 사용자 정보 추출
    const userInfo = jwtDecode(token);
    console.log('디코딩된 사용자 정보: ', userInfo);
    
    // 전역 상태에 사용자 정보 저장
    userDetails.setAuthentication({
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      role: Array.isArray(userInfo.role) ? 
            userInfo.role.map(r => typeof r === 'string' ? r : r.authority) : 
            [userInfo.role],
      nickname: userInfo.nickname,
      token: token
    });

    alert('✅ 로그인 상태 반영 완료');
    
    // 리다이렉트
    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
    sessionStorage.removeItem('redirectUrl');
    router.push(redirectUrl);
  } catch (err) {
    console.error('토큰 처리 오류:', err);
    throw err;
  }throw err; // 상위 try-catch로 전달
};

onMounted(async () => {
  try {
    // URL에서 토큰 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const loginSuccess = urlParams.get('login_success');
     
    // 로그인 성공 파라미터가 있고 토큰이 있으면 처리
    if(loginSuccess === 'true' && token) {
      console.log("OAuth 리다이렉트: 토큰 파라미터 발견");
      handleToken(token);
      return;
    }

    // 토큰 파라미터가 없으면 에러 처리
    error.value = "인증 정보를 찾을 수 없습니다. 다시 로그인해 주세요.";
  } catch (err) {
    console.error('OAuth 리다이렉트 처리 오류:', err);
    error.value = '로그인 처리 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류');
  } finally {
    loading.value = false;
  }
});

</script>

<style scoped>
.oauth-redirect {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.loading, .error {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error {
  color: var(--accent-1);
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--accent-1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>