<template>
  <div class="wrap" v-if="exhibition">
    <!-- section 1 -->
    <div class="event">
      <EventHeader
        :title="exhibition.title"
        @notification-click="handleNotification"
        @bookmark-click="handleBookmark"
      />

      <!-- 맨 위로 버튼 -->
      <button id="go-top" class="hidden">
        <i class="fas fa-arrow-up"></i> TOP
      </button>

      <!-- section 2 -->
      <main>
        <EventInfo 
          :image-url="`http://localhost:8081/api/v1/uploads/images/exhibition/${exhibition.saveImageName}`"
          :image-alt="`${exhibition.title} 포스터`"
          :venue="exhibition.venue"
          :running-time="exhibition.runningTime"
          :start-date="exhibition.startDate"
          :end-date="exhibition.endDate"
          :age-restriction="exhibition.ageRestriction"
          :ticket-prices="exhibition.ticketPrices"
          :ticket-offices="exhibition.ticketOffices"
          :address="exhibition.address"
        />
        <!-- <div class="musical__content">
          <img :src="`http://localhost:8081/api/v1/uploads/images/exhibition/${exhibition.saveImageName}`"
            :alt="exhibition.title + ' 포스터'">
          <div class="musical__info">
            <div class="musical__info-row">
              <p class="musical__info-label">장소</p>
              <p class="musical__info-value">{{ exhibition.venue }}</p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">공연시간</p>
              <p class="musical__info-value">{{ exhibition.runningTime }}</p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">공연기간</p>
              <p class="musical__info-value">1
                {{ formatDate(exhibition.startDate) }} ~ {{ formatDate(exhibition.endDate) }}
              </p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">관람연령</p>
              <p class="musical__info-value">{{ exhibition.ageRestriction }}</p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">가격</p>
              <ul class="musical__price-list">
                <li v-for="price in exhibition.ticketPrices" :key="price.id">
                  <span class="musical__seat">{{ price.type }}</span>
                  <span class="musical__price">{{ price.price }}</span>
                </li>
              </ul>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">예매처</p>
              <div class="musical__booking-links">
                <a :href="office.link" target="_blank" name="link" v-for="office in exhibition.ticketOffices"
                  :key="office.id">
                  {{ office.name }}
                </a>
              </div>
            </div>
          </div>
        </div> -->

        <!-- section 3 -->
        <EventIntro 
          title="뮤지컬"
          :content="exhibition.content"
          :youtube-url="exhibition.youtubeUrl"
          :images="exhibition.exhibitionImages"
        />

        <!-- section 4 -->
        <EventLocation 
          :address="exhibition.address"

        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const exhibitionId = route.params.id;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상대 관리 위한 ref 선언
const exhibition = ref(null);

// 데이터 가져오기
watchEffect(async () => {
  const { data } = await useFetch(`/admin/exhibition/${exhibitionId}`, {
    baseURL: apiBase,
    key: `exhibition-${exhibitionId}`,
  });

  if(data.value) {
    exhibition.value = data.value;
  }
});

</script>

<style scoped>
@import url('/public/css/musical/[id]/index.css');
</style>