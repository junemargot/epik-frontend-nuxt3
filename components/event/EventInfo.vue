<template>
  <div class="event__content">
    <img 
      :src="imageUrl" 
      :alt="imageAlt || '포스터 이미지'" 
    />
    <div class="event__info">
      <div class="event__info-row">
        <p class="event__info-label">장소</p>
        <p class="event__info-value">{{ venue }}</p>
      </div>
      <div class="event__info-row">
        <p class="event__info-label">공연시간</p>
        <p class="event__info-value">{{ runningTime }}</p>
      </div>
      <div class="event__info-row">
        <p class="event__info-label">공연기간</p>
        <p class="event__info-value">
          {{ formatDate(startDate) }} ~ {{ formatDate(endDate) }}
        </p>
      </div>
      <div class="event__info-row">
        <p class="event__info-label">관람연령</p>
        <p class="event__info-value">{{ ageRestriction }}</p>
      </div>
      <div class="event__info-row">
        <p class="event__info-label">가격</p>
        <ul class="event__price-list">
          <li v-for="price in ticketPrices" :key="price.id">
            <span class="event__seat">{{ price.seat }}</span>
            <span class="event__price">{{ price.price }}</span>
          </li>
        </ul>
      </div>
      <div class="event__info-row">
        <p class="event__info-label">예매처</p>
        <div class="event__booking-links">
          <a 
            v-for="office in ticketOffices" 
            :key="office.id"
            :href="office.link" 
            target="_blank" 
            name="link"
          >
            {{ office.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    default: ''
  },
  venue: {
    type: String,
    required: true
  },
  runningTime: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  ageRestriction: {
    type: String,
    required: true
  },
  ticketPrices: {
    type: Array,
    default: () => []
  },
  ticketOffices: {
    type: Array,
    default: () => []
  }
});

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '.').replace(/\.$/, '');
};
</script>
