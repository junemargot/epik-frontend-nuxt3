<template>
  <div class="venue-modal" v-if="isOpen">
    <div class="venue-modal__overlay" @click="$emit=('close')"></div>
    <div class="venue-modal__content">
      <div class="venue-modal__header">
        <h2>공연장 정보</h2>
        <button class="venue-modal__close" @click="$emit('close')">
          <i class='bx bx-x'></i>
        </button>
      </div>
      <div class="venue-modal__body">
        <div class="venue-modal__address">
          <i class="bx bx-map"></i>
          <span>{{ address }}</span>
        </div>
        <div id="kakao-map" class="venue-modal__map" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';

const props = defineProps({
  isOpen: Boolean,
  venue: String,
  address: String
});

defineEmits(['close']);

// 환경 변수에서 API 키 가져오기
const config = useRuntimeConfig();
const kakaoMapApiKey = config.public.kakaoMapApiKey;

// 카카오맵 관련 함수
let kakaoMap;
let kakaoMarker;

// 카카오맵 초기화
function initKakaoMap() {
  const container = document.getElementById('kakao-map');
  
  if(!container) {
    console.error('kakao-map 요소를 찾을 수 없습니다.');
    return;
  }
  
  try {
    // 지도 생성 옵션
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 중심 좌표
      level: 3 // 지도 확대 레벨
    };

    // 지도 생성
    kakaoMap = new kakao.maps.Map(container, options);

    // 마커 생성
    kakaoMarker = new kakao.maps.Marker({
      position: options.center,
      map: kakaoMap
    });

    // 주소가 있으면 해당 위치로 지도 이동
    if (props.address) { // props의 address 사용
      updateMapLocation(props.address);
    }
  } catch(e) {
    console.error('카카오맵 초기화 오류: ', e);
  }
}

// 주소로 지도 위치 업데이트
function updateMapLocation(address) {
  if (!kakaoMap || !address) return;

  try {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        
        // 마커 위치 변경
        kakaoMarker.setPosition(coords);
        
        // 지도 중심 이동
        kakaoMap.setCenter(coords);
      }
    });
  } catch(e) {
    console.error('지도 위치 업데이트 오류: ', e);
  }
}

// 카카오맵 스크립트 로드
function loadKakaoMapScript() {
  // 이미 로드된 경우 중복 로드 방지
  if(window.kakao && window.kakao.maps) {
    initKakaoMap();
    return;
  }

  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&libraries=services&autoload=false`;
  script.onload = () => {
    kakao.maps.load(() => {
      initKakaoMap();
    });
  };
  
  document.head.appendChild(script);
}

onMounted(() => {
  // 모달이 열릴 때 지도 초기화
  nextTick(() => {
    loadKakaoMapScript();
  })
});

</script>

<style scoped>
.venue-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.venue-modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.venue-modal__content {
  position: relative;
  width: 90%;
  max-width: 700px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  overflow: hidden;
}

.venue-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.venue-modal__header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.venue-modal__close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.venue-modal__body {
  padding: 20px;
}

.venue-modal__address {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
}

.venue-modal__address i {
  margin-right: 5px;
  color: var(--black);
}

.venue-modal__map {
  width: 100%;
  height: 400px;
  border-radius: 4px;
  overflow: hidden;
}
</style>