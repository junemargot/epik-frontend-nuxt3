<script setup>
import { ref, onMounted, nextTick, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from 'nuxt/app';
import { useFetch } from '#app';

const route = useRoute();
const popupId = route.params.id;
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 북마크와 알림 상태 관리
const isBookmark = ref(false);
const isNotification = ref(false);
function toggleBookmark() {
  isBookmark.value = !isBookmark.value;
}
function toggleNotification() {
  isNotification.value = !isNotification.value;
}

// // 북마크 상태 관리
// const isBookmark = ref(false);
// function clickBookmark() {
//   isBookmark.value = !isBookmark.value;
// }

// // 알림 상태 관리
// const isNotification = ref(false);
// function clickNotification() {
//   isNotification.value = !isNotification.value;
// }

// 슬라이더 상태 관리
const currentIdx = ref(0);
const slideWidth = ref(0);
const slideContainer = ref(null);
const slides = ref([]);
const imagesLoaded = ref(false);

// 네이버 지도 초기화
async function loadNaverMapScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=yvwezi7lts`;
    script.async = true;
    script.onload = () => {
      if (typeof naver !== 'undefined' && naver.maps) {
        resolve();  // 네이버 지도 API가 제대로 로드되면 resolve 호출
      } else {
        reject(new Error('Naver Maps API is not loaded.'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Naver Map script'));
    document.head.appendChild(script);
  });
}


async function initializeMap(addresses) {
  try {
    // 네이버 맵 객체가 제대로 로드되었는지 확인
    if (typeof naver === 'undefined' || typeof naver.maps === 'undefined') {
      throw new Error('Naver Maps API is not available.');
    }

    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(37.5258, 126.9284),
      zoom: 15,
    });

    // 주소만 있는 배열을 받아서, 그 주소로 지오코딩을 통해 마커를 찍습니다.
    for (const address of addresses) {
      // 지오코딩 요청
      naver.maps.Service.geocode({ query: address }, (status, response) => {
        if (status !== naver.maps.Service.Status.OK) {
          console.error(`Geocoding failed for ${address}:`, status);
          return;
        }

        const result = response.v2.addresses[0];
        const latitude = parseFloat(result.y);
        const longitude = parseFloat(result.x);

        // 마커 생성
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(latitude, longitude),
          map,
          title: address,  // 제목은 해당 주소로 설정
        });

        // 마커 클릭 이벤트 추가
        naver.maps.Event.addListener(marker, 'click', () => {
          alert(`Marker clicked: ${address}`);
        });
      });
    }

    // 첫 번째 주소의 좌표로 지도 중앙을 설정
    if (addresses.length > 0) {
      const { address } = addresses[0];
      naver.maps.Service.geocode({ query: address }, (status, response) => {
        if (status === naver.maps.Service.Status.OK) {
          const result = response.v2.addresses[0];
          const latitude = parseFloat(result.y);
          const longitude = parseFloat(result.x);
          map.setCenter(new naver.maps.LatLng(latitude, longitude));
        }
      });
    }
  } catch (error) {
    console.error('Error initializing map:', error);
  }
}


onMounted(async () => {
  try {
    await loadNaverMapScript();  // 네이버 맵 스크립트 로드 대기
    const addresses = await fetchMarkerData();
    initializeMap(addresses);  // 데이터가 준비되면 지도 초기화
  } catch (error) {
    console.error('Error initializing map:', error);
  }
});

async function fetchMarkerData() {
  try {
    const response = await fetch(`${apiBase}/popup/${popupId}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    
    console.log("Fetched data:", data);  // 데이터를 출력하여 구조를 확인
    
    // 이제 data는 배열이 아닌 객체이므로, address만 추출해서 반환
    if (data && data.address) {
      return [data.address];  // 주소만 배열 형태로 반환
    } else {
      console.error('Data does not contain an address:', data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch marker data:', error);
    return [];
  }
}

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

  try {
    await loadNaverMapScript();
    const addressDetails = await fetchMarkerData();
    // 주소만 담긴 배열을 전달하여 지도 초기화
    initializeMap(addressDetails);
  } catch (error) {
    console.error('Error initializing map:', error);
  }
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
</script>

<template>
  <!-- popup -->
  <main class="popup__wrap">
    <!-- section 1 -->
    <section class="popup__info">

      <!-- /images-slider 파란선 -->
      <div class="popup-info__slider">
        <div class="popup-info__slides">
          <img class="popup-info__slide" src="/images/나가노마켓1.jpg" alt="/images #1">
          <img class="popup-info__slide" src="/images/나가노마켓2.jpg" alt="/images #2">
          <img class="popup-info__slide" src="/images/나가노마켓3.jpg" alt="/images #3">
          <img class="popup-info__slide" src="/images/나가노마켓4.jpg" alt="/images #4">
          <img class="popup-info__slide" src="/images/나가노마켓5.jpg" alt="/images #5">
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
    <section class="popup__description">
      <h1>팝업스토어 소개</h1>
      <p>
        나가노마켓 팝업스토어🐾
        <br>
        농담곰, 먼작귀 등으로 유명한 나가노마켓이 9월 용산에 뜬다!<br>
        <br>
        없어서 못 사는 굿즈들부터 귀여운 포토존까지 챙겨주겠지?😋<br>
        아직 구체적인 정보는 뜨지 않았지만 벌써부터 기대 뿜뿜!<br>
        <br>
        농담곰이 9월6일에 온다면, 나는 오늘부터 설렐 거야...💕<br>
        팝플리랑 같이 나가노마켓 정보 기다릴 팝플러 손!🙌<br>
        <br>
        자세한 정보가 뜨면 바로 달려올게~
      </p>
    </section>

    <!-- section 3 -->
    <section class="popup__addinfo">
      <h1>상세 정보</h1>
      <address class="popup__addinfo-address">
        <i class='bx bx-map-alt'></i>
        <span>{{popup?.address}}</span>
      </address>
      <address class="popup__addinfo-address-detail">
        <div>5</div>
        <span>{{popup?.addressDetail}}</span>
      </address>
      <div id="map" style="width:100%;height:400px;"></div>
      <div class="popup__hours">
        <span><i class='bx bx-time-five'></i>{{popup?.operationTime}}</span>
        <p>
          목 10:30 - 20:00<br>
          금 10:30 - 20:30<br>
          토 10:30 - 20:30<br>
          일 10:30 - 20:00<br>
          월 10:30 - 20:00<br>
          화 10:30 - 20:00<br>
          수 10:30 - 20:00<br>
          - 6F 식당가 영업시간 : 10:30 - 22:00
        </p>
      </div>
      <div class="popup-detail__sns">
        <a href="#" class="popup__sns-link">
          <i class='bx bxl-instagram'></i>
          <span>SNS 바로가기</span>
        </a>
        <a href="#" class="popup__sns-link">
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