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

          <img :src="`http://localhost:8081/api/v1/uploads/images/concert/${concert.saveImageName}`"
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

  // 페이지 로드 시 올바른 주소로 지도 업데이트
  updateMapWithAddress("서울 구로구 경인로 662 7층", "디큐브 링크아트센터");
}

function updateMapWithAddress(address, name) {
  naver.maps.Service.geocode({
    query: address
  }, function(status, response) {
    if (status === naver.maps.Service.Status.ERROR) {
      return alert('주소 검색 중 오류가 발생했습니다.');
    }

    if (response.v2.meta.totalCount === 0) {
      return alert('검색 결과가 없습니다.');
    }

    const item = response.v2.addresses[0];
    const point = new naver.maps.LatLng(item.y, item.x);

    map.setCenter(point);
    marker.setPosition(point);

    const contentString = `
      <div class="iw_inner">
        <h3>${name}</h3>
        <p>${address}<br />
        위도: ${item.y}<br />
        경도: ${item.x}</p>
      </div>
    `;

    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });
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

<style scoped>
@import url('/public/css/concert/[id]/index.css');
</style>