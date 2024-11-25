<script setup>
import { useRouter } from 'vue-router'

import { ref, onMounted } from 'vue';
const memberCheck = ref("");
import { jwtDecode } from 'jwt-decode';

const userDetails = useUserDetails();  // 사용자 정보를 가져오는 함수

//로컬호스트 유지
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
      token: token
    });
    console.log("로컬에 있던 토큰 사용했당")
  }

})

//로그인 화면 이동 핸들러
const goToLoginPageHandler = () => {
  // 현재 페이지의 URL을 sessionStorage에 저장
  const currentUrl = window.location.href;
  console.log("이동할 페이지 저장했다-" + currentUrl)
  sessionStorage.setItem('redirectUrl', currentUrl);  // 로그인 후 리디렉션할 URL 저장
  // 로그인 페이지로 이동
  location.href = 'http://localhost:3000/login/'

};

//로그아웃 핸들러
const logoutHandler = () => {
  userDetails.logout();
  localStorage.clear();
  location.reload();

}

// 사이드바 상태
const isSidebarOpen = ref(false);

// 사이드바 열기/닫기 토글 함수
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 사이드바 닫기 함수
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// 검색어 삭제 함수
const clearSearch = (event) => {
  const input = event.currentTarget.parentNode.querySelector('input');
  input.value = ""; // 검색어 삭제
};

const router = useRouter()

router.afterEach(() => {
  isSidebarOpen.value = false;
})


// 사이드바 외부 영역 드롭다운 처리
const closeSidebarOnNav = () => {
  isSidebarOpen.value = false;
};

</script>

<template>
  <div class="header-box">
    <header>
      <div class="top-bar">
        <div class="top-bar__column">
          <span>EXPAND YOUR LEISURE LIFE WITH EPIK.</span>
        </div>
        <div class="top-bar__column">
          <div v-if="userDetails.isAnonymous()">
            <a href="/signup">회원가입</a>
            <a @click="goToLoginPageHandler">로그인</a>
          </div>
          <div v-else="!userDetails.isAnonymous()">
            <a href="/mypage">마이페이지</a>
            <a @click="logoutHandler" href="#">로그아웃</a>
          </div>
        </div>
      </div>
      <div class="main-header">
        <div class="main-header__title">
          <h1><RouterLink to="/">EPIK</RouterLink></h1>
        </div>
        <div class="main-header__icon" @click="toggleSidebar">
          <i class='bx bx-menu'></i>
        </div>

        <div class="dropdown-menu" :class="{ 'move-sidebar': isSidebarOpen }">
          <div class="dropdown-menu__inner">

            <div class="dropdown-menu__header">
              <div class="dropdown-menu__title">
                <h1><RouterLink to="/">EPIK</RouterLink></h1>
              </div>
              <div class="dropdown-menu__cancle" @click="closeSidebar">
                <i class='bx bx-x'></i>
              </div>
            </div>

            <div class="search-bar">
              <form>
                <button type="submit" class="search-bar__submintbutton">
                  <i class='bx bx-search'></i>
                </button>
                <div class="search-bar__input-wrap">
                  <input type="text" placeholder="검색어를 입력해주세요.">
                  <button type="reset" class="search-bar__clear" @click="clearSearch">
                    <i class='bx bx-x search-bar-remove-icon'></i>
                  </button>
                </div>
              </form>
            </div>

            <nav>
              <ul>
                <li class="dropdown-menu__link">
                  <NuxtLink to="/popup/region">Pop-Up</NuxtLink>
                  <ul>
                    <li><NuxtLink to="/popup/region" @click="closeSidebarOnNav">지역별</NuxtLink></li>
                    <li><NuxtLink to="/popup/category">카테고리별</NuxtLink></li>
                    <li><NuxtLink to="/popup/soon">오픈예정</NuxtLink></li>
                    <li><NuxtLink to="/popup/location">위치기반 팝업 추천지도</NuxtLink></li>
                  </ul>
                </li>
                <li class="dropdown-menu__link">
                  <NuxtLink to="/musical">Musical</NuxtLink>
                </li>
                <li class="dropdown-menu__link">
                  <NuxtLink to="/concert">Concert</NuxtLink>
                </li>
                <li class="dropdown-menu__link">
                  <NuxtLink to="/exhibition">Exhibition</NuxtLink>
                </li>
                <li class="dropdown-menu__link">
                  <NuxtLink to="/feed">Feed</NuxtLink>
                  <span>당신의 시간을 공유해주세요!</span>
                </li>
                <!-- <li class="dropdown-menu__link">
                  <NuxtLink to="chat">Chat</NuxtLink>
                  <span>다른 유저들과 이야기를 나눠보세요!</span>
                </li> -->
              </ul>
            </nav>

            <div class="dropdown-menu__auth">
              <NuxtLink to="/signup"><span>회원가입</span></NuxtLink>
              <NuxtLink to="/login"><span>로그인</span></NuxtLink>
            </div>

          </div> <!-- sidebar-inner -->
        </div> <!-- sidebar -->
      </div> <!-- main-header -->
    </header>
  </div>
</template>


<style lang="css" scoped>
/* @import '@/assets/header.css'; */
/* @import '/public/css/reset.css';
@import '/public/css/fonts.css'; */
/* @import '/public/css/header.css'; */
@import url('/public/css/fonts.css');
@import url('/public/css/header.css');
</style>
