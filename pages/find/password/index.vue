<template>
  <main class="login-in-wrap">
    <section class="search-pw__wrap small-wrap">
      <div class="search-pw__intro">
        <h1 class="search-pw__title intro-title">
          비밀번호 찾기
        </h1>
      </div>

      <form class="search-pw__form">

        <h2 hidden>비밀번호 찾기 폼</h2>

        <fieldset class="gap-mb_6 gap-mt_5 small_text">
          <label>
            <div class="star_top">아이디</div>
            <div class="gap-mt_1">
              <input class="short_form" type="text" v-model="usernameCheckModel" placeholder="아이디를 입력해주세요">
              <button class="btn" type="button" @click="checkUsernameHandler">확인</button>
            </div>
          </label>
          <div class="small_text_red" v-if="usernameCheck===false">등록된 아이디가 아닙니다.</div>
          <div class="small_text_green" v-if="usernameCheck===true">등록된 아이디입니다.</div>
        </fieldset>

        <fieldset class="gap-mb_6 small_text">
          <label>
            <div class="star_top">이메일</div>
            <div class="gap-mt_1">
              <input class="short_form" v-model="emailModel"type="text" placeholder="등록된 이메일을 입력해주세요">
              <button class="btn" type="button" @click="emailHandler">발송</button>
            </div>
          </label>
          <div class="message-container">
            <div v-if="emailValid" class="small_text_green">인증번호가 발송되었습니다.</div>
            <div v-if="emailValid===false" class="small_text_red">이메일을 다시 확인해주세요.</div>
          </div>
        </fieldset>

        <fieldset class="6gap-mb_ small_text">
          <label>
            <div class="star_top">인증번호</div>
            <div class="gap-mt_1">
              <input class="short_form" v-model="emailCodeModel" type="text" placeholder="인증번호 6자리 숫자입력">
              <button class="btn" type="button" @click="emailCodeHandler">확인</button>
            </div>
          </label>
          <div class="message-container">
            <div v-if="emailCodeCheck === true" class="small_text_green">인증번호가 일치합니다.</div>
            <div v-if="emailCodeCheck === false" class="small_text_red">인증번호를 다시 확인해주세요.</div>
          </div>
        </fieldset>
      </form>

      <div class="gap-bmt_1">
        <button class="long_btn" @click="FindResultHandler">확인</button>
      </div>

    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

//username 확인
const usernameCheckModel = ref('');
const usernameCheck = ref('');

const checkUsernameHandler = async () => {
  const usernameCheckDto = {
    username: usernameCheckModel.value,
  };
  console.log(usernameCheckModel.value);

  const response = await fetch('http://localhost:8081/api/v1/find/password/checkUsername', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usernameCheckDto)
  });

  const usernameCheckresult = await response.text();

  if(usernameCheckresult=== "notfound")
  {console.log("notfound")
  usernameCheck.value=false;
  }
  else{console.log("찾았다")
  usernameCheck.value=true;
  console.log("찾은 아이디 값--"+usernameCheckresult);}
}

//이메일 확인 및 인증 번호 전송 
const emailModel = ref('');
const emailCodeModel = ref('');
const emailCodeCheck = ref('');
const serverVerificationCode = ref('');
const emailValid = ref(''); // 이메일 형식 유효성 확인 변수
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


const emailHandler = async () => {
  // 이메일 형식이 유효한지 확인
  emailValid.value = emailRegex.test(emailModel.value);

  if (emailValid.value) {
    const emailCheckDto = {
      email: emailModel.value
    };

    const response = await fetch('http://localhost:8081/api/v1/find/checkEmail', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailCheckDto)
    });

    const result = await response.json();
    console.log(result);

    if (result.message === "ok") {
      serverVerificationCode.value = result.verificationCode;
      console.log("이메일 전송");
      console.log("1-" + result.verificationCode);
      console.log("4-" + serverVerificationCode.value);
    } else if (result.message === "error") {
      console.log("중복 이메일");
    }

  } else {
    emailValid = false;
    console.log("이메일 형식 이상")
  }
  ;
}

//인증 코드 확인
const emailCodeHandler = async () => {
  if (emailCodeModel.value === serverVerificationCode.value) {
    emailCodeCheck.value = true;
    console.log("2-" + emailCodeModel.value);
  } else {
    emailCodeCheck.value = false;
    console.log("3-" + emailCodeModel.value);
  };
}

//결과에 따라서 연결하는 핸들러
const FindResultHandler = async() => {

    if(usernameCheck&&emailCodeCheck){
    location.href='http://localhost:3000/find/password/change' 
    router.push({ path: '/find/password/change', query: { username: usernameCheckModel.value } });
    }

    }
</script>

<style>
@import url('/public/css/login/login.css');
</style>