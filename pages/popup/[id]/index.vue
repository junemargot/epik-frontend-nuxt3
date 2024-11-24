<script setup>
import { ref, onMounted, nextTick, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from 'nuxt/app';
import { useFetch } from '#app';

const route = useRoute();
const popupId = route.params.id;
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 북마크 상태 관리
const isBookmark = ref(false);
function clickBookmark() {
  isBookmark.value = !isBookmark.value;
}

// 알림 상태 관리
const isNotification = ref(false);
function clickNotification() {
  isNotification.value = !isNotification.value;
}

// 슬라이더 상태 관리
const currentIdx = ref(0);
const slideWidth = ref(0);
const slideContainer = ref(null);
const slides = ref([]);
const imagesLoaded = ref(false);


// 이미지 로드 확인
function checkImagesLoaded() {
  const images = Array.from(document.querySelectorAll('.popup-info__slide img'));
  let loadedCount = 0;

  const imageLoaded = () => {
    loadedCount++;
    if (loadedCount === images.length) {
      imagesLoaded.value = true;
      initializeSlider();
    }
  };

  images.forEach((img) => {
    if (img.complete) {
      imageLoaded();
    } else {
      img.addEventListener('load', imageLoaded);
      img.addEventListener('error', imageLoaded);
    }
  });
}

// 슬라이더 초기화
function initializeSlider() {
  nextTick(() => {
    makeClone();
    updateWidth();
    setInitialPos();
  });
}

function makeClone() {
  slides.value.forEach((slide) => {
    const cloneSlide = slide.cloneNode(true);
    cloneSlide.classList.add('clone');
    slideContainer.value.appendChild(cloneSlide);
  });

  slides.value.reverse().forEach((slide) => {
    const cloneSlide = slide.cloneNode(true);
    cloneSlide.classList.add('clone');
    slideContainer.value.prepend(cloneSlide);
  });

  slides.value = Array.from(document.querySelectorAll('.popup-info__slide'));
}

function updateWidth() {
  const totalSlides = document.querySelectorAll('.popup-info__slide').length;
  slideContainer.value.style.width = `${slideWidth.value * totalSlides}px`;
}

function setInitialPos() {
  slideContainer.value.style.transform = `translateX(-${slideWidth.value * slides.value.length}px)`;
}

function moveSlide(num) {
  currentIdx.value = (num + slides.value.length) % slides.value.length;
  slideContainer.value.style.transform = `translateX(${-currentIdx.value * slideWidth.value}px)`;
}

function prevSlide() {
  moveSlide(currentIdx.value - 1);
}

function nextSlide() {
  moveSlide(currentIdx.value + 1);
}

// 데이터 가져오기
const popup = ref(null);
const { data, error } = useFetch(`/admin/popup/${popupId}`, {
  baseURL: apiBase,
  key: `popup-${popupId}`,
});

watchEffect(() => {
  if (data.value) {
    popup.value = data.value;
    nextTick(checkImagesLoaded);
  } else if (error.value) {
    console.error('Failed to fetch popup data:', error.value);
  }
});

// onMounted
onMounted(async () => {
  slides.value = Array.from(document.querySelectorAll('.popup-info__slide'));
  slideContainer.value = document.querySelector('.popup-info__slides');
  slideWidth.value = slides.value[0]?.clientWidth || 0;
});

// 날짜 포맷
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');
}

// 지도 관련 변수 및 함수
let map;
let marker;
let infowindow;

function initMap() {
  const mapOptions = {
    center: new naver.maps.LatLng(37.5297, 126.9647), // 초기 중심 좌표 (서울시청)
    zoom: 15
  };

  map = new naver.maps.Map('map', mapOptions);

  marker = new naver.maps.Marker({
    position: mapOptions.center,
    map: map
  });

  infowindow = new naver.maps.InfoWindow();
}


// 클라이언트에서만 실행되도록 지도를 초기화
onMounted(() => {
  const mapScript = document.createElement('script');
  mapScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=yvwezi7lts&submodules=geocoder`;
  mapScript.async = true;
  mapScript.onload = initMap;
  document.head.appendChild(mapScript);
});
</script>

<template>
  <!-- popup -->
  <main class="popup__wrap">
    <!-- section 1 -->
    <section class="popup__infomation">

      <!-- /images-slider 파란선 -->
      <div class="popup-info__slider">
        <div class="popup-info__slides">
          <!-- <img class="popup-info__slide" src="/images/나가노마켓1.jpg" alt="/images #1">
          <img class="popup-info__slide" src="/images/나가노마켓2.jpg" alt="/images #2">
          <img class="popup-info__slide" src="/images/나가노마켓3.jpg" alt="/images #3">
          <img class="popup-info__slide" src="/images/나가노마켓4.jpg" alt="/images #4">
          <img class="popup-info__slide" src="/images/나가노마켓5.jpg" alt="/images #5"> -->
          <!-- <img v-for="(imageName, index) in (popup.saveImageNames || [])" :key="index"
            :src="`http://localhost:8081/api/v1/uploads/images/popup/${imageName}`" :alt="'포스터이미지 ' + (index + 1)" /> -->
          <img class="popup-info__slide" v-for="(imageName, index) in popup?.saveImageNames" :key="index"
            :src="`http://localhost:8081/api/v1/uploads/images/popup/${imageName}`" :alt="`이미지 #${index + 1}`" />
        </div>
        <a class="popup-info__prev" @click="prevSlide"><i class='bx bx-chevron-left'></i></a>
        <a class="popup-info__next" @click="nextSlide"><i class='bx bx-chevron-right'></i></a>
      </div>

      <!-- 파란선-->
      <div class="popup__details">
        <!-- 주황선 -->
        <div class="">
          <h1 class="popup__title">{{ popup?.title }}</h1>
          <address class="popup__address">
            <i class='bx bx-map'></i>
            <span>{{ popup?.address }}</span>
          </address>
          <div class="popup__date">
            <i class='bx bx-calendar'></i>
            <span name="startDate">{{ formatDate(popup?.startDate) }}</span>
            <span>~</span>
            <span name="endDate">{{ formatDate(popup?.endDate) }}</span>
          </div>
          <div class="popup__tags">
            <span v-for="(tag, index) in popup?.tags" :key="index" class="popup__tag">
              {{ tag }} <!-- tag 객체에서 tag 필드만 출력 -->
            </span>
          </div>
        </div>


        <!-- 주황선 -->
        <div class="popup__links">
          <a href="#" class="popup__icon-link">
            <i class='bx bx-conversation'></i> <!-- icon -->
            <span>채팅</span>
          </a>
          <a href="#" class="popup__icon-link" @click.prevent="clickBookmark">
            <i :class="['icon', isBookmark ? 'bx bxs-bookmark' : 'bx bx-bookmark', { bookmarkCheck: isBookmark }]"></i>
            <span>북마크</span>
          </a>
          <a href="#" class="popup__icon-link" @click.prevent="clickNotification">
            <i
              :class="['icon', isNotification ? 'bx bxs-bell' : 'bx bx-bell', { notificationCheck: isNotification }]"></i>
            <span>알림</span>
          </a>
        </div>
      </div>

    </section>


    <!-- section 2 -->
    <div v-html="popup?.content" class="popup__description"></div>

    <!-- section 3 -->
    <section class="popup__addinfo">
      <h1>상세 정보</h1>
      <address class="popup__addinfo-address">
        <i class='bx bx-map-alt'></i>
        <span>{{ popup?.address }}</span>
      </address>
      <address class="popup__addinfo-address-detail">
        <div>5</div>
        <span>{{ popup?.addressDetail }}</span>
      </address>
      <div id="map" style="width:100%;height:400px;"></div>
      <div class="popup-detail__sns">
        <a :href="popup?.snsLink" class="popup__sns-link">
          <i class='bx bxl-instagram'></i>
          <span>SNS 바로가기</span>
        </a>
        <a :href="popup?.webLink" class="popup__sns-link">
          <i class='bx bx-globe'></i>
          <span>브랜드 홈페이지 바로가기</span>
        </a>
      </div>
    </section>
  </main>
</template>
<style scoped>
@import url('/public/css/popup/[id]/index.css');
</style>