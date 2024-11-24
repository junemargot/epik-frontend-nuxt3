<template>
  <div class="wrap" v-if="musical">
    <!-- section 1 -->
    <div class="musical">
      <div class="musical__header">
        <h1>{{ musical.title }}</h1>
        <div class="musical__icons">
          <div class="musical__icon">
            <a href="#">
              <i class='bx bx-bell'></i>
            </a>
            <span>알림받기</span>
          </div>
          <div class="musical__icon">
            <a href="#">
              <i class='bx bx-bookmark'></i>
            </a>
            <span>북마크</span>
          </div>
        </div>
      </div>

      <hr><!-- 회색선  -->

      <!-- 맨 위로 버튼 -->
      <button id="go-top" class="hidden">
        <i class='bx bx-chevron-up'></i> TOP
      </button>

      <!-- section 2 -->
      <main>
        <div class="musical__content">
          <img v-if="musical.saveImageName" :src="`http://localhost:8081/uploads/musical/${musical.saveIamgeName}`"
            alt="포스터이미지" />
          <div class="musical__info">
            <div class="musical__info-row">
              <p class="musical__info-label">장소</p>
              <p class="musical__info-value">{{ musical.venue }}</p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">공연시간</p>
              <p class="musical__info-value">{{ musical.runningTime }}</p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">공연기간</p>
              <p class="musical__info-value">
                {{ formatDate(musical.startDate) }} ~ {{ formatDate(musical.endDate) }}
              </p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">관람연령</p>
              <p class="musical__info-value">{{ musical.ageRestriction }}</p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">가격</p>
              <ul class="musical__price-list">
                <li v-for="price in musical.ticketPrices" :key="price.id">
                  <span class="musical__seat">{{ price.seat }}</span>
                  <span class="musical__price">{{ price.price }}</span>
                </li>
              </ul>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">예매처</p>
              <div class="musical__booking-links">
                <a :href="office.link" target="_blank" name="link" v-for="office in musical.ticketOffices"
                  :key="office.id">
                  {{ office.name }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr><!-- 회색선  -->

        <!-- section 3 -->
        <section class="musical__intro">
          <h2>뮤지컬 소개</h2>
          <div v-html="musical.content"></div>
          <div class="musical__video">
            <iframe id="youtube-video" :src="youtubeUrl" frameborder="0" allowfullscreen></iframe>
          </div>
          <div class="musical__schedule">
            <p v-for="schedule in schedules" :key="schedule">{{ schedule }}</p>
          </div>
          <div class="musical__images">
            <img v-for="(image, index) in images" :key="index" :src="image" :alt="`시카고 상세${index + 1}`"
              class="musical__image--long">
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

// 추가 
const route = useRoute();
const musicalId = route.params.id;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상태 관리 위한 ref 선언
const musical = ref(null);
const error = ref(null);

// 데이터 가져오기
watchEffect(async () => {
  const { data } = await useFetch(`/admin/musical/${musicalId}`, {
    baseURL: apiBase,
    key: `musical-${musicalId}`,
  });

  if (data.value) {
    musical.value = data.value;
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



const mapScript = ref(null);
let map = ref(null);
let marker = ref(null);

const locationInfo = ref({
  address: "서울 구로구 경인로 662 7층",
  name: "디큐브 링크아트센터"
});

const seats = ref([
  { type: 'VIP석', price: '160,000원' },
  { type: 'OP석', price: '150,000원' },
  { type: 'R석', price: '140,000원' },
  { type: 'S석', price: '110,000원' },
  { type: 'A석', price: '80,000원' }
]);


const youtubeUrl = ref('https://www.youtube.com/embed/OjeglNu9eVo');

const schedules = ref([
  '아티스트 선예매 코드 인증: 2024년 9월 23일 (월) 12:00PM ~ 2024년 9월 24일 (화) 4:59PM',
  '아티스트 선예매: 2024년 9월 24일 (화) 12:00PM ~ 4:59PM',
  '라이브네이션 선예매: 2024년 9월 25일 (수) 12:00PM ~ 4:59PM',
  '일반 예매: 2024년 9월 27일 (금) 12:00PM'
]);

const images = ref(['/images/시카고 상세1.jpg', '/images/시카고 상세2.jpg']);

const openingHours = ref(`
  목 10:30 - 20:00<br>
  금 10:30 - 20:30<br>
  토 10:30 - 20:30<br>
  일 10:30 - 20:00<br>
  월 10:30 - 20:00<br>
  화 10:30 - 20:00<br>
  수 10:30 - 20:00<br>
  - 6F 식당가 영업시간 : 10:30 - 22:00
`);

const snsLinks = ref([
  { name: 'SNS 바로가기', url: '#', icon: 'fa-brands fa-instagram' },
  { name: '브랜드 홈페이지 바로가기', url: '#', icon: 'fa-solid fa-earth-americas' }
]);

function initMap() {
  return new Promise((resolve) => {
    if (window.naver && window.naver.maps) {
      const mapElement = document.getElementById('map');
      const mapOptions = {
        zoom: 15,
        minZoom: 8,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT
        }
      };

      map.value = new window.naver.maps.Map(mapElement, mapOptions);
      resolve();
    }
  });
}

function updateMapWithAddress(address, name) {
  return new Promise((resolve) => {
    window.naver.maps.Service.geocode({
      query: address
    }, function (status, response) {
      if (status === window.naver.maps.Service.Status.ERROR) {
        alert('주소 검색 중 오류가 발생했습니다.');
        return resolve();
      }

      if (response.v2.meta.totalCount === 0) {
        alert('검색 결과가 없습니다.');
        return resolve();
      }

      var item = response.v2.addresses[0];
      var point = new window.naver.maps.LatLng(item.y, item.x);

      map.value.setCenter(point);

      if (marker.value) {
        marker.value.setMap(null);
      }

      marker.value = new window.naver.maps.Marker({
        position: point,
        map: map.value
      });

      var infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:10px;"><strong>${name}</strong><br>${address}</div>`
      });
      infoWindow.open(map.value, marker.value);

      // 위치 저장
      localStorage.setItem('mapCenter', JSON.stringify({ lat: item.y, lng: item.x }));

      resolve();
    });
  });
}

async function loadMap() {
  await initMap();
  const savedLocation = JSON.parse(localStorage.getItem('mapCenter'));
  if (savedLocation) {
    const point = new window.naver.maps.LatLng(savedLocation.lat, savedLocation.lng);
    map.value.setCenter(point);
    marker.value = new window.naver.maps.Marker({
      position: point,
      map: map.value
    });
  } else {
    await updateMapWithAddress(locationInfo.value.address, locationInfo.value.name);
  }
}

onMounted(() => {
  mapScript.value = document.createElement('script');
  mapScript.value.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=yvwezi7lts&submodules=geocoder`;
  mapScript.value.async = true;
  mapScript.value.onload = loadMap;
  document.head.appendChild(mapScript.value);
});

onUnmounted(() => {
  if (mapScript.value) {
    document.head.removeChild(mapScript.value);
  }
});
</script>

<style lang="css" scoped>
@import url('/public/css/musical/[id]/index.css');
</style>