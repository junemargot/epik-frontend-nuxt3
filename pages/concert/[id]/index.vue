<template>
  <div class="wrap" v-if="concert">
    <!-- section 1 -->
    <div class="event">
      <EventHeader
        :title="concert.title"
        @notification-click="handleNotification"
        @bookmark-click="handleBookmark"
      />

      <!-- 맨 위로 버튼 -->
      <button id="go-top" class="hidden">
        <i class='bx bx-chevron-up'></i> TOP
      </button>

      <!-- section 2 -->
      <main>
        <EventInfo
          :image-url="`http://localhost:8081/api/v1/uploads/images/concert/${concert.saveImageName}`"          
          :image-alt="`${concert.title} 포스터`"
          :venue="concert.venue"
          :running-time="concert.runningTime"
          :start-date="concert.startDate"
          :end-date="concert.endDate"
          :age-restriction="concert.ageRestriction"
          :ticket-prices="concert.ticketPrices"
          :ticket-offices="concert.ticketOffices"
          :address="concert.address"
        />

        <!-- section 3 -->
        <EventIntro
          title="콘서트"
          :content="concert.content"
          :youtube-url="concert.youtubeUrl"
          :images="concert.concertImages"
        />

        <!-- section 4 -->
        <!-- <EventLocation 
          :address="concert.address"
          :venue-name="concert.venue"
        /> -->
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import EventHeader from '~/components/event/EventHeader.vue';
import EventInfo from '~/components/event/EventInfo.vue';
import EventIntro from '~/components/event/EventIntro.vue';
import EventLocation from '~/components/event/EventLocation.vue';

const route = useRoute();
const concertId = route.params.id;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상태 관리 위한 ref 선언
const concert = ref(null);
const error = ref(null);
const images = ref([]);

// 데이터 가져오기
watchEffect(async () => {
  const { data } = await useFetch(`/admin/concert/${concertId}`, {
    baseURL: apiBase,
    key: `concert-${concertId}`,
  });

  if (data.value) {
    concert.value = data.value;

    console.log('콘서트 데이터 로드됨:', concert.value); 
    console.log('콘서트 이미지:', concert.value.concertImages);
  }
});


// 이벤트 핸들러 추가
function handleNotification() {
  console.log('알림 설정');
}

function handleBookmark() {
  console.log('북마크 설정');
}

</script>

<style scoped>
/* @import url('/public/css/concert/[id]/index.css');
@import url('/public/css/components/event.css'); */
</style>
