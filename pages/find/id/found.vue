<template>
  <main class="login-in-wrap">
    <section class="search-id__wrap small-wrap">
      <div class="search-id__intro">
        <h1 class="search-id__title intro-title">
          아이디 찾기
        </h1>
      </div>

      <div class="search-id__result">
        <h2 hidden>메일 일치 결과</h2>

        <div class="search-id__found">
          입력하신 정보로 검색된 아이디입니다<br>
          <span class="search-id__found-id bold_blue_text"><br>{{ foundId }}</span>
        </div>
      </div>

      <div class="gap-bmt_1">
        <button class="long_btn">로그인하러 가기
        </button>
      </div>

    </section>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const foundId = route.query.id || '아이디를 찾을 수 없습니다.';
</script>

<style>
@import url('/public/css/login/login.css');
</style>