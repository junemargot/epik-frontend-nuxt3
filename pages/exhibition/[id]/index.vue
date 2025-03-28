<template>
  <div class="wrap" v-if="exhibition">
    <!-- section 1 -->
    <div class="musical">
      <div class="musical__header">
        <h1>{{ exhibition.title }}</h1>
        <div class="musical__icons">
          <div class="musical__icon">
            <a href="#">
              <i class="fa-regular fa-bell"></i>
            </a>
            <span>알림받기</span>
          </div>
          <div class="musical__icon">
            <a href="#">
              <i class="fa-regular fa-bookmark"></i>
            </a>
            <span>북마크</span>
          </div>
        </div>
      </div>

      <hr><!-- 회색선  -->

      <!-- 맨 위로 버튼 -->
      <button id="go-top" class="hidden">
        <i class="fas fa-arrow-up"></i> TOP
      </button>

      <!-- section 2 -->
      <main>
        <div class="musical__content">
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
        </div>

        <hr><!-- 회색선  -->

        <!-- section 3 -->
        <section class="musical__intro">
          <h2>뮤지컬 소개</h2>
          <div v-html="exhibition.content"></div>
          <div class="exhibition__video" v-if="exhibition.youtubeUrl">
            <iframe id="youtube-video" :src="youtubeUrl" frameborder="0" allowfullscreen></iframe>
          </div>
          <div class="musical__schedule"></div>
          <div class="musical__images">
            <img v-for="(image, index) in images" :key="index" :src="image" :alt="`${index + 1}`" />
          </div>
        </section>
        <hr class="musical__divider"> <!-- 회색선 -->

        <!-- section 4 -->
        <section class="musical__addinfo">
          <h1>공연장 정보</h1>
          <address class="musical__addinfo-address">
            <i class="bx bx-map"></i>
            <span>{{ exhibition.address }}</span>
          </address>
          <div id="map" style="width:100%;height:400px;"></div>
          <!-- <div class="musical__hours">
            <span> <i class="fa-regular fa-clock"></i>매일 10:30에 영업 시작</span>
            <p v-html="openingHours"></p>
          </div>
          <div class="musical-detail__sns">
            <a v-for="link in snsLinks" :key="link.name" :href="link.url" class="musical__sns-link">
              <i :class="link.icon"></i>
              <span>{{ link.name }}</span>
            </a>
          </div> -->
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const exhibitionId = route.params.id;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상대 관리 위한 ref 선언
const exhibition = ref(null);
const error = ref(null);

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


// const mapScript = ref(null);
// let map;
// let marker;

// const locationInfo = ref({
//   address: "서울 구로구 경인로 662 7층",
//   name: "디큐브 링크아트센터"
// });

// const seats = ref([
//   { type: 'VIP석', price: '160,000원' },
//   { type: 'OP석', price: '150,000원' },
//   { type: 'R석', price: '140,000원' },
//   { type: 'S석', price: '110,000원' },
//   { type: 'A석', price: '80,000원' }
// ]);

// const bookingLinks = ref(['인터파크티켓', '티켓링크']);

// const youtubeUrl = ref('https://www.youtube.com/embed/OjeglNu9eVo');

// const schedules = ref([
//   '아티스트 선예매 코드 인증: 2024년 9월 23일 (월) 12:00PM ~ 2024년 9월 24일 (화) 4:59PM',
//   '아티스트 선예매: 2024년 9월 24일 (화) 12:00PM ~ 4:59PM',
//   '라이브네이션 선예매: 2024년 9월 25일 (수) 12:00PM ~ 4:59PM',
//   '일반 예매: 2024년 9월 27일 (금) 12:00PM'
// ]);

// const images = ref(['/images/시카고 상세1.jpg', '/images/시카고 상세2.jpg']);

// const openingHours = ref(`
//   목 10:30 - 20:00<br>
//   금 10:30 - 20:30<br>
//   토 10:30 - 20:30<br>
//   일 10:30 - 20:00<br>
//   월 10:30 - 20:00<br>
//   화 10:30 - 20:00<br>
//   수 10:30 - 20:00<br>
//   - 6F 식당가 영업시간 : 10:30 - 22:00
// `);

// const snsLinks = ref([
//   { name: 'SNS 바로가기', url: '#', icon: 'fa-brands fa-instagram' },
//   { name: '브랜드 홈페이지 바로가기', url: '#', icon: 'fa-solid fa-earth-americas' }
// ]);

// function initMap() {
//   if (window.naver && window.naver.maps) {
//     const mapElement = document.getElementById('map');
//     const mapOptions = {
//       center: new window.naver.maps.LatLng(37.5665, 126.9780),
//       zoom: 15,
//       minZoom: 8,
//       zoomControl: true,
//       zoomControlOptions: {
//         position: window.naver.maps.Position.TOP_RIGHT
//       }
//     };
    
//     map = new window.naver.maps.Map(mapElement, mapOptions);

//     marker = new window.naver.maps.Marker({
//       position: map.getCenter(),
//       map: map
//     });

//     updateMapWithAddress(locationInfo.value.address, locationInfo.value.name);
//   }
// }

// function updateMapWithAddress(address, name) {
//   window.naver.maps.Service.geocode({
//     query: address
//   }, function(status, response) {
//     if (status === window.naver.maps.Service.Status.ERROR) {
//       return alert('주소 검색 중 오류가 발생했습니다.');
//     }

//     if (response.v2.meta.totalCount === 0) {
//       return alert('검색 결과가 없습니다.');
//     }

//     var item = response.v2.addresses[0];
//     var point = new window.naver.maps.Point(item.x, item.y);

//     map.setCenter(point);
//     marker.setPosition(point);
//   });
// }

// onMounted(() => {
//   mapScript.value = document.createElement('script');
//   mapScript.value.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=yvwezi7lts&submodules=geocoder`;
//   mapScript.value.async = true;
//   mapScript.value.onload = initMap;
//   document.head.appendChild(mapScript.value);
// });

// onUnmounted(() => {
//   if (mapScript.value) {
//     document.head.removeChild(mapScript.value);
//   }
// });
</script>

<style scoped>
@import url('/public/css/musical/[id]/index.css');
</style>