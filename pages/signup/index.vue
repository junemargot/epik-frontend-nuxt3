<template>
  <main class="signin-wrap">
    <section class="sign-in__wrap small-wrap">

      <div class="sign-in__intro">
        <h1 class="sign-in__title intro-title">
          회원가입
        </h1>
      </div>

      <form @submit.prevent="submitForm" class="sign-in__form">
        <h2 hidden>회원가입폼</h2>

        <fieldset class="sign-in__id gap-mb_6 gap-mt_4 small_text">
          <label>
            <div class="star_top">아이디</div>
            <div class="gap-mt_1">
              <input class="form short_form" v-model="usernameModel" id="username" type="text"
                placeholder="6자리에서 15자리를 입력해주세요">
              <button class="btn" type="button" @click="usernameHandler">
              확인</button>
            </div>
          </label>
          <div class="message-container">
            <div v-if="usernameCheck===true" class="small_text_green">사용 가능한 아이디입니다.</div>
            <div v-if="usernameCheck===false" class="small_text_red">아이디는 6자리에서 15자리
              사이여야 합니다.</div>
          </div>
        </fieldset>


        <fieldset class="sign-in__nickname gap-mb_6 small_text">
          <label>
            <div class="star_top">닉네임</div>
            <div class="gap-mt_1">
              <input class="nickname form short_form" v-model="nicknameModel" id="nickname" type="text"
                placeholder="20자리 이하를 입력해주세요">
              <button class="btn" type="button" @click="nicknameHandler">확인</button>
            </div>
          </label>
          <div class="message-container">
            <div class="small_text_green" v-if="nicknameCheck===true" >사용 가능한 닉네임입니다.</div>
            <div class="small_text_red"  v-if="nicknameCheck===false" >사용 불가능한 닉네임입니다.</div>
          </div>
        </fieldset>


        <fieldset class="sign-in__password gap-mb_6 small_text">
          <div class="gap-mb_6">
            <label>
              <div class="star_top">비밀번호</div>
              <input class="password form long_form gap-mt_1" v-model="pwModel" id="password" type="text"
                placeholder="영어+숫자, 대/소문자 구분 없이 6자리 이상을 입력해주세요">
            </label>
            <div class="message-container">
              <div class="small_text_green" v-if="pwCheck===true">사용 가능한 비밀번호입니다.</div>
              <div class=" small_text_red" v-if="pwCheck===false">비밀번호는 대/소문자 구분 없이 6글자
                이상 입력해주세요.</div>
            </div>
          </div>

          <div>
            <label>
              <div class="star_top">비밀번호 확인</div>
              <input class="password-retype form long_form gap-mt_1" v-model="pwReModel" id="password-retype"
                type="text" placeholder="비밀번호를 한번 더 입력해주세요">
            </label>
            <div class="message-container">
              <div class="hide small_text_green" v-if="pwReCheck===true">비밀번호가 일치합니다.</div>
              <div class="hide small_text_red" v-if="pwReCheck===false">비밀번호가 불일치합니다.</div>
            </div>
          </div>
        </fieldset>


        <fieldset class="sign-in__email gap-mb_6 small_text">
          <label>
            <div class="star_top">이메일</div>
            <div class="gap-mt_1">
              <input class="email form short_form" v-model="emailModel" id="email" type="text"
                placeholder="예) epik@epik.com">
              <button class="btn" type="button" @click="emailHandler">인증</button>
            </div>
            <div class="message-container">
              <div v-if="emailValid" class="small_text_green">인증번호가 발송되었습니다.</div>
              <div v-if="emailValid===false" class="small_text_red">이메일을 다시 확인해주세요.</div>
        </div>
          </label>

          <label>
            <div class="gap-mt_1">
              <input class="email_check form short_form" v-model="emailCodeModel" type="text" placeholder="인증번호 6자리 입력">
              <button class="btn" type="button" @click="emailCodeHandler">확인</button>
            </div>
          </label>
          <div class="message-container">
          <div v-if="emailCodeCheck===true" class="small_text_green">인증번호가 일치합니다.</div>
          <div v-if="emailCodeCheck===false" class="small_text_red">인증번호를 다시 확인해주세요.</div>
        </div>
        </fieldset>

        <fieldset class="sign-in__introduce gap-mb_6 small_text">
          소개글
          <input class="introduce form middle_form gap-mt_1" type="text" placeholder="소개글을 입력해주세요." style="padding-top: 2px; padding-bottom: 2px;" >
        </fieldset>



        <!-- <div class="sign-in__terms">
          <div>
            <h2 class="small_text star_top gap-mt_2">이용약관동의</h2>
            <ul class="gap-mt_2">
              <li class="agree_text_bold"><input type="checkbox">전체동의합니다.
                <span class="small_text">
                  <br>선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</span>
              </li>
              <li class="agree_text gap-mt_1"><input type="checkbox">이용약관 동의<spna class="small_text">(필수)</spna>
              </li>
              <li class="agree_text gap-mt_1"><input type="checkbox">개인정보 수집 및 이용동의<spna class="small_text">(필수)
                </spna>
              </li>
            </ul>
          </div> -->


          <div class="sign-in__terms">
          <div>
            <h2 class="small_text star_top gap-mt_2">이용약관동의</h2>
            <ul class="gap-mt_2">
              <!-- 전체 동의 체크박스 -->
              <li class="agree_text_bold">
                <input type="checkbox" v-model="agreeAll" @change="toggleAgreeAll" />
                전체동의합니다.
                <span class="small_text">
                  <br />선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.
                </span>
              </li>
              <!-- 개별 동의 항목들 -->
              <li class="agree_text gap-mt_1">
                <input type="checkbox" v-model="agreeTerms" /> 이용약관 동의
                <span class="small_text">(필수)</span>
              </li>
              <li class="agree_text gap-mt_1">
                <input type="checkbox" v-model="agreePrivacy" /> 개인정보 수집 및 이용동의
                <span class="small_text">(필수)</span>
              </li>
            </ul>
          </div>


          <div>
            <button class="long_btn gap-mt_3" type="submit">가입하기</button>
          </div>

        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue';
const inputFocused = ref(false);

//버튼 클릭 수 색 변경
const usernameButtonClicked = ref(false);
const nicknameButtonClicked = ref(false);
const emailButtonClicked = ref(false);



//아이디 유효성 검사
const usernameModel = ref('');
const usernameCheck = ref('');

const usernameHandler = async () => {
  console.log(usernameModel.value)
  const usernameCheckDto = {
    username: usernameModel.value,
  };

  const response = await fetch('http://localhost:8081/api/v1/signup/checkUsername', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usernameCheckDto),
  });

  const result = await response.json();
  console.log(result);

  if (usernameModel.value === result.username) {
    usernameCheck.value = false;
    console.log("f")
  } else {
    usernameCheck.value = true;
    console.log("t")
  }
};

//닉네임 조건
const nicknameModel = ref('');
const nicknameCheck = ref('');

const nicknameHandler = async () => {
  console.log(nicknameModel.value);
  const nicknameCheckDto = {
    nickname: nicknameModel.value
  };

  const response = await fetch('http://localhost:8081/api/v1/signup/checkNickname', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nicknameCheckDto),
  });

  const result = await response.json();
  console.log(result);
  console.log(result.nickname);

  if(nicknameModel.value===result.nickname){
    nicknameCheck.value=false;
    console.log("f")}
  else{
    nicknameCheck.value=true;
    console.log("t")
  }
};



//비밀번호 조건
const pwModel = ref('');
const pwReModel = ref('');
const pwCheck = ref('');
const pwReCheck = ref('');
const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

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
  console.log(emailCheckDto);

  const response = await fetch('http://localhost:8081/api/v1/signup/checkEmail', {
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
}else {
    emailValid = false;
    console.log("이메일 형식 이상")
  }

};

//인증 코드 확인
const emailCodeHandler = async () => {
  if (emailCodeModel.value===serverVerificationCode.value) {
    emailCodeCheck.value=true;
    console.log("2-" + emailCodeModel.value);
  } else {
    emailCodeCheck.value=false;
    console.log("3-" + emailCodeModel.value);
  }
}


// 체크박스 상태들
const agreeAll = ref(false); // 전체 동의 체크 상태
const agreeTerms = ref(false); // 이용약관 동의 체크 상태
const agreePrivacy = ref(false); // 개인정보 동의 체크 상태

// 전체 동의 시, 나머지 체크박스들을 자동으로 동기화
const toggleAgreeAll = () => {
  agreeTerms.value = agreeAll.value;
  agreePrivacy.value = agreeAll.value;
};


//회원가입 폼 제출 
const submitForm = async () => {
  const signupRequestDto = {
    username: usernameModel.value,
    nickname: nicknameModel.value,
    password: pwReModel.value,
    email: emailModel.value,
    // profileImg: memberProfileImg.value,
    // profileText: memberProfileText.value,
  };

    if(usernameCheck.value&&nicknameModel.value&&pwReModel.value&&emailModel.value&&emailCodeCheck.value&&agreeAll.value){

        // 백엔드 API로 회원가입 정보 전송
        const response = await fetch('http://localhost:8081/api/v1/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupRequestDto),
        });

        // 응답 처리
        if (response.status === 200) {
          console.log('회원가입 성공', response.data);
          alert('회원가입이 완료되었습니다!');

          location.href="http://localhost:3001/login"; 
        } 
      } else {
        alert('모든 항목을 입력해주세요');
      }
};


</script>

<style scoped>
.message-container {
  min-height: 13px;
  /* 메시지 공간의 최소 높이를 설정 */
  transition: height 0.2s ease;
  /* 부드러운 전환 효과 */
}

.signin-wrap {
  margin: auto;
  width: 960px;
  height: auto;
  min-height: 100%;
  background-color: #F2F2F2;
}

.small-wrap {
  width: 353px;
  height: auto;

  margin-left: 270px;
  margin-right: 314px;
  margin-top: 96px;
  margin-bottom: 110px;
}

fieldset{
  border: none
}

.long_btn:hover
{
  background-color: var(--accent-1); /* 버튼 색상 회색으로 변경 */
  color: white;  /* 텍스트 색상 흰색으로 변경 */
  cursor: pointer;
}

.btn:hover 
{
  background-color: var(--accent-1); /* 버튼 색상 회색으로 변경 */
  color: white;  /* 텍스트 색상 흰색으로 변경 */
  cursor: pointer;
}


</style>