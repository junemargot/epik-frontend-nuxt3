<template>
<div class="wrap">
    <!-- HEADER -->
    <header>
      <h2 class="header__logo">EPIK</h2>
      <nav class="header__navigation">
        <button class="mainBtn">EPIK SERVICE</button>
      </nav>
    </header>
    <section class="signin">
      <!-- <h1>Sign In</h1> -->
      <div class="signin__card">
        <h2>관리자 로그인</h2>
        <form id="signin__form" action="" method="post">
          <div class="signin__input">
            <span class="signin__icon">
              <i class='bx bxs-user'></i>
            </span>
            <input type="text" name="login_id" required />
            <label>ID</label>
          </div>
          <div class="signin__input">
            <span class="signin__icon">
              <i class='bx bxs-lock-alt'></i>
            </span>
            <input type="password" name="password" required />
            <label>Password</label>
          </div>
          <div class="signin__remember">
            <label>
              <input type="checkbox" id="checkbox" name="rememberId">아이디 저장
            </label>
          </div>
          <div id="signin__msg">
            <!-- <i id="msg_alert">ID 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.</i> -->
          </div>
          <input type="button" class="signinBtn" value="로그인" />
        </form>
        <div class="signin__actions">
          <a href="#">아이디 찾기</a>
          <a href="#">비밀번호 찾기</a>
          <a href="#">회원가입</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

// 현재 경로가 signin일 경우 layout을 null로 설정해 adminAside 제거
definePageMeta({
  layout: 'admin'
});

if(useRoute().path === '/admin/signin') {
  definePageMeta({
    layout: null
  });
}

</script>

<style lang="css" scoped>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* background: url(/img/back_1.jpg); */
  background: var(--background);
  /* background-size: cover;
  background-position: center; */

}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 100px;
  background: var(--accent-1);
  border-bottom: 1px solid var(--black);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
  
}

.header__logo{
  font-family: 'Dahlia-Bold', sans-serif;
  font-size: 36px;
  color: var(--black);
  user-select: none;
}

/* .header__navigation a {
  position: relative;
  font-size: 16px;
  color: var(--black);
  text-decoration: none;
  font-weight: 500;
  margin-left: 40px;
} */

.header__navigation .mainBtn i {
  font-size: 18px;
}

.header__navigation .mainBtn {
  width: 130px;
  height: 50px;
  background-color: transparent;
  border: 2px solid var(--black);
  border-radius: var(--border-1);
  outline: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-left: 40px;
  transition: .5s;
}

.header__navigation .mainBtn:hover {
  background: var(--white);
  color: var(--black);
  /* border: 2px solid var(--black); */
}

.signin {
  position: relative;
  /* border: 1px solid var(--black); */
  padding: 130px 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signin__card {
  width: 440px;
  /* padding: 40px; */
  padding: 20px 40px 10px 40px;
  margin: 0 auto;
  border: 2px solid rgba(255, 255, 255, .5);
  border-radius: var(--border-1);
  background-color: var(--white);
  box-shadow: 0 0 30px rgba(0, 0, 0, .1);
}

.signin__card h2 {
  color: var(--black);
  padding-top: 30px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  padding-bottom: 30px;
}

.signin__input {
  position: relative;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid var(--black);
  margin: 30px 0;
}

.signin__input label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-weight: 500;
  font-size: 16px;
  pointer-events: none;
  transition: .5s;
  /* color: var(--color-grey-6); */
  color: var(--black);
}

.signin__input input:focus~label,
.signin__input input:valid~label {
  top: -5px;
}

.signin__input input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  /* font-size: 18px; */
  color: var(--black);
  font-weight: 600;
  padding: 0 35px 0 5px;
}

.signin__input .signin__icon {
  position: absolute;
  right: 8px;
  font-size: 18px;
  line-height: 57px;
}

.signin__remember {
  font-size: 14px;
  margin: -15px 0 15px;
}

.signin__remember label input {
  position: relative;
  accent-color: var(--accent-1);
  margin-right: 3px;
  top: 1.5px;
}

.signinBtn {
  width: 100%;
  height: 45px;
  color: var(--white);
  font-size: 14px;
  font-weight: 600;
  background: var(--color-point-4);
  border: none;
  outline: none;
  border-radius: var(--border-1);
  cursor: pointer;
  margin-top: 30px;
}

/* .signin form {
  padding: 30px 30px;
}

.signin__card form >
input[type='text'],
input[type='password'],
input[type='button'] {
  width: 100%;
  margin-bottom: 12px;
  padding: 15px;
  outline: none;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid var(--color-grey-4);
  border-radius: var(--border-1);
}

.signin__card form >
input[type='text']:focus,
input[type='password']:focus {
  border: 1px solid var(--color-point-4);
} */



/* #signin__msg {
  text-align: left;
  color: tomato;
  font-size: 10px;
} */

/* .signin__card form [type='button'] {
  margin-top: 60px;
  background-color: var(--color-point-4);
  border: none;
  color: var(--white);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
} */

.signin__card .signin__actions {
  display: flex;
  margin-top: 45px; 
  border-top: 1px solid var(--black);
}

.signin__card .signin__actions a {
  flex-grow: 1;
  flex-basis: 0;
  text-align: center;
  padding: 20px;
  text-decoration: none;
  color: var(--black);
  font-size: 14px;
}

.signin__card .signin__actions a:hover {
  text-decoration: underline;
}

.signin__card .signin__actions a:last-child {
  border-right: none;
}

</style>