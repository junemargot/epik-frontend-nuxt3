<template>
  <main class="login-in-wrap">
    <div class="login-in-inner">
      <section class="log-in__wrap small-wrap">
        <div class="log-in__intro">
          <h1 class="log-in__title intro-title">로그인</h1>
          <div class="log-in__text">당신의 일상에 특별한 문화 한 스푼, 지금 에픽에서 시작하세요.</div>
        </div>

        <!-- 로컬 로그인 -->
        <div class="log-in__form">
          <input class="log-in__id form" v-model="usernameModel" placeholder="아이디를 입력해주세요">
          <input type="password" class="log-in__password form" v-model="passwordModel" placeholder="비밀번호를 입력해주세요">
          <div class="message-container">
            <div v-if="memberCheck === false" class="small_text_red">
              아이디와 비밀번호를 확인해주세요
            </div>
            <div v-if="loginError" class="small_text_red">
              {{ loginErrorMessage }}
            </div>
          </div>
          <button class="long_btn" type="button" @click="localLoginHandler">로그인</button>
        </div>

        <!-- 소셜 로그인 -->
        <nav class="log-in__social">
          <ul class="log-in__icons">
            <!-- <li class="log-in__icon"><a @click.prevent="kakaoLoginHandler" class="log-in__kakao">카카오<br>로그인</a></li>
            <li class="log-in__icon"><a href="#" class="log-in__naver">네이버<br>로그인 </a></li>
            <li class="log-in__icon"><a @click.prevent="googleLoginHandler" class="log-in__google">구글<br>로그인 </a></li> -->
            <li class="log-in__icon"><a @click.prevent="socialLoginHandler('kakao')" class="log-in__kakao">카카오<br>로그인</a></li>
            <li class="log-in__icon"><a @click.prevent="socialLoginHandler('naver')" class="log-in__naver">네이버<br>로그인 </a></li>
            <li class="log-in__icon"><a @click.prevent="socialLoginHandler('google')" class="log-in__google">구글<br>로그인 </a></li>
            <!-- <li class="log-in__icon"><a @click.prevent="googleLoginHandler" class="log-in__google">구글<br>로그인 </a></li> -->
          </ul>
        </nav>

        <!-- 아이디/비밀번호 찾기 -->
        <div class="log-in__search">
          <nav>
            <ul class="log-in__search-form">
              <li><a href="http://localhost:3000/find/id" class="log-in__search-id">아이디찾기</a></li>
              <li><a href="http://localhost:3000/find/password" class="log-in__search-password">비밀번호찾기</a></li>
            </ul>
          </nav>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { googleTokenLogin } from 'vue3-google-login';
import { useAuthStore } from '~/stores/auth.js';

const { $kakao } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const apiBase = runtimeConfig.public.apiBase;
const router = useRouter();

const authStore = useAuthStore();
const userDetails = useUserDetails();
const usernameModel = ref('')
const passwordModel = ref('')
const memberCheck = ref('');

const loginError = ref(false);
const loginErrorMessage = ref('');

const feedMenuItems = ref([]);
const reportMenuItems = ref([]);

// 역할 정보 처리 함수
const processRoles = (roleData) => {
  if(!roleData) return [];

  if(Array.isArray(roleData)) {
    return roleData.map(role => {
      if(typeof role === 'object' && role !== null && role.authority) {
        return role.authority;
      }
      return role;
    })
    .filter(Boolean);
  }
  return [roleData].filter(Boolean);
};

/**
 * getMemberInfo 함수
 * localStorage에 저장된 JWT 토큰을 디코딩하여 사용자 정보를 전역 상태(userDetails)에 업데이트함.
 */
const getMemberInfo = async () => {
  try {
    const token = localStorage.getItem("access_token")
    if(!token) return;

    const userInfo = jwtDecode(token);
    console.log("User Info from token:", userInfo);
    console.log("역할 정보 원본: ", userInfo.role);
    console.log("처리된 역할 정보: ", processRoles(userInfo.role));
    
    // 전역 상태를 통해 인증 정보를 설정
    userDetails.setAuthentication({
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      nickname: userInfo.nickname,
      profileImg: userInfo.profileImg,
      role: processRoles(userInfo.role),
      token: token
    });
  } catch(error) {
    console.error("토큰 디코딩 오류: ", error);
  }
}

// ========= 로컬 로그인 =========
/**
 * 1. 사용자가 입력한 아이디(username)와 비밀번호(password)를 JSON으로 전송하여 백엔드 API에 로그인 요청.
 * 2. 백엔드에서 생성한 JWT 토큰을 응답으로 받아 localStorage에 저장.
 * 3. jwtDecode를 통해 토큰에서 사용자 정보를 추출 및 전역 상태에 저장.
 * 4. 사용자 역할에 따라 적절한 페이지로 리디렉션.
 */
const localLoginHandler = async () => {
  console.log('전송할 자격증명:', {
  username: usernameModel.value,
  password: passwordModel.value
});
  try {
    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usernameModel.value,
        password: passwordModel.value,
      }),
      credentials: 'include',
    });

    // 자세한 오류 정보 출력
    if (!response.ok) {
      const errorText = await response.text();
      console.error('로그인 실패 상세 정보:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      memberCheck.value = false;
      return;
    }

    const data = await response.json();
    
    // 토큰 확인 및 디버깅
    console.log('서버에서 받은 토큰:', data.token);
    
    if (!data.token || typeof data.token !== 'string' || !data.token.includes('.')) {
      console.error('유효하지 않은 토큰 형식:', data.token);
      loginError.value = true;
      loginErrorMessage.value = '인증 토큰 오류. 관리자에게 문의하세요.';
      return;
    }
    
    // 토큰 저장 및 Pinia 스토어 업데이트
    localStorage.setItem('access_token', data.token);

    const token = localStorage.getItem('access_token');
    const userInfo = jwtDecode(token); // JWT 디코딩하여 사용자 정보 추출
    console.log('유저 정보:', userInfo);
    console.log('역할 정보 원본:', userInfo.role);
    console.log('처리된 역할 정보:', processRoles(userInfo.role));

    // 추가 사용자 정보 저장 (명시적으로)
    localStorage.setItem("id", userInfo.id.toString());
    localStorage.setItem("username", userInfo.username);
    localStorage.setItem("email", userInfo.email || '');
    localStorage.setItem("nickname", userInfo.nickname || '');
    localStorage.setItem("profile_img", userInfo.profileImg || 'basic.png');
    localStorage.setItem("role", JSON.stringify(processRoles(userInfo.role)));

    // userDetails 업데이트
    userDetails.setAuthentication({
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      nickname: userInfo.nickname,
      profileImg: userInfo.profileImg,
      role: processRoles(userInfo.role),
      token: token
    });

    memberCheck.value = null;
    
    // 명시적으로 authStore 로그인 처리
    try {
      authStore.login(token);
    } catch (e) {
      console.error('authStore 로그인 오류:', e);
      // 오류가 있더라도 계속 진행
    }

    // 역할 정보 처리
    const memberRole = Array.isArray(userInfo.role) 
      ? userInfo.role.map(r => typeof r === 'object' ? r.authority : r)
      : [userInfo.role];

    // redirect 처리
    if (memberRole.includes('ROLE_MEMBER')) {
      const fullUrl = sessionStorage.getItem('redirectUrl') || '/';
      const redirectUrl = new URL(fullUrl, window.location.origin).pathname;
      sessionStorage.removeItem('redirectUrl');
      router.push(redirectUrl);
    } else if (memberRole.includes('ROLE_ADMIN')) {
      router.push('/admin');
    }

  } catch (error) {
    memberCheck.value = false;
    loginError.value = true;
    
    if (error.name === 'TypeError' && error.message.includes('not a function')) {
      loginErrorMessage.value = '시스템 오류가 발생했습니다. 관리자에게 문의하세요.';
      console.error('로컬 로그인 실패:', error);

    } else {
      loginErrorMessage.value = '아이디와 비밀번호를 확인해주세요';
      console.error('로컬 로그인 실패:', error);
    }
  }
};

/**
 * socialLoginHandler - Spring Security OAuth2 방식의 소셜 로그인
 * 1. 소셜 로그인 제공자(provider)에 따라 적절한 OAuth2 인증 엔드포인트로 리다이렉트
 * 2. 인증 성공 시 백엔드의 OAuth2AuthenticationSuccessHandler에서 JWT 토큰 발급
 * 3. 프론트엔드 리다이렉트 페이지에서 토큰을 받아 저장
 */
const socialLoginHandler = (provider) => {
  try {
    if(!['google', 'kakao', 'naver'].includes(provider)) {
      
      console.error('지원하지 않는 소셜 로그인 제공자: ', provider);
      return;
    }

    // 현재 페이지 경로 저장 (인증 후 다시 돌아오기 위함)
    const currentPath = window.location.pathname;
    if(currentPath !== '/login') {
      sessionStorage.setItem('redirectUrl', currentPath);
    }

    // Spring Security OAuth2 인증 엔드포인트로 리다이렉트
    const authorizationUrl = `${apiBase}/oauth2/authorization/${provider}`;    
    console.log(`소셜 로그인 리다이렉트 경로: ${authorizationUrl}`);

    // 페이지 이동
    window.location.href = authorizationUrl;
      
  } catch(error) {
    console.error(`소셜 로그인 오류 (${provider}): `, error);
    alert(`소셜 로그인 요청 중 오류가 발생했습니다: ${error.message}`);
  } 
};

/**
 * googleLoginHandler 구글 로그인
 * 1. vue3-google-login을 사용하여 구글 액세스토큰을 받아옴.
 * 2. 구글 사용자 정보 API를 호출하여 사용자 정보(이메일, ID, 이름 등) 추출.
 * 3. 백엔드 API (/auth/google-login)에 사용자 정보를 전송하여 JWT 토큰 발급 요청.
 * 4. 응답받은 토큰을 localStorage에 저장하고, getMemberInfo()로 전역 상태 업데이트.
 * 5. 원래 요청했던 URL(redirectUrl)로 리디렉션.
 */
const googleLoginHandler = async () => {
  try {
    // 1. 구글 클라이언트 ID
    const googleClientId = "795859274806-2738p5inaufnquiq0so9centtlsekvks.apps.googleusercontent.com";
    
    // 2. vue3-google-login 라이브러리를 이용해 구글 액세스 토큰 발급 요청
    const tokenResponse = await googleTokenLogin({ clientId: googleClientId })
    const token = tokenResponse.access_token;

    // 3. 구글 사용자 정보 API 호출: 발급받은 토큰을 통해 사용자 정보 조회
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const userInfo = await userInfoResponse.json();

    // 4. 백엔드의 구글 로그인 API 호출하여 사용자 정보 전송, JWT 토큰 발급 요청
    const response = await fetch(`${apiBase}/auth/google-login`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userInfo.email,
        id: userInfo.sub,
        name: userInfo.name,
        picture: userInfo.picture
      }),
      credentials: 'include'
    });

    console.log("구글 응답 클라이언트 확인: ", response);

    // 응답에서 JWT 토큰 추출
    const data = await response.json();

    // 5. JWT 토큰을 localStorage에 저장 및 사용자 전역 상태 업데이트
    localStorage.setItem("access_token", data.token);
    await getMemberInfo();

    // 6. 리다이렉트 URL이 저장되어있으면 해당 URL로, 아니면 기본 경로로 이동
    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
    sessionStorage.removeItem('redirectUrl');
    location.href = redirectUrl;
  
  } catch(error) {
    console.error("구글 로그인 실패: ", error);
  }
}

/**
 * kakaoLoginHandler 카카오 로그인
 * 1. Kakao SDK를 사용하여 카카오 로그인 실행 후 액세스토큰 획득.
 * 2. 백엔드 API (/auth/login/kakao)에 액세스토큰을 Authorization 헤더에 포함하여 전송.
 * 3. 백엔드에서 처리 후 응답받은 JWT 토큰을 localStorage에 저장.
 * 4. 필요한 경우 사용자 리다이렉션 처리.
 */
const kakaoLoginHandler = async () => {
  try {
    // 1. 카카오 SDK 초기화
    // $kakao.init(runtimeConfig.public.kakaoLoginApiKey);

    // 2. 카카오 로그인 실행
    const authObj = await $kakao.login();
    const { access_token } = authObj;

    // 3. 백엔드에 인증 코드 전송
    const response = await fetch(`${apiBase}/auth/login/kakao`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
      credentials: "include"
    });

    // 4. 백엔드 응답 처리
    const data = await response.json();
    localStorage.setItem('access_token', data.accessToken);
    
    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
    sessionStorage.removeItem('redirectUrl');
    location.href = redirectUrl;

  } catch(error) {
    console.error("카카오 로그인 실패: ", error);
  }
};

/**
 * 페이지가 마운트(로딩)될 때 localStorage에 저장된 JWT 토큰이 있으면,
 * 이를 디코딩하여 전역 사용자 정보(userDetails)를 업데이트.
 */
 onMounted(() => {
  // 기존 토큰 확인
  const token = localStorage.getItem("access_token");

  if(token) {
    try {
      const userInfo = jwtDecode(token);
      console.log('마운트 시 유저 정보: ', userInfo);
      console.log('마운트 시 역할 정보 원본: ', userInfo.role);
      console.log('마운트 시 처리된 역할 정보: ', processRoles(userInfo.role));
      
      // 토큰이 유효한지 확인 (만료 시간)
      const currentTime = Date.now() / 1000;
      if(userInfo.exp && userInfo.exp > currentTime) {
        // 전역 사용자 상태 업데이트
        userDetails.setAuthentication({
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        role: processRoles(userInfo.role),
        nickname: userInfo.nickname,
        profileImg: userInfo.profileImg,
        token: token
        });

        authStore.login();

        // 이미 로그인된 경우 홈으로 리다이렉트
        router.push('/');

      } else {
        // 만료 토큰 제거
        localStorage.removeItem('access_token');
      }
    } catch(error) {
      console.error("토큰 디코딩 오류: ", error);
      localStorage.removeItem('access_token');
    }
  }
});
</script>

<style>
@import url('/public/css/login/login.css');
.message-container {
  min-height: 13px;
  transition: height 0.2s ease;
}

.long_btn:hover {
  background-color: var(--accent-1);
  color: var(--white);
  cursor: pointer;
}

.log-in__icon {
  cursor: pointer;
}

.small_text_red {
  color: var(--accent-1);
  margin: 0 0 0 4px;
  font-size: var(--font-size-5);
}
</style>