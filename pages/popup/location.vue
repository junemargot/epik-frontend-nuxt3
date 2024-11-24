<template>
  <div class="container">
    <!-- 위치기반 -->
    <div id="map-container">
      <div id="map" style="width:960px;height:533px;">
        <div id="search-container">
          <input id="search-input" type="text" placeholder="팝업 또는 지역을 검색해주세요." v-model="searchQuery">
          <button id="search-button" @click="searchAddress">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <button id="current-location-button" @click="moveToCurrentLocation">
          <i class="fas fa-crosshairs"></i>
        </button>
      </div>
    </div>

    <!-- popup -->
    <div class="popup">
        <div class="popup__header">
          <h2>주변 팝업 리스트</h2>
          <hr class="popup__header-divider">
        </div>
        <div class="popup__grid">
          <div v-for="(popupRow, index) in popups" :key="index">
            <div class="popup__row">
              <div class="popup__item" v-for="(item, idx) in popupRow" :key="idx">
                <img :src="item.image" :alt="item.alt">
                <div class="popup__info-list">
                  <p class="popup__p">팝업 스토어</p>
                  <span class="popup__badges">{{ item.status }}</span>
                  <h3>{{ item.title }}</h3>
                  <p class="popup__date">{{ item.date }}</p>
                  <p class="popup__locations">{{ item.location }}</p>
                  <p class="popup__distance">{{ item.distance }}</p>
                </div>
              </div>
            </div>
            <!-- 각 두 개의 팝업 행 뒤에 구분선을 추가 -->
            <hr class="popup__divider" v-if="index !== popups.length - 1">
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const mapScript = ref(null);

const popups = ref([
  [
    {
      image: '/images/노들섬.png',
      alt: 'Popup 1',
      status: '진행중',
      title: '노들섬 재즈 페스티벌 2024 공식티켓',
      date: '24.06.13-07.31',
      location: '부산광역시 부산지구',
      distance: '1.17km'
    },
    {
      image: '/images/걱정도 팔자.png',
      alt: 'Popup 2',
      status: '진행중',
      title: '최고심 홍대플래그십 팝업스토어',
      date: '24.08.02-09.12',
      location: '서울특별시 마포구',
      distance: '1.17km'
    }
  ],
  [
    {
      image: '/images/망그러진곰.png',
      alt: 'Popup 3',
      status: '진행중',
      title: '망그러진 곰과 비밀의 다락방 팝업스토어',
      date: '24.07.25-08.07',
      location: '서울특별시 영등포구',
      distance: '1.17km'
    },
    {
      image: '/images/나가노마켓1.jpg',
      alt: 'Popup 4',
      status: '진행중',
      title: '나가노마켓 팝업스토어',
      date: '24.09.06-09.20',
      location: '서울특별시 용산구',
      distance: '1.17km'
    }
  ],
  [
    {
      image: '/images/나가노마켓2.jpg',
      alt: 'Popup 5',
      status: '진행중',
      title: '나가노마켓 팝업스토어',
      date: '24.09.06-09.20',
      location: '서울특별시 용산구',
      distance: '1.17km'
    },
    {
      image: '/images/나가노마켓3.jpg',
      alt: 'Popup 6',
      status: '진행중',
      title: '나가노마켓 팝업스토어',
      date: '24.09.06-09.20',
      location: '서울특별시 용산구',
      distance: '1.17km'
    }
  ]
]);

let map;
let marker;
const searchQuery = ref('');

function initMap() {
  if (window.naver && window.naver.maps) {
    map = new window.naver.maps.Map('map', {
      center: new window.naver.maps.LatLng(37.5665, 126.9780),
      zoom: 15
    });
  }
}

onMounted(() => {
  mapScript.value = document.createElement('script');
  mapScript.value.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=yvwezi7lts`;
  mapScript.value.async = true;
  mapScript.value.onload = initMap;
  document.head.appendChild(mapScript.value);
});

onUnmounted(() => {
  if (mapScript.value) {
    document.head.removeChild(mapScript.value);
  }
});

function searchAddress() {
  naver.maps.Service.geocode({
    query: searchQuery.value
  }, function(status, response) {
    if (status === window.naver.maps.Service.Status.ERROR) {
      alert('주소를 찾을 수 없습니다.');
      return;
    }
    if (response.v2.meta.totalCount === 0) {
      alert('검색 결과가 없습니다.');
      return;
    }
    const item = response.v2.addresses[0];
    const point = new window.naver.maps.Point(item.x, item.y);
    map.setCenter(point);
    updateMarker(point);
  });
}

function moveToCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const latlng = new window.naver.maps.LatLng(lat, lng);
      map.setCenter(latlng);
      updateMarker(latlng);
    }, function() {
      alert('위치 정보를 가져올 수 없습니다.');
    });
  } else {
    alert('이 브라우저에서는 위치 서비스를 지원하지 않습니다.');
  }
}

function updateMarker(position) {
  if (!marker) {
    marker = new naver.maps.Marker({
      position: position,
      map: map
    });
  } else {
    marker.setPosition(position);
  }
}



</script>

<style scoped>
@import url('/public/css/popup/location.css');
</style>