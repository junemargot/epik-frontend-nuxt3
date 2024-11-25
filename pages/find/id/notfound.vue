<template>
  <main class="login-in-wrap">
    <section class="search-id__wrap small-wrap">
      <div class="search-id__intro">
        <h1 class="search-id__title intro-title">
          아이디 찾기
        </h1>
      </div>

      <div class="search-id__result">
        <h2 hidden>아이디 찾기 결과</h2>

        <div class="search-id__notfound">
          입력하신 정보로 검색된 아이디가 존재하지 않습니다.<br>
          다시 한번 확인 후 진행해주세요
        </div>
      </div>

      <div class="gap-bmt_1">
        <a href="http://localhost:3001/signup">
          <button class="long_btn" @click="signinBtn">
            회원가입하기</button>
        </a>
      </div>
      <div class="gap-mt_1">
        <a href="http://localhost:3001/find/id">
        <button class="long_btn">
          아이디 찾기</button>
        </a>
      </div>

    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const checkBtnVisible = ref(false);

const checkBtn = () => {
  console.log('확인 버튼 클릭')
  // checkBtnVisible.value = !checkBtnVisible.value;
  router.push('/sign-in');
};
</script>

<style>
@import url('/public/css/login/login.css');
</style>