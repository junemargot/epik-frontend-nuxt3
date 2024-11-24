<template>
  <main class="login-in-wrap">
    <section class="search-id__wrap small-wrap">
      <div class="search-id__intro">
        <h1 class="search-id__title intro-title">
          아이디 찾기
        </h1>
      </div>

      <form class="search-id__form">
        <h2 hidden>아이디 찾기 폼</h2>

        <fieldset class="search-id__email gap-mb_6 gap-mt_5 small_text">
          <label>
            <div class="star_top">이메일주소</div>
            <div class="gap-mt_1">
              <input class="short_form" v-model="emailModel" type="text" placeholder="가입 시 등록한 이메일을 입력해주세요">
              <button class="btn" type="button" @click="emailHandler">발송</button>
            </div>
          </label>
          <div class="message-container">
            <div v-if="emailValid" class="small_text_green">인증번호가 발송되었습니다.</div>
            <div v-if="emailValid===false" class="small_text_red">이메일을 다시 확인해주세요.</div>
          </div>
        </fieldset>


        <fieldset class="search-id__vcode small_text">
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
        <button class="long_btn" @click="idFindResultHandler">확인
        </button>
      </div>

    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

//이메일 인증 요청

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

//이메일을 찾아서 결과에 따라서 연결하는 핸들러
const idFindResultHandler = async() => {
  const emailCheckDto = {
      email: emailModel.value
    };

    const response = await fetch('http://localhost:8081/api/v1/find/id', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailCheckDto)
    });

    const idFindResult = await response.text();

    if(idFindResult === "failed"){
    location.href='http://localhost:3000/find/id/notfound' 
    }
    else{
    console.log("찾았다")
    console.log("찾은 아이디 값--"+idFindResult);
    // location.href='http://localhost:3000/find/id/found' 

      // Vue Router를 통해 쿼리 파라미터로 아이디 전달
      router.push({ path: '/find/id/found', query: { id: idFindResult } });
    }
    
}


</script>

<style scoped>
@import url('/public/css/login/login.css');
</style>