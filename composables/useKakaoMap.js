import { ref } from 'vue';
// import { useRuntimeConfig } from 'nuxt/app';

export function useKakaoMap() {
  // 환경변수에서 API KEY 가져오기
  // const config = useRuntimeConfig();
  // const kakaoMapApiKey = config.public.kakaoMapApiKey;

  // 카카오맵 관련 함수
  const kakaoMap = ref(null);
  const kakaoMarker = ref(null);

  // 카카오맵 초기화 (api키는 환경변수에서 직접 가져오지 않고 컴포넌트에서 전달받음 왜??)
  const initKakaoMap = (mapContainer, kakaoMapApiKey, address) => {
    if(!mapContainer) {
      console.error('kakao-map 지도 컨테이너 요소를 찾을 수 없습니다.');
      return;
    }

    try {
      // 지도 생성 옵션
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 중심 좌표
        level: 3                                              // 지도 확대 레벨
      };

      // 지도 생성
      kakaoMap.value = new kakao.maps.Map(mapContainer, options);

      // 마커 생성
      kakaoMarker.value = new kakao.maps.Marker({
        position: options.center,
        map: kakaoMap.value
      });

      // 주소가 있으면 해당 위치로 지도 이동
      if(address) {
        updateMapLocation(address);
      }
    } catch(e) {
      console.error('카카오맵 초기화 오류: ', e);
    }
  }

  // 주소로 지도 위치 업데이트
  const updateMapLocation = (address) => {
    if (!kakaoMap.value || !address) return;
  
    try {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          
          // 마커 위치 변경
          kakaoMarker.value.setPosition(coords);
          
          // 지도 중심 이동
          kakaoMap.value.setCenter(coords);
        }
      });
    } catch(e) {
      console.error('지도 위치 업데이트 오류: ', e);
    }
  }
  
  // 카카오맵 스크립트 로드
  const loadKakaoMapScript = (kakaoMapApiKey, callback) => {
    // 이미 로드된 경우 중복 로드 방지
    if(window.kakao && window.kakao.maps) {
      callback();
      return;
    }
  
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&libraries=services&autoload=false`;
    script.onload = () => {
      kakao.maps.load(callback);
    };

    document.head.appendChild(script);
  };

  return {
    kakaoMap,
    kakaoMarker,
    initKakaoMap,
    updateMapLocation,
    loadKakaoMapScript
  };
  
  // onMounted(() => {
  //   // 모달이 열릴 때 지도 초기화
  //   loadKakaoMapScript();
  // });
}