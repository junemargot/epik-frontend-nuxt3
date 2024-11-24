<template>
  <main>
    <!-- 슬라이더 섹션 -->
    <div class="photo-slider">
      <div class="slider-container" ref="slider">
        <div class="slider-item" v-for="(image, index) in sliderImages" :key="index">
          <img :src="image.src" :alt="image.alt">
        </div>
      </div>
      <button class="arrow-left" @click="moveSlider(-1)" :disabled="isPrevDisabled">&#8592;</button>
      <button class="arrow-right" @click="moveSlider(1)" :disabled="isNextDisabled">&#8594;</button>
    </div>

    <!-- EPIK'S PICK 섹션 -->
    <section class="picks">
      <div class="picks__header">
        <h2 class="picks__title">EPIK'S PICK</h2>
      </div>
      <div class="picks__container">
        <div v-for="pick in picks" :key="pick.id" class="picks__item">
          <a href="#" class="picks__item-link">
            <img :src="pick.image" :alt="pick.title + ' 포스터'" class="picks__image">
            <span class="picks__item-title">{{ pick.title }}</span>
            <span class="picks__item-venue">{{ pick.venue }}</span>
            <span class="picks__item-date">{{ pick.date }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- 지역별 보기 섹션 -->
    <section class="region">
      <h2 class="region__title">지역별 보기</h2>

      <div class="region__filters">
        <a href="#" v-for="filter in filters" :key="filter" class="region__filter-link">{{ filter }}</a>
      </div>

      <div class="region__container">
        <!-- 아이템 리스트 -->
        <div v-for="item in items" :key="item.id" :class="{ hidden: item.hidden }" class="region__item">
          <a href="#" class="region__item-link">
            <img :src="item.image" :alt="item.title + ' 포스터'" class="region__image">
            <span class="region__item-title">{{ item.title }}</span>
            <span class="region__item-venue">{{ item.venue }}</span>
            <span class="region__item-date">{{ item.date }}</span>
          </a>
        </div>
      </div>

      <!-- 더보기 버튼 -->
      <button v-if="hasHiddenItems" @click="showMoreItems" class="region__more-btn">더보기</button>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 슬라이더 이미지 데이터
const sliderImages = ref([
  { src: '/images/젠틀맨스가이드.jpg', alt: 'Image 1' },
  { src: '/images/베르사유장미.jpg', alt: 'Image 2' },
  { src: '/images/프랑켄슈타인.jpg', alt: 'Image 3' },
  { src: '/images/어쩌면 해피엔딩.jpg.png', alt: 'Image 4' },
  { src: '/images/24011656_p.gif', alt: 'Image 5' },
  { src: '/images/시데레우스.jpg', alt: 'Image 6' },
  { src: '/images/쓰릴미.jpg', alt: 'Image 7' },
  { src: '/images/하데스타운.jpg', alt: 'Image 8' }
]);

// 슬라이더 관련 상태 및 함수
const slider = ref(null);
const currentIndex = ref(0);
const slidesToShow = 3; // 한 번에 보여줄 슬라이드 수
let slideWidth = ref(0);

function updateDimensions() {
  const slideElement = slider.value.querySelector('.slider-item');
  if (slideElement) {
    slideWidth.value = slideElement.offsetWidth + parseFloat(getComputedStyle(slideElement).marginRight);
    slider.value.style.width = `${slideWidth.value * sliderImages.value.length}px`;
  }
}

function moveSlider(direction) {
  currentIndex.value = Math.max(0, Math.min(sliderImages.value.length - slidesToShow, currentIndex.value + direction));
  const translateX = -currentIndex.value * slideWidth.value;
  slider.value.style.transform = `translateX(${translateX}px)`;
}

const isPrevDisabled = computed(() => currentIndex.value === 0);
const isNextDisabled = computed(() => currentIndex.value === sliderImages.value.length - slidesToShow);

onMounted(() => {
  updateDimensions();
});

// EPIK'S PICK 데이터
const picks = ref([
  { id: 1, image: '/images/어쩌면 해피엔딩.jpg', title: '어쩌면 해피엔딩', venue: '예스24 스테이지 1관', date: '24.08.07 - 08.09' },
  { id: 2, image: '/images/빨래 뮤지컬.gif', title: '빨래', venue: '인터파크 유니플렉스 2관', date: '24.06.07 - 12.29' },
  { id: 3, image: '/images/리지.gif', title: '뮤지컬 리지', venue: '두산아트센터 연강홀', date: '24.09.14 - 12.01' },
  { id: 4, image: '/images/베르사유장미.jpg', title: '베르사유장미', venue: '충무아트센터 대극장', date: '24.07.16 - 10.13' },
  { id: 5, image: '/images/젠틀맨스가이드.jpg', title: '젠틀맨스 가이드', venue: '광림아트센터 BBCH홀', date: '24.07.06 - 10.20' },
  { id: 6, image: '/images/지킬앤하이드.gif', title: '지킬앤하이드', venue: '블루스퀘어 신한카드홀', date: '24.11.29 - 05.18' }
]);

// 필터 데이터
const filters = ref(['전체', '서울', '경기/인천', '충청/강원', '대구/경북', '부산/경남', '광주/전라', '제주']);

// 지역별 보기 아이템 데이터
const items = ref([
  { id: 1, image: '/images/빨래 뮤지컬.gif', title: '빨래', venue: '인터파크 유니플렉스 2관', date: '24.06.07 - 12.29', hidden: false },
  { id: 2, image: '/images/빨래 뮤지컬.gif', title: '빨래', venue: '인터파크 유니플렉스 2관', date: '24.06.07 - 12.29', hidden: false },
  { id: 3, image: '/images/리지.gif', title: '뮤지컬 리지', venue: '두산아트센터 연강홀', date: '24.09.14 - 12.01', hidden: false },
  { id: 4, image: '/images/베르사유장미.jpg', title: '베르사유장미', venue: '충무아트센터 대극장', date: '24.07.16 - 10.13', hidden: false  },
  { id: 5, image: '/images/젠틀맨스가이드.jpg', title: '젠틀맨스 가이드', venue: '광림아트센터 BBCH홀', date: '24.07.06 - 10.20' , hidden: false },
  { id: 6, image: '/images/지킬앤하이드.gif', title: '지킬앤하이드', venue: '블루스퀘어 신한카드홀', date: '24.11.29 - 05.18', hidden: true  },
  { id: 7, image: '/images/빨래 뮤지컬.gif', title: '빨래', venue: '인터파크 유니플렉스 2관', date: '24.06.07 - 12.29' , hidden: true },
  { id: 8, image: '/images/리지.gif', title: '뮤지컬 리지', venue: '두산아트센터 연강홀', date: '24.09.14 - 12.01', hidden: true },
  { id: 9, image: '/images/베르사유장미.jpg', title: '베르사유장미', venue: '충무아트센터 대극장', date: '24.07.16 - 10.13', hidden: true },
  { id: 10, image: '/images/젠틀맨스가이드.jpg', title: '젠틀맨스 가이드', venue: '광림아트센터 BBCH홀', date: '24.07.06 - 10.20', hidden: true },
  { id: 11, image: '/images/지킬앤하이드.gif', title: '지킬앤하이드', venue: '블루스퀘어 신한카드홀', date: '24.11.29 - 05.18', hidden: true },
  { id: 12, image: '/images/리지.gif', title: '뮤지컬 리지', venue: '두산아트센터 연강홀', date: '24.09.14 - 12.01' , hidden: true},
  { id: 13, image: '/images/베르사유장미.jpg', title: '베르사유장미', venue: '충무아트센터 대극장', date: '24.07.16 - 10.13' , hidden: true},
  { id: 14, image: '/images/젠틀맨스가이드.jpg', title: '젠틀맨스 가이드', venue: '광림아트센터 BBCH홀', date: '24.07.06 - 10.20' , hidden: true},
  { id: 15, image: '/images/지킬앤하이드.gif', title: '지킬앤하이드', venue: '블루스퀘어 신한카드홀', date: '24.11.29 - 05.18', hidden: true },
  { id: 16, image: '/images/빨래 뮤지컬.gif', title: '빨래', venue: '인터파크 유니플렉스 2관', date: '24.06.07 - 12.29' , hidden: true},
  { id: 17, image: '/images/리지.gif', title: '뮤지컬 리지', venue: '두산아트센터 연강홀', date: '24.09.14 - 12.01' , hidden: true},
  { id: 18, image: '/images/베르사유장미.jpg', title: '베르사유장미', venue: '충무아트센터 대극장', date: '24.07.16 - 10.13' , hidden: true},
  { id: 19, image: '/images/젠틀맨스가이드.jpg', title: '젠틀맨스 가이드', venue: '광림아트센터 BBCH홀', date: '24.07.06 - 10.20' , hidden: true},
  { id: 20, image: '/images/지킬앤하이드.gif', title: '지킬앤하이드', venue: '블루스퀘어 신한카드홀', date: '24.11.29 - 05.18', hidden: true },
  { id: 20, image: '/images/지킬앤하이드.gif', title: '지킬앤하이드', venue: '블루스퀘어 신한카드홀', date: '24.11.29 - 05.18', hidden: true }
  
  // ... 추가 아이템
]);

const itemsPerPage = 15;

// 숨겨진 아이템이 있는지 확인하는 계산 속성
const hasHiddenItems = computed(() => items.value.some(item => item.hidden));

// 더 많은 아이템을 표시하는 함수
function showMoreItems() {
  let itemsShown = 0;
  
  for (let item of items.value) {
    if (itemsShown >= itemsPerPage) break;
    if (item.hidden) {
      item.hidden = false;
      itemsShown++;
    }
  }
}
</script>

<style scoped>
@import url('/public/css/concert/');
</style>