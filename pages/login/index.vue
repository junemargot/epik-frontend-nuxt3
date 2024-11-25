<template>
  <main class="login-in-wrap">
    <section class="log-in__wrap small-wrap">

      <div class="log-in__intro">
        <h1 class="log-in__title intro-title">로그인</h1>
        <div class="log-in__text">에픽의 다양한 정보들을 받아보실 수 있어요.</div>
      </div>

      <div class="log-in__form">
        <h2 hidden>로그인 입력폼</h2>
        <div class="message-container">
          <div v-if="memberCheck === false" class="small_text_red">아이디와 비밀번호를 확인해주세요</div>
        </div>
        <input class="log-in__id form" v-model="usernameModel" placeholder="아이디를 입력해주세요">
        <input type="password" class="log-in__password form" v-model="passwordModel" placeholder="비밀번호를 입력해주세요">
        <button class="long_btn" type="button" @click="localLoginHandler">로그인</button>
      </div>

      <nav class="log-in__social">
        <h2 hidden>쇼셜 로그인폼</h2>
        <!-- <button class="long_btn"><a @click.prevent="googleLoginHandler" class="log-in__google"> 구글 로그인 </a></button> -->
        <ul class="log-in__icons">
          <!-- <li class="log-in__icon"><a href="#" class="log-in__kakao">카카오<br>로그인</a></li>
          <li class="log-in__icon"><a href="#" class="log-in__naver">네이버<br>로그인 </a></li> -->
          <li class="log-in__icon"><a @click.prevent="googleLoginHandler" class="log-in__google">구글<br>로그인 </a></li>
        </ul>
      </nav>

      <div class="log-in__search">
        <h2 hidden>아이디,비밀번호 찿기</h2>
        <nav>
          <ul class="log-in__search-form">
            <li><a href="http://localhost:3001/find/id" class="log-in__search-id">아이디찾기</a></li>
            <li><a href="http://localhost:3001/find/password" class="log-in__search-password">비밀번호찾기</a></li>
          </ul>
        </nav>
      </div>

    </section>
  </main>
</template>

<script setup>
//로컬 로그인
import { jwtDecode } from 'jwt-decode';
import { ref, onMounted } from 'vue';
import { decodeCredential, googleTokenLogin } from 'vue3-google-login';

const userDetails = useUserDetails();
const query = useRoute();

const usernameModel = ref('')
const passwordModel = ref('')
const memberCheck = ref('');


// === callback funtions =========================================



onMounted(() => {
  let token = localStorage.getItem("access_token");  // 로컬스토리지에서 토큰 가져오기

  if (token) {
    // 토큰이 있으면, 토큰을 디코딩하여 사용자 정보 추출
    const userInfo = jwtDecode(token);  // JWT 토큰 디코딩
    userDetails.setAuthentication({
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      role: userInfo.role.map(role => role.authority),
      nickname: userInfo.nickname,
      token: token
    });

    console.log("로컬에 있던 토큰 사용했당")
    console.log(userDetails.nickname)


    localStorage.setItem("username", userInfo.username)

  }
})

//로그인 후 페이지 이동 url 저장

const localLoginHandler = async () => {
  try {
    console.log("전송");

    //패치
    const response = await useDataFetch("auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        username: usernameModel.value,
        password: passwordModel.value
      },
      credentials: 'include'
    });

    //토큰에서 정보 받고 로컬에 저장
    localStorage.setItem("access_token", response.token)
    console.log("토큰 확인-" + response.token)

    


    // await getMemberInfo();

    console.log("토큰 분해 중 ")

    let token = localStorage.getItem("access_token")
    let userInfo = jwtDecode(token);
    console.log("User Info from token:", userInfo);
    // 상태에 사용자 정보 설정
    userDetails.setAuthentication({
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      nickname: userInfo.nickname,
      role: userInfo.role.map((role) => role.authority),
      token: token
    });
    userInfo.role.map(role => { console.log(role.authority) });

    const memberRole = userInfo.role.map((role) => role.authority);
    console.log(memberRole);


    localStorage.setItem("username",userInfo.username)


    console.log("새로운 토큰 사용했당")
    memberCheck.value = null;

    if (memberRole.includes("ROLE_MEMBER")) {
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/'; // 기본 페이지는 '/'로 설정
      sessionStorage.removeItem('redirectUrl'); // 리디렉션 후 URL 삭제
      console.log("돌아갈곳 확인-" + redirectUrl)
      location.href = redirectUrl;
    }
    else if (memberRole.includes("ROLE_ADMIN")) {
      location.href = 'http://localhost:3001/admin'
    }
  } catch {
    memberCheck.value = false;
  }
}

const getMemberInfo = async () => {
  console.log("토큰 분해 중 ")
  try {
    let token = localStorage.getItem("access_token")
    let userInfo = jwtDecode(token);
    console.log("User Info from token:", userInfo);
    // 상태에 사용자 정보 설정
    userDetails.setAuthentication({
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      nickname: userInfo.nickname,
      role: userInfo.role.map((role) => role.authority),
      token: token
    });
    userInfo.role.map(role => { console.log(role, role.authority) });

    console.log("새로운 토큰 사용했당")
  }
  catch {
    console.log("옲ㅍ")
  }
}

const googleLoginHandler = async () => {
  let token;
  let userInfo

  const googleClientId = "795859274806-2738p5inaufnquiq0so9centtlsekvks.apps.googleusercontent.com";
  {
    let response = await googleTokenLogin(
      { clientId: googleClientId, }
    );
    console.log(response);
    token = response.access_token;
  }
  console.log(token);

  {
    let response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    userInfo = await response.json();
    console.log(userInfo);
    console.log(userInfo.email);
  }
  console.log(userInfo.email, userInfo.sub, userInfo.name);
  {
    const response = await fetch("http://localhost:8081/api/v1/auth/google-login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userInfo.email,
          id: userInfo.sub,
          name: userInfo.name,
        }),
        credentials: 'include'
      });
    const data = await response.json();
    console.log(data);

    console.log("리스판스 콘솔 확인-" + data.token)

    localStorage.setItem("access_token", data.token)
    getMemberInfo()

    //원래있던 url로 이동
    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/'; // 기본 페이지는 '/'로 설정
    sessionStorage.removeItem('redirectUrl'); // 리디렉션 후 URL 삭제
    location.href = redirectUrl; // 해당 URL로 리디렉션
  }
}


</script>

<style>
@import url('/public/css/login/login.css');

.message-container {
  min-height: 13px;
  /* 메시지 공간의 최소 높이를 설정 */
  transition: height 0.2s ease;
  /* 부드러운 전환 효과 */
}

.long_btn:hover {
  background-color: var(--accent-1);
  color: white;
  cursor: pointer;
}

.log-in__icon {
  cursor: pointer;
}
</style>