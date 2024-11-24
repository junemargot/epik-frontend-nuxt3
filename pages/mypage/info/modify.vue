<template>
  <main class="mypage-wrap">
    <section class="memberInfoUpdate__wrap small-wrap">
      <div class="memberInfoUpdate__intro">
        <h1 class="memberInfoUpdate__title intro-title">
          회원정보수정
        </h1>
      </div>

      <div class="memberInfoUpdate__img-wrap">
        <div class="memberInfoUpdate__img">
          <div class="memberInfoUpdate__img-my-box">
            <img class="memberInfoUpdate__img-my" src="/public/images/mypage/profile-baek.png" alt="profile pic">
          </div>
          <div class="memberInfoUpdate__edit">
            <div class="memberInfoUpdate__edit-icon-box">
              <label for="inputFile">
                <input id="inputFile" style="display:none" type="file">
                <i class='bx bx-pencil'></i>
              </label>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="memberInfoUpdate__form gap-mt_2">
        <fieldset class="memberInfoUpdate__idUpdate gap-mb_6 small_text">
          <label>
            <div class="star_top">아이디</div>
            <div class="gap-mt_1">
              <input disabled class="form non_change" type="text" :placeholder="storedUserInfo">
            </div>
          </label>
        </fieldset>

        <fieldset class="sign-in__nickname gap-mb_6 small_text">
          <label>
            <div>닉네임</div>
            <div class="gap-mt_1">
              <input class="nickname form short_form" v-model="nicknameModel" id="nickname" type="text"
                placeholder="20자리 이하를 입력해주세요">
              <button class="btn" type="button" @click="nicknameHandler">확인</button>
            </div>
          </label>
          <div class="message-container">
            <div class="small_text_green" v-if="nicknameCheck">사용 가능한 닉네임입니다.</div>
            <div class="small_text_red" v-if="nicknameCheck===false">사용 불가능한 닉네임입니다.</div>
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
          </label>

          <label>
            <div class="gap-mt_1">
              <input class="email_check form short_form" v-model="emailCodeModel" type="text" placeholder="인증번호 6자리 입력">
              <button class="btn" type="button" @click="emailCodeHandler">확인</button>
            </div>
          </label>

          <div v-if="emailCodeCheck===true" class="small_text_green">인증번호가 일치합니다.</div>
          <div v-if="emailCodeCheck===false" class="small_text_red">인증번호를 다시 확인해주세요.</div>
        </fieldset>

        <div class="gap-bmt_1">
        <button class="long_btn" type="submit">
          확인
        </button>
      </div>

      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';

const userDetails = useUserDetails();

//-----------------------------

//usrname 띄우기
const storedUserInfo = ref('');
onMounted(()=>{
  storedUserInfo.value = localStorage.getItem("username");
})

//닉네임 조건
const nicknameModel = ref('');
const nicknameCheck = ref('');

const nicknameHandler = async () => {
  console.log("입력한 닉네임-"+nicknameModel.value);
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
  console.log("디비에 있는 닉네임-"+result.nickname);

  if(nicknameModel.value===result.nickname){
  console.log("사용불가")
    nicknameCheck.value=false;}
  else{
    nicknameCheck.value=true;
    console.log("사용가능")
  }
};


// //이메일 인증 요청
const emailModel = ref('');
const emailCodeModel = ref('');
const emailCodeCheck = ref('');
const serverVerificationCode = ref('');


const emailHandler = async () => {
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
  } else if (result.message==="error") {
    console.log("중복 이메일");
  }

};

//인증 코드 확인
const emailCodeHandler=async () => {
  if (emailCodeModel.value===serverVerificationCode.value) {
    emailCodeCheck.value=true;
    console.log("2-"+ emailCodeModel.value);
  } else {
    emailCodeCheck.value=false;
    console.log("3-"+ emailCodeModel.value);
  }
}


//수정 확인 폼 제출
const usernameFix = ref('');

const submitForm = async () => {

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


const idtest = userInfo.id;

    console.log(userInfo)
    console.log("토큰에서 정보 가져오기")


  const InfoRequestDto={
    id: idtest,
    nickname: nicknameModel.value,
    email: emailModel.value
  };

  console.log(InfoRequestDto);

  // 백엔드 API로 추가된 정보 전달
  const response = await fetch('http://localhost:8081/api/v1/mypage/info', 
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(InfoRequestDto),
    credentials: 'include'
  }
  );


  const data = await response.json();
   console.log(data);

    console.log("리스판스 콘솔 확인-" + data.token)
    localStorage.clear;
    localStorage.setItem("access_token", data.token)
    getMemberInfo()
    
}


const getMemberInfo = () => {
  console.log("토큰 분해 중 ")
  try{
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
    location.href="http://localhost:3000/mypage"; 

  }
    catch{
      console.log("토큰분해 오류")
    }
}



</script>

<style>
@import url('/public/css/mypage/memberInfoUpdate.css');

fieldset{
  border: none
}

.btn:hover 
{
  background-color: var(--accent-1); 
  color: white;  
}

.long_btn:hover
{
  background-color: var(--accent-1); 
  color: white;  
}
</style>