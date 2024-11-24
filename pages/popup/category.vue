<template>
  <div class="popup_wrap">
    <!-- 검색 -->
    <div class="search-bar">
      <form @submit.prevent="submitSearch">
        <button type="submit" class="search-bar__submintbutton">
          <i class='bx bx-search search-bar__searchicon icon'></i>
        </button>
        <div class="search-bar__input-wrap search-bar__input-wrap--medium">
          <input type="text" v-model="searchQuery" placeholder="검색어를 입력해주세요.">
          <button type="reset" class="search-bar__clear" @click="clearSearch">
            <i class='bx bx-x icon'></i>
          </button>
        </div>
      </form>
    </div>

    <!-- 지역별 사진  -->
    <div class="region">
      <div class="region__container">
        <a v-for="region in regions" :key="region.id" :href="region.link" class="region__box"
          @click.prevent="selectRegion(region)">
          <div class="region__image-area">
            <img :src="region.image" :alt="region.name">
          </div>
          <div class="region__text-area">
            <p>{{ region.name }}</p>
          </div>
        </a>
      </div>
    </div>

    <hr>

    <!--제목, 버튼-->
    <div class="container">
      <div class="location">
        <div class="location__dropdown">
          <div class="location__dropdown-trigger" @click="toggleDropdown">
            <h2 class="location__title" id="locationTitle">{{ currentLocation }}</h2>
            <i class='bx bxs-chevron-down'></i>
          </div>
          <div class="location__dropdown-content" :class="{ 'location__dropdown-content--show': isDropdownOpen }">
            <a v-for="location in locations" :key="location.id" href="#" class="location__dropdown-item"
              @click.prevent="changeLocation(location)">
              {{ location.name }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- popup -->
    <div class="container">
      <div class="popup">
        <div class="popup__grid">
          <div v-for="(item, index) in popupItems" :key="item.id" class="popup__item">
            <img :src="item.filePath" :alt="`Popup ${index + 1}`">
            <div class="popup__infos">
              <span class="popup__status">{{ item.status }}</span>
              <h3 class="popup__title">{{ item.title }}</h3>
              <p class="popup__location">{{ item.address }}</p>
              <p class="popup__dates">
                <span>{{ formatDate(item.startDate) }}</span>
                <span>~</span>
                <span>{{ formatDate(item.endDate) }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import { useFetch } from '#app';

// 로케이션 드롭다운 관련 상태
const currentLocation = ref('더현대 서울'); // 선택된 location의 이름만 저장
const isDropdownOpen = ref(false);
const locations = ref([
  { id: 1, name: '더현대 서울' },
  { id: 2, name: '성수' },
  { id: 3, name: '마포/서대문/홍대' },
  { id: 4, name: '강남/송파' },
  { id: 5, name: '그 외 지역' },
]);

// 검색 상태
const searchQuery = ref('');

// 지역 정보와 초기 선택된 지역
const regions = ref([
  { id: 1, name: '패션', image: '/images/더현대.jpg', link: '' },
  { id: 2, name: '영화/드라마/애니', image: '/images/성수 디올.jpg', link: '' },
  { id: 3, name: '뷰티/코스메틱', image: '/images/홍대 무신사.jpg', link: '' },
  { id: 4, name: '굿즈/문구', image: '/images/강남역.jpg', link: '' },
  { id: 5, name: '푸드', image: '/images/부산.jpg', link: '' },
]);

const popupItems = ref([]); // 팝업 데이터를 저장할 변수
const selectedRegion = ref(regions.value[0]); // 기본 선택된 region
const selectedRegionId = ref(null); // 선택된 region의 id
const selectedLocationId = ref(null); // 선택된 location의 id

// API 호출 함수: regionId로 팝업 데이터 가져오기
const fetchPopupItems = async (regionId) => {
  try {
    const { data, error } = await useFetch('/api/v1/popup/category', {
      params: { categoryId: regionId },
      baseURL: 'http://localhost:8081',
    });

    if (error.value) {
      console.error('API 호출 에러:', error.value);
      return;
    }

    if (data.value) {
      popupItems.value = data.value; // 응답 데이터로 popupItems 업데이트
      console.log('Fetched popup items:', popupItems.value);
    }
  } catch (err) {
    console.error('예외 발생:', err);
  }
};

// locationId와 regionId로 데이터 가져오기
const fetchPopupItemsByLocation = async () => {
  if (!selectedRegionId.value || !selectedLocationId.value) {
    console.log('Region or Location not selected.');
    return;
  }

  const selectedLocationName = locations.value.find(
    (location) => location.id === selectedLocationId.value
  )?.name;

  if (!selectedLocationName) {
    console.log('Invalid location selected.');
    return;
  }

  try {
    const { data, error } = await useFetch('/api/v1/popup/category/region', {
      params: {
        categoryId: selectedLocationId.value,
        regionId: selectedRegionId.value,
        locationName: selectedLocationName,
      },
      baseURL: 'http://localhost:8081',
    });

    if (error.value) {
      console.error('API 호출 에러:', error.value);
      return;
    }

    if (data.value) {
      popupItems.value = data.value;
      console.log('Fetched popup items by region and location:', popupItems.value);
    }
  } catch (err) {
    console.error('예외 발생:', err);
  }
};

// 지역 선택 핸들러
const selectRegion = (region) => {
  selectedRegion.value = region;
  selectedRegionId.value = region.id;
  fetchPopupItems(region.id);
};

// 로케이션 드롭다운 변경 핸들러
const changeLocation = (location) => {
  currentLocation.value = location.name; // 이름만 설정
  isDropdownOpen.value = false; // 드롭다운 닫기
  selectedLocationId.value = location.id;
  fetchPopupItemsByLocation();
};

// 드롭다운 토글 핸들러
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// 검색 서브밋 핸들러
const submitSearch = () => {
  console.log('Searching for:', searchQuery.value);
};

// 기본 데이터 가져오기
watchEffect(() => {
  if (selectedRegion.value) {
    fetchPopupItems(selectedRegion.value.id);
  }
});

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');
};

onMounted(() => {
  window.addEventListener('resize', () => {
    updateDimensions();
    moveSlider(0);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions);
});
</script>

<style>
@import url('/public/css/popup/category.css');
</style>
