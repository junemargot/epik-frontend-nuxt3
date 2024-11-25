<template>
  <main class="mypage-wrap">
    <section class="passwordCheck__wrap small-wrap">
      <div class="passwordCheck__intro">
        <h1 class="passwordCheck__title intro-title">
          비밀번호 확인
        </h1>
      </div>

      <form>
        <fieldset class="passwordCheck__inUpdate gap-mb_6 gap-mt_3 small_text">
          <label>
            <div class="star_top">아이디</div>
            <div class="gap-mt_1">
              <input disabled class="form non_change" type="text" :placeholder="storedUserInfo">
            </div>
          </label>
        </fieldset>


        <fieldset class="passwordUpdate gap-mb_6 small_text">
          <label>
            <div class="star_top">현재 비밀번호</div>
            <div class="gap-mt_1">
              <input class="form" type="text" v-model="passwordModel" placeholder="현재 비밀번호를 입력해주세요">
            </div>
          </label>
          <div class="message-container">
            <div class="small_text_red"  v-if="passwordCheck===false">비밀번호를 확인해주세요.</div>
            <div class="small_text_green" v-if="passwordCheck===true">비밀번호가 일치합니다.</div>
          </div>
        </fieldset>
      </form>

      <div class="gap-bmt_1">
        <button class="long_btn" type="button" @click="passwotdCheckHandler">
          확인
        </button>
      </div>

    </section>
  </main>
</template>

<script setup>
const passwordModel = ref('');
const userDetails = useUserDetails();
const passwordCheck = ref(null);
import { jwtDecode } from 'jwt-decode';

//usrname 띄우기
const storedUserInfo = ref('');

onMounted(()=>{
  storedUserInfo.value = localStorage.getItem("username");
  console.log(storedUserInfo)
  let token = localStorage.getItem("access_token");
  
  if (!token) 
    // 토큰이 없으면 메인 페이지로 리디렉션
    location.href=('http://localhost:3001'); 
})


const passwotdCheckHandler = async () => {

  //로컬호스트 유지
  let token = localStorage.getItem("access_token");  // 로컬스토리지에서 토큰 가져오기


  // 토큰이 있으면, 토큰을 디코딩하여 사용자 정보 추출
  const userInfo = jwtDecode(token); // JWT 토큰 디코딩
  userDetails.setAuthentication({
    id: userInfo.id,
    nickname: userInfo.nickname,
    username: userInfo.username,
    email: userInfo.email,
    role: userInfo.role.map(role => role.authority),
    token: token
  });

  //id값만 담기
  const idtest = userInfo.id;

  console.log("입력한 현재 비밀번호" + passwordModel.value)
  const passwordCheckDto = {
    id: idtest,
    password: passwordModel.value,
  };

  const response = await fetch('http://localhost:8081/api/v1/mypage/passwordCheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordCheckDto),
  });

  const result = await response.json();
  console.log(result);

  if (result === true) {
    passwordCheck.value = true;
    location.href='http://localhost:3001/mypage/password/update' // 비밀번호 일치
  } else {
    passwordCheck.value = false;  // 비밀번호 불일치
  }
};


</script>

<style>
@import url('/public/css/mypage/passwordUpdate.css');

.long_btn:hover{
  background-color: var(--accent-1); 
  color: white;  
  cursor: pointer;
}
</style>