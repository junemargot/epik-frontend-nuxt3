<template>
  <main class="mypage-wrap">
    <section class="passwordUpdate__wrap small-wrap">
      <div class="passwordUpdate__intro">
        <h1 class="passwordUpdate__title intro-title">
          비밀번호 변경
        </h1>
      </div>

      <form>
        <fieldset class="gap-mb_6 gap-mt_3 small_text">
          <label>
            <div class="star_top">새로운 비밀번호</div>
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
            <div class="star_top">새로운 비밀번호 확인</div>
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

onMounted(()=>{
  if (!token) 
    // 토큰이 없으면 메인 페이지로 리디렉션
    location.href=('http://localhost:3000'); 
})


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

const passwordUpHandler = async()=>{

    //로컬호스트 유지
    let token = localStorage.getItem("access_token"); 
const userInfo = jwtDecode(token);

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

   console.log("입력한 새로운 비밀번호" + pwReCheck.value)
  const passwordCheckDto = {
    id: idtest,
    password: pwReModel.value,
  };
  const response = await fetch('http://localhost:8081/api/v1/mypage/updatepassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordCheckDto),
  });

  const data = await response.json();
   console.log(data);

    console.log("리스판스 콘솔 확인-" + data.token)
    localStorage.clear() // 기존 토큰 삭제
    localStorage.setItem("access_token", data.token);  // 새로운 토큰 저장
    getMemberInfo()

    // 비밀번호 변경 후 새로운 토큰을 사용하여 서버에 비밀번호 확인 요청을 보내는 fetch 코드
    const newToken = data.token;  // 새로 발급된 토큰

// 비밀번호 확인 요청 (새로운 토큰을 Authorization 헤더에 포함하여 보냄)
const passwordCheckResponse = await fetch('http://localhost:8081/api/v1/mypage/passwordCheck', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${newToken}`,  // 새로운 토큰을 Authorization 헤더에 포함
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(passwordCheckDto),
});

const passwordCheckData = await passwordCheckResponse.json();
console.log("비밀번호 확인 결과:", passwordCheckData);


    
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
    localStorage.removeItem("access_token");
    alert('비밀번호 변경이 완료되었습니다!');
    location.href="http://localhost:3000/login"; 
  }
    catch{
      console.log("옲ㅍ")
    }
}


</script>

<style>
@import url(/public/css/mypage/passwordUpdate.css);

.long_btn:hover{
  background-color: var(--accent-1); 
  color: white;  
  cursor: pointer;
}
</style>