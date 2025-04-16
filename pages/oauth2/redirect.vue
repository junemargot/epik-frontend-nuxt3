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

const loading = ref(true);
const error = ref(null);
const userDetails = useUserDetails();
const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};

onMounted(async () => {
  try {
    // URL에서 토큰 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      error.value = '토큰을 찾을 수 없습니다.';
      loading.value = false;
      return;
    }
    
    // 토큰 저장
    localStorage.setItem('access_token', token);
    
    // 토큰에서 사용자 정보 추출
    const userInfo = jwtDecode(token);
    
    // 전역 상태에 사용자 정보 저장
    userDetails.setAuthentication({
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      role: userInfo.role.map(role => role.authority),
      nickname: userInfo.nickname,
      token: token
    });
    
    // 리다이렉트 URL이 있으면 해당 URL로, 없으면 홈으로 이동
    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
    sessionStorage.removeItem('redirectUrl');
    router.push(redirectUrl);
    
  } catch (err) {
    console.error('OAuth 리다이렉트 처리 오류:', err);
    error.value = '로그인 처리 중 오류가 발생했습니다.';
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