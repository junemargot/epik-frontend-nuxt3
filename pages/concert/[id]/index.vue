<template>
  <div class="wrap" v-if="concert">
    <!-- section 1 -->
    <div class="musical">
      <div class="musical__header">
        <h1>{{ concert.title }}</h1>
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

      <div style="border-bottom: 1px solid #222;"></div>
      <!-- 회색선  -->
      <!-- <hr> -->

      <!-- 맨 위로 버튼 -->
      <button id="go-top" class="hidden">
        <i class='bx bx-chevron-up'></i> TOP
      </button>

      <!-- section 2 -->
      <main>
        <div class="musical__content">
          <img :src="`http://localhost:8081/uploads/images/concert/${concert.saveImageName}`"
            :alt="concert.title + ' 포스터'">

          <!-- <img src="/public/images/concert/yuuri.png" />  -->
          <div class="musical__info">
            <div class="musical__info-row">
              <p class="musical__info-label">장소</p>
              <p class="musical__info-value">{{ concert.venue }}</p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">공연시간</p>
              <p class="musical__info-value">{{ concert.runningTime }}</p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">공연기간</p>
              <p class="musical__info-value">
                {{ formatDate(concert.startDate) }} ~ {{ formatDate(concert.endDate) }}
              </p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">관람연령</p>
              <p class="musical__info-value">{{ concert.ageRestriction }}</p>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">가격</p>
              <ul class="musical__price-list">
                <li v-for="price in concert.ticketPrices" :key="price.id">
                  <span class="musical__seat">{{ price.seat }}</span>
                  <span class="musical__price">{{ price.price }}</span>
                </li>
              </ul>
            </div>
            <div class="musical__info-row">
              <p class="musical__info-label">예매처</p>
              <div class="musical__booking-links">
                <a :href="office.link" target="_blank" name="link" v-for="office in concert.ticketOffices"
                  :key="office.id">
                  {{ office.name }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 회색선  -->
        <hr>
        <!-- section 3 -->
        <section class="musical__intro">
          <h2>콘서트 소개</h2>
          <div v-html="concert.content"></div>
          <div class="musical__video" v-if="concert.youtubeUrl">
            <iframe id="youtube-video" :src="concert.youtubeUrl" frameborder="0" allowfullscreen></iframe>
          </div>
          <div class="musical__schedule"></div>
          <div class="musical__images">
            <img v-for="(image, index) in images" :key="index" :src="image" :alt="`콜드플레이 상세${index + 1}`"
              class="musical__image--long">
          </div>
        </section>
        <hr class="musical__divider"> <!-- 회색선 -->

        <!-- section 4 -->
        <section class="musical__addinfo">
          <h1>공연장 정보</h1>
          <div class="musical__addinfo-address">
            <i class='bx bx-map'></i>
            <span>{{ concert.address }}</span>
          </div>
          <div id="map" style="width:100%;height:400px;"></div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const concertId = route.params.id;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상태 관리 위한 ref 선언
const concert = ref(null);
const error = ref(null);

// 데이터 가져오기
watchEffect(async () => {
  const { data } = await useFetch(`/admin/concert/${concertId}`, {
    baseURL: apiBase,
    key: `concert-${concertId}`,
  });

  if (data.value) {
    concert.value = data.value;
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

onMounted(async () => {
  // await fetchConcertDetail();
});

const mapScript = ref(null);
let map = ref(null);
let marker = ref(null);

// const locationInfo = ref({
//   address: "경기도 고양시 일산서구 중앙로 1601",
//   name: "고양종합운동장"
// });

// const youtubeUrl = ref('https://www.youtube.com/embed/OjeglNu9eVo');

function initMap() {
  return new Promise((resolve) => {
    if (window.naver && window.naver.maps) {
      const mapElement = document.getElementById('map');
      const mapOptions = {
        zoom: 15,
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
  console.log('Updating map with address:', address);
  return new Promise((resolve) => {
    window.naver.maps.Service.geocode({
      query: address
    }, function (status, response) {
      if (status === window.naver.maps.Service.Status.ERROR) {
        console.error('주소 검색 중 오류가 발생했습니다.');
        return resolve();
      }

      if (response.v2.meta.totalCount === 0) {
        console.warn('검색 결과가 없습니다.');
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
      localStorage.setItem('mapCenter', JSON.stringify({ lat: item.y, lng: item.x, address, name }));

      console.log('Map updated successfully');
      resolve();
    });
  });
}

async function loadMap() {
  console.log('Loading map...');
  await initMap();
  console.log('Map initialized');

  // 항상 locationInfo의 주소를 사용하도록 수정
  await updateMapWithAddress(locationInfo.value.address, locationInfo.value.name);

  console.log('Map loading complete');
}

onMounted(() => {
  console.log('Mounting component...');
  mapScript.value = document.createElement('script');
  mapScript.value.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=yvwezi7lts&submodules=geocoder`;
  mapScript.value.async = true;
  mapScript.value.onload = () => {
    console.log('Naver Maps script loaded');
    loadMap();
  };
  document.head.appendChild(mapScript.value);
});


onUnmounted(() => {
  if (mapScript.value) {
    document.head.removeChild(mapScript.value);
  }
});
</script>

<style scoped>
@import url('/public/css/concert/[id]/index.css');
</style>