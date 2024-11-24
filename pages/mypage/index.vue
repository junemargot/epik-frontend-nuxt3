<template>
  <main class="mypage-wrap">
    <section class="mypage__wrap small-wrap">
      <div class="mypage__intro">
        <h1 class="mypage__title intro-title">
          마이페이지
        </h1>
      </div>

      <div class="mypage__wrap-profile gap-mt_3">

        <div class="mypage__profile">
          <div>
            <h2 hidden>내 프로필</h2>
          </div>

          <div class="mypage__img">
            <div class="mypage__img-my-box">
              <img class="mypage__img-my" src="/public/images/mypage/profile-baek.png" alt="profile pic">
            </div>
            <div class="mypage__edit">
              <div class="mypage__edit-icon-box">
                <label for="inputFile">
                  <input id="inputFile" style="display:none" type="file">
                  <i class='bx bx-pencil'></i>
                </label>
              </div>
            </div>
          </div>

          <div class="mypage__name gap-mt_2">
            <div class="mypage__nickname ">
              {{ userDetails.nickname }}
            </div>

            <div class="mypage__username">
              <!-- <img class="mypage__username-img" src="/public/images/mypage/member.png"> -->
               {{ userDetails.email }} 
            </div>
          </div>

        </div>

        <hr class="hr_1">

        <div class="mypage__wrap-fuction">
          <div>
            <h2 hidden>프로필 메뉴</h2>
          </div>
          <nav>
            <ul class="mypage__fuction-icons">
              <li class="bell">
                <a href="./notification.vue"><i class='mypage__bell-icon bx bx-bell'></i>알림</a>
              </li>
              <li class="bookmark">
                <a href="../mypage/bookmark"> <i class='mypage__bookmark-icon bx bx-bookmark'></i>북마크</a>
              </li>
              <li class="myfeed">
                <a href="#"> <i class='mypage__myfeed-icon bx bx-message-alt-minus'></i>마이피드</a>
              </li>
            </ul>
          </nav>
        </div>

      </div>

      <div class="mypage__wrap-menulist">
        <div>
          <h2 hidden>마이 페이지 메뉴</h2>
        </div>
        <nav>
          <ul class="mypage__menulist">
            <li>
              <a href="../mypage/info/modify" class="mypage__memberInfoUpdate">
                <div class="mypage__icon-wrap"><i class='mypage__user-icon bx bx-user-circle'></i>회원정보수정</div>
                <div><i class='mypage__angleright-icon bx bx-chevron-right'></i></div>
              </a>
            </li>

            <li>
              <a href="../mypage/password/check" class="mypage__passwordChange">
                <div class="mypage__icon-wrap"><i class='mypage__lock-icon bx bx-lock-alt'></i>비밀번호 변경</div>
                <div><i class='mypage__angleright-icon bx bx-chevron-right'></i></div>
              </a>
            </li>
            <li>
              <a href="#" class="mypage__inquiry">
                <div class="mypage__icon-wrap"><i class='mypage__headset-icon bx bx-support'></i>문의내역
                </div>
                <div><i class='mypage__angleright-icon bx bx-chevron-right'></i></div>
              </a>
            </li>
            <li>
              <a href="#" class="mypage__blockMember">
                <div class="mypage__icon-wrap"><i class='mypage__userlock-icon bx bxs-user-x'></i>차단 계정 관리</div>
                <div><i class='mypage__angleright-icon bx bx-chevron-right'></i></div>
              </a>
            </li>
          </ul>
        </nav>
      </div>

    </section>
  </main>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';

const userDetails = useUserDetails();
//-----------------------------

//로컬호스트 유지
onMounted(() => {
  let token = localStorage.getItem("access_token");  // 로컬스토리지에서 토큰 가져오기

  if (token) {
    // 토큰이 있으면, 토큰을 디코딩하여 사용자 정보 추출
    const userInfo = jwtDecode(token);  // JWT 토큰 디코딩
    userDetails.setAuthentication({
      id: userInfo.id,
      nickname: userInfo.nickname,
      username: userInfo.username,
      email: userInfo.email,
      role: userInfo.role.map(role => role.authority),
      token: token
    });
    console.log(userInfo)
    console.log("토큰에서 정보 가져오기")
  }
})







</script>

<style scoped>
@import url('/public/css/mypage/mypageMain.css');
</style>