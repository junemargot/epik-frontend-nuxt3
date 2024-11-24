<template>
  <main class="block-wrap">
    <section class="block-list__wrap small-wrap">
      <div class="block-list__info">
        <h1 class="block-list__title intro-title">
          차단 계정 관리
        </h1>
      </div>

      <div class="block-list__members gap-mt_3">
        <ul>
          <li class="block-list__member" v-for="(member, index) in members" :key="index">
            <img class="block-list__img" :src="member.img"/>
            <span class="block-list__nickname">{{ member.nickname }}</span>
            <button class="unblock_btn" @click="unblock(index)">{{ member.buttonText }}</button>
          </li>
        </ul>
      </div>

    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';

const members = ref([
  { img: '/images/mypage/subway.png', nickname: '서브웨이', buttonText: '차단해제' },
  { img: '/images/mypage/pinkpong.png', nickname: '핑트퐁', buttonText: '차단해제' },
  // 필요한 만큼 멤버 추가
]);

const unblock = (index) => {
  const button = document.querySelectorAll('.unblock_btn')[index];
  button.classList.toggle('active'); // 액티브 클래스 추가/제거

  if (button.classList.contains('active')) {
    members.value[index].buttonText = '차단하기';
  } else {
    members.value[index].buttonText = '차단해제';
  }
};

//td





</script>

<style>
@import url('/public/css/mypage/blockList.css');
</style>