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
import { useRouter } from 'vue-router';

const loading = ref(true);
const error = ref(null);
const userDetails = useUserDetails();
const router = useRouter();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const goToLogin = () => {
  navigateTo('/login');
};

onMounted(async () => {
  try {
    console.log("OAuthRedirect 컴포넌트 마운트됨");
    
    // URL에서 토큰 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const loginSuccess = urlParams.get('login_success');
    
    console.log("URL 파라미터:", { loginSuccess, token: token ? '토큰 있음' : '토큰 없음' });
     
    // 로그인 성공 파라미터가 있고 토큰이 있으면 처리
    if(loginSuccess === 'true' && token) {
      console.log("토큰 처리 시작");
      
      // 토큰 저장
      localStorage.setItem('access_token', token);
      
      try {
        // 토큰 디코딩
        const userInfo = jwtDecode(token);
        console.log("토큰 디코딩 성공:", userInfo);
        
        // 전역 사용자 상태 업데이트
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
        
        console.log("사용자 인증 정보 설정 완료");
        
        // 리다이렉트 URL 확인
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
        console.log("리다이렉트 예정 URL:", redirectUrl);

        // 세션 스토리지 정리
        sessionStorage.removeItem('redirectUrl');
        
        // Nuxt의 navigateTo 사용 (권장)
        await navigateTo(redirectUrl, { external: true});
        return;
      } catch (decodeError) {
        console.error("토큰 디코딩 실패:", decodeError);
        error.value = "토큰 처리 중 오류가 발생했습니다: " + decodeError.message;
      }
    } else {
      console.error("토큰 또는 로그인 성공 파라미터 없음");
      error.value = "인증 정보를 찾을 수 없습니다. 다시 로그인해 주세요.";
    }
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