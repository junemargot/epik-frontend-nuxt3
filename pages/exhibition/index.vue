<template>
  <main>
    <!-- 슬라이더 섹션 -->
    <div class="photo-slider">
      <div class="slider-container" ref="slider">
        <div class="slider-item" v-for="(image, index) in sliderImages" :key="index" >
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
    <section class="region exhibitionrRegion">
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
  { src: '/images/exhibition/main/m-내셔널지오그래픽.gif', alt: 'Image 1' },
  { src: '/images/exhibition/main/m-디즈니 100년.gif', alt: 'Image 2' },
  { src: '/images/exhibition/main/m-불멸의 화가 반고흐.gif', alt: 'Image 3' },
  { src: '/images/exhibition/main/m-빛의 거장 카라바조.gif', alt: 'Image 4' },
  { src: '/images/exhibition/main/m-아트 주얼리.gif', alt: 'Image 5' },
  { src: '/images/exhibition/main/m-안나 다니엘 사진전.gif', alt: 'Image 6' },
  { src: '/images/exhibition/main/m-퓰리처상사진전.gif', alt: 'Image 7' },
  { src: '/images/exhibition/main/메인-미피.gif', alt: 'Image 8' },
  { src: '/images/exhibition/main/메인-미나.gif', alt: 'Image 9' },
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
  { id: 1, image: 'images/exhibition/[슈퍼 얼리버드 ] 안나 & 다니엘 사진전.png', title: '안나 & 다니엘 사진전.png', venue: '두산아트센터 연강홀', date: '24.09.14 - 12.01' },
  { id: 2, image: 'images/exhibition/[ 슈퍼얼리버드 ] 퓰리처상 사진전.png', title: '[ 슈퍼얼리버드 ] 퓰리처상 사진전', venue: '예술의전당 한가람디자인미술관', date: '24.12.21 - 25.01.31' },
  { id: 3, image: '/images/exhibition/main/m-내셔널지오그래픽.gif', title: '내셔널지오그래픽 사진전', venue: 'MUSEUM 209', date: '24.12.05 - 25.04.20' },
  { id: 4, image: '/images/exhibition/main/m-디즈니 100년.gif', title: '디즈니 100년 특별전', venue: 'K현대미술관', date: '24.10.18 - 12.31' },
  { id: 5, image: '/images/exhibition/main/m-아트 주얼리.gif', title: '아트 주얼리', venue: '롯데뮤지엄(자세히)', date: '24.12.06 - 25.01.05' },
  { id: 6, image: '/images/exhibition/main/m-빛의 거장 카라바조.gif', title: '빛의 거장 카라바조 바로크의 얼굴들', venue: '예술의전당 한가람미술관 2층', date: '24.11.09 - 25.03.27' }
]);

// 필터 데이터
const filters = ref(['전체', '서울', '경기/인천', '충청/강원', '대구/경북', '부산/경남', '광주/전라', '제주']);

// 지역별 보기 아이템 데이터
const items = ref([
  { id: 1, image: '/images/exhibition/main/메인-영국 국립자연.gif', title: '영국 국립자연사박물관 특별전', venue: 'F1963 석천홀', date: '24.09.07 - 11.27',  hidden: false },
  { id: 2, image: 'images/exhibition/[ 슈퍼얼리버드 ] 퓰리처상 사진전.png', title: '[ 슈퍼얼리버드 ] 퓰리처상 사진전', venue: '예술의전당 한가람디자인미술관', date: '24.12.21 - 25.01.31', hidden: false },
  { id: 3, image: 'images/exhibition/[슈퍼 얼리버드 ] 안나 & 다니엘 사진전.png', title: '안나 & 다니엘 사진전.png', venue: '두산아트센터 연강홀', date: '24.09.14 - 12.01', hidden: false },
  { id: 4, image: '/images/exhibition/main/m-디즈니 100년.gif', title: '디즈니 100년 특별전', venue: 'K현대미술관', date: '24.10.18 - 12.31', hidden: false },
  { id: 5, image: '/images/exhibition/main/m-아트 주얼리.gif', title: '아트 주얼리', venue: '롯데뮤지엄(자세히)', date: '24.12.06 - 25.01.05', hidden: false },
  { id: 6,image: '/images/exhibition/main/m-빛의 거장 카라바조.gif', title: '빛의 거장 카라바조 바로크의 얼굴들', venue: '예술의전당 한가람미술관 2층', date: '24.11.09 - 25.03.27', hidden: true },
  { id: 7, image: '/images/exhibition/main/메인-오후3시.gif', title: '서울 오후 3시', venue: '성곡미술관 1관', date: '24.11.07 - 12.08', hidden: true },
  { id: 8, image: '/images/exhibition/main/메인-어둠속의 대화.gif', title: 'DIALOGUE IN THE DARK-어둠속의대화', venue: '동탄 어둠속의 대화', date: '21.08.20 - 00.00', hidden: true },
  { id: 9, image: '/images/exhibition/main/메인-광주비엔날레.gif', title: '2024 제15회 광주비엔날레', venue: '광주비엔날레전시관', date: '24.09.07 - 12.01', hidden: true },
  { id: 10, image: '/images/exhibition/main/메인-툴루즈.gif', title: '툴루즈 로트렉', venue: '마이아트뮤지엄', date: '24.09.14 - 25.03.03', hidden: true },
  { id: 11, image: '/images/exhibition/main/메인-다빈치.gif', title: '다빈치 인 서울', venue: '띠아트 서울', date: '24.10.25 - 12.01', hidden: true },
  { id: 12, image: '/images/exhibition/main/메인-연금술사.gif', title: '강철의 연금술사전', venue: '덕스', date: '24.11.30 - 25.03.03', hidden: true },
  { id: 13, image: '/images/exhibition/main/메인-파리의휴일.gif', title: '파리의 휴일', venue: 'K현대미술관', date: '24.07.17 - 25.03.09', hidden: true },
  { id: 14, image: '/images/exhibition/main/메안-고양이 뉴욕.gif', title: '고양이 뉴욕에 가다', venue: '후지시로 세이지 북촌스페이스', date: '22.03.04 - 11.30', hidden: true },
  { id: 15, image: '/images/exhibition/main/메인-아나돌.gif', title: 'FUTURA SEOUL : 레픽 아나돌 이용권', venue: 'FUTURA SEOUL', date: '24.10.22 - 12.08', hidden: true },
  { id: 16, image: '/images/exhibition/main/메인-그림책.gif', title: '그림책이 참 좋아', venue: '예술의전당 서예박물관', date: '24.12.20 - 25.01.31', hidden: true },
  { id: 17, image: '/images/exhibition/main/메인-빈센트.gif', title: '빈센트 발 : THE ART OF SHADOW', venue: '국립부산과학관 1F 김진재홀', date: '24.11.01 - 245.03.03', hidden: true },
  { id: 18,  image: '/images/exhibition/main/m-내셔널지오그래픽.gif', title: '내셔널지오그래픽 사진전', venue: 'MUSEUM 209', date: '24.12.05 - 25.04.20', hidden: true },
  { id: 19, image: '/images/exhibition/main/메인-세종미술관.gif', title: '2024 세종미술관 기획전시_〈판화 오디세이〉', venue: '세종문화회관 미술관본관', date: '24.11.12 - 25.01.05', hidden: true },
  { id: 20, image: '/images/exhibition/main/메인-코난.gif', title: '연제30주년기념 명탐정 코난전 - 대구', venue: '동성로 SPARK 3F 뮤씨엄 대구', date: '24.11.08 - 25.03.03', hidden: true },
  { id: 20, image: '/images/exhibition/main/메인-사랑의단상.gif', title: '사랑의 단상', venue: '뚝섬미술관', date: '24.11.08 - 25.06.08', hidden: true }

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
@import url('/public/css/exhibition/index.css');

.slider-item img {
  cursor: pointer;
}

.picks {
  margin-left: 5px; /* 원하는 만큼 왼쪽으로 이동 */
}

.exhibitionrRegion {
  margin-left: -20px; /* 원하는 만큼 왼쪽으로 이동 */
}

.region__title {
  margin-left: 15px; /* 원하는 만큼 오른쪽으로 이동 */
}
</style>