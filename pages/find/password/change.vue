<template>
  <main class="login-in-wrap">
    <section class="search-pw__wrap small-wrap">
      <div class="search-pw__intro">
        <h1 class="search-pw__title intro-title">
          비밀번호 재설정
        </h1>
      </div>

      <form class="search-pw__form">
        <h2 hidden>비밀번호 재설정 폼</h2>

        <fieldset class="gap-mb_6 gap-mt_5 small_text">
          <label>
            <div class="star_top">비밀번호 재설정</div>
            <div class="gap-mt_1">
              <input class="password form long_form gap-mt_1" v-model="pwModel" id="password" type="text"
                placeholder="영어+숫자, 대/소문자 구분 없이 6자리 이상을 입력해주세요">
            </div>
          </label>
          <div class="message-container">
              <div class="small_text_green" v-if="pwCheck===true">사용 가능한 비밀번호입니다.</div>
              <div class=" small_text_red" v-if="pwCheck===false">비밀번호는 대/소문자 구분 없이 6글자
                이상 입력해주세요.</div>
            </div>
        </fieldset>

        <fieldset class="gap-mb_6 small_text">
          <label>
            <div class="star_top">비밀번호 확인</div>
            <div class="gap-mt_1">
              <input class="password-retype form long_form gap-mt_1" v-model="pwReModel" id="password-retype"
              type="text" placeholder="비밀번호를 한번 더 입력해주세요">
            </div>
          </label>
          <div class="message-container">
              <div class="hide small_text_green" v-if="pwReCheck===true">비밀번호가 일치합니다.</div>
              <div class="hide small_text_red" v-if="pwReCheck===false">비밀번호가 불일치합니다.</div>
            </div>
        </fieldset>
      </form>

      <div class="gap-bmt_1">
        <button class="long_btn" @click="passwordUpHandler" type="button">
          확인
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>

//비밀번호 조건
const pwModel = ref('');
const pwReModel = ref('');
const pwCheck = ref('');
const pwReCheck = ref('');
const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
import { jwtDecode } from 'jwt-decode';

const userDetails = useUserDetails();

watch([pwModel], () => {
  if (regex.test(pwModel.value))
    pwCheck.value = true
  else
    pwCheck.value = false
})

watch([pwModel, pwReModel], () => {
  if ((pwModel.value === pwReModel.value) && pwCheck.value === true) {
    pwReCheck.value = true
  } else if ((!(pwModel.value === pwReModel.value)) && pwCheck.value === true) {
    pwReCheck.value = false
  }
  else {
    pwReCheck.value = ''; // 초기 상태일 때는 메시지 안 보이도록 설정
  }
});

//전달받은 username으로 백단 넘겨서 정보 업데이트하기
import { useRoute } from 'vue-router';
const route = useRoute();

const passwordUpHandler = async()=>{

   //id값만 담기
   const usernameValue = route.query.username;
   console.log("전달받은 username-"+ route.query.username)

  const usernameCheckDto = {
    username: usernameValue,
    password: pwReModel.value,
  };

  const response = await fetch('http://localhost:8081/api/v1/find/password/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usernameCheckDto),
  });

  const data = await response.json();
   console.log(data);

}
</script>

<style>
@import url('/public/css/login/login.css');
</style>