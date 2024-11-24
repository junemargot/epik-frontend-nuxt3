<template>
  <main>
    <!-- 슬라이더 섹션 -->
    <div class="photo-slider">
      <div class="slider-container" ref="slider">
        <div class="slider-item" v-for="(image, index) in sliderImages" :key="index">
          <a href="http://localhost:3000/concert/43" class="picks__item-link"></a>
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
          <a href="http://localhost:3000/concert/43" class="picks__item-link">
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
          <a href="http://localhost:3000/concert/43" class="picks__item-link">
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
  { src: '/images/콜드플레이1.gif', alt: 'Image 1' },
  { src: '/images/크러쉬.gif', alt: 'Image 2' },
  { src: '/images/에이핑크.gif', alt: 'Image 3' },
  { src: '/images/두아리파.gif', alt: 'Image 4' },
  { src: '/images/규현.gif', alt: 'Image 5' },
  { src: '/images/켈라니.gif', alt: 'Image 6' },
  { src: '/images/성시경.gif', alt: 'Image 7' },
  { src: '/images/케시.gif', alt: 'Image 8' }
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
  { id: 1, image: '/images/다비치.gif', title: '2025 DAVICHI CONCERT 〈A Stitch in Time〉', venue: 'KSPO DOME(올림픽공원)', date: '25.01.18 - 01.19' },
  { id: 2, image: '/images/에이핑크.gif', title: '2024 Apink 7th Concert 〈PINK CHRISTMAS〉', venue: 'KBS아레나', date: '24.12.21 - 12.22' },
  { id: 3, image: '/images/크러쉬.gif', title: '2024 CRUSH CONCERT ［CRUSH HOUR : O］', venue: '올림픽공원', date: '24.12.20 - 12.22' },
  { id: 4, image: '/images/찰리푸스.gif', title: '찰리푸스 내한공연', venue: '고척스카이돔', date: '24.12.07 - 12.08' },
  { id: 5, image: '/images/ado.gif', title: 'Ado WORLD TOUR 2025 “Hibana”', venue: '일산 킨텍스 제2전시장 9홀', date: '25.05.15' },
  { id: 6, image: '/images/하이라이트.gif', title: '터치드(TOUCHED) 단독 콘서트 ‘HIGHLIGHT Ⅲ’', venue: '올림픽공원 올림픽홀', date: '25.01.25 - 01.26' }
]);

// 필터 데이터
const filters = ref(['전체', '서울', '경기/인천', '충청/강원', '대구/경북', '부산/경남', '광주/전라', '제주']);

// 지역별 보기 아이템 데이터
const items = ref([
  { id: 1, image: '/images/두아리파.gif', title: '두아 리파 내한공연', venue: '고척스카이돔', date: '24.12.04 - 12.05', hidden: false },
  { id: 2, image: '/images/영탁.gif', title: '2024 영탁 단독 콘서트 “TAK SHOW3” - 인천', venue: '송도컨벤시아', date: '25.01.18 - 01.19', hidden: false },
  { id: 3, image: '/images/자우림.gif', title: '자우림 단독 콘서트 ［ MIDNIGHT EXPRESS 2024-2025 ］', venue: '장충체육관', date: '24.12.27 - 12.29', hidden: false },
  { id: 4, image: '/images/이창섭.gif', title: '이창섭 단독 콘서트 〈The Wayfarer〉 - 수원', venue: '수원 실내체육관', date: '24.12.28 - 12.29', hidden: false  },
  { id: 5, image: '/images/찰리푸스.gif', title: '찰리푸스 내한공연', venue: '고척스카이돔', date: '24.12.07 - 12.08' , hidden: false },
  { id: 6, image: '/images/에이핑크.gif', title: '2024 Apink 7th Concert 〈PINK CHRISTMAS〉', venue: '올림픽공원', date: '24.12.20 - 12.22', hidden: true  },
  { id: 7, image: '/images/원리퍼블릭.gif', title: 'OneRepublic The Artificial Paradise Tour in Korea', venue: '인스파이어 아레나', date: '25.01.18' , hidden: true },
  { id: 8, image: '/images/다비치.gif', title: '2025 DAVICHI CONCERT 〈A Stitch in Time〉', venue: 'KSPO DOME(올림픽공원)', date: '25.01.18 - 01.19', hidden: true },
  { id: 9, image: '/images/크러쉬.gif', title: '2024 CRUSH CONCERT ［CRUSH HOUR : O］', venue: '올림픽공원', date: '24.12.20 - 12.22', hidden: true },
  { id: 10, image: '/images/ado.gif', title: 'Ado WORLD TOUR 2025 “Hibana”', venue: '일산 킨텍스 제2전시장 9홀', date: '25.05.15', hidden: true },
  { id: 11, image: '/images/하이라이트.gif', title: '터치드(TOUCHED) 단독 콘서트 ‘HIGHLIGHT Ⅲ’', venue: '올림픽공원 올림픽홀', date: '25.01.25 - 01.26', hidden: true },
  { id: 12, image: '/images/권진아.gif', title: '2024 권진아 연말 콘서트 〈This Winter〉', venue: '올림픽공원 핸드볼경기장', date: '24.12.13 - 12.15' , hidden: true},
  { id: 13, image: '/images/하동균.gif', title: '2024 하동균 단독 콘서트 〈Piece〉', venue: '블루스퀘어 마스터카드홀', date: '24.12.21 - 12.22' , hidden: true},
  { id: 14, image: '/images/카운트.gif', title: 'COUNTDOWN FANTASY 2024-2025', venue: '킨텍스 5홀', date: '24.12.30 - 12.31' , hidden: true},
  { id: 15, image: '/images/규현.gif', title: 'KYUHYUN 10th Anniversary Asia Tour ［COLORS］ in SEOUL', venue: '올림픽공원 올림픽홀', date: '24.12.20 - 12.22', hidden: true },
  { id: 16, image: '/images/이영현.gif', title: '2024 이영현 콘서트 “나의 노래가 필요한 너에게”', venue: '인터파크 유니플렉스 2관', date: '24.06.07 - 12.29' , hidden: true},
  { id: 17, image: '/images/케시.gif', title: 'keshi: REQUIEM TOUR IN SEOUL', venue: '올림픽공원 올림픽홀', date: '25.03.01' , hidden: true},
  { id: 18, image: '/images/휘성.gif', title: '2024 휘성 콘서트 Winterfall', venue: 'KBS아레나', date: '24.12.23 - 12.24' , hidden: true},
  { id: 19, image: '/images/제드.gif', title: '제드 내한공연', venue: '인스파이어 아레나', date: '25.03.01' , hidden: true},
  { id: 20, image: '/images/켈라니.gif', title: '켈라니 내한공연', venue: '올림픽공원 올림픽홀', date: '25.03.06', hidden: true },
  { id: 21, image: '/images/성시경.gif', title: '2024 성시경 연말 콘서트 〈성시경〉', venue: 'KSPO DOME', date: '24.12.27 - 12.31', hidden: true }
  
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