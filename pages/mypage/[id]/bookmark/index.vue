<template>
  <div class="bookmark" @click="handleOutsideClick">
    <div class="bookmark__header">
      <div class="bookmark__title-container">
        <h1 class="bookmark__heading">BOOKMARK</h1>
        <form class="feed__form">
          <input class="feed__input" id="feed-search" type="text" placeholder="검색어를 입력해주세요">
          <label for="feed-search">
            <i class="fa-solid fa-magnifying-glass"></i>
          </label>
          <input type="submit" value="submit" style="display: none;">
        </form>
      </div>
      <hr class="bookmark__divider">
      <ul class="bookmark__nav">
        <li class="bookmark__nav-item" v-for="section in sections" :key="section"
          :class="{ 'active': currentSection === section }">
          <a href="#" @click.prevent="currentSection = section" :class="{ 'active': currentSection === section }">{{
            section }}
          </a>
        </li>
      </ul>
      <hr class="bookmark__divider">
    </div>

    <div class="bookmark__content">
      <div class="bookmark__edit-container">
        <div class="bookmark__edit" v-if="!editMode" @click.stop="toggleEditMode">편집</div>
        <div class="bookmark__edit-options" v-else>
          <span class="bookmark__select-all" @click="selectAll">전체선택</span> |
          <span class="bookmark__remove" @click="showDeleteConfirmation">삭제</span>
        </div>
      </div>

      <div v-if="isLoading">데이터 로딩 중...</div>
      <div v-else>
        <div class="bookmark__popup" v-for="section in (currentSection === 'All' ? sections.slice(1) : [currentSection])"
          :key="section">
          <div class="bookmark__section">
            <div class="bookmark__header-container">
              <h2>{{ section }}</h2>
            </div>
            <div class="bookmark__grid">
              <div class="bookmark__item" v-for="(item, index) in getSectionItems(section)" :key="index"
                @click="toggleItemSelection(item)">
                <div class="bookmark__image-container">
                  <img :src="getImageUrl(item.saveImageName)" :alt="item.title">
                  <span class="bookmark__status">진행중</span>
                </div>
                <div class="bookmark__info">
                  <h3>{{ item.title }}</h3>
                  <div class="bookmark__location-date">
                    <div class="bookmark__text-container">
                      <p class="bookmark__location">{{ item.venue }}</p>
                      <p class="bookmark__date">
                        <span>{{ formatDate(item.startDate) }}</span>
                        <span>~</span>
                        <span>{{ formatDate(item.endDate) }}</span>
                      </p>
                    </div>
                    <div class="bookmark__checkbox-container" v-if="editMode">
                      <input type="checkbox" class="bookmark__checkbox" v-model="item.selected" @click.stop>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <Modal v-model="showDeleteModal">
        <div class="delete-confirmation">
          <h2>삭제 확인</h2>
          <p>선택한 항목을 정말 삭제하시겠습니까?</p>
          <div class="modal-buttons">
            <button @click="confirmDelete">확인</button>
            <button @click="cancelDelete">취소</button>
          </div>
        </div>
      </Modal> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const musicalId = route.params.id; // URL에서 id를 가져옴

// 편집 모드 상태
const editMode = ref(false);

// 섹션 목록
const sections = ['All', 'Popup', 'Concert', 'Musical', 'Exhibition'];
const currentSection = ref('All');

// 각 섹션의 아이템들을 ref로 초기화
// const popupItems = ref([]);
// const concertItems = ref([]);
const musicalItems = ref([]);
// const exhibitionItems = ref([]);

// Pop-up 데이터 가져오기
const fetchMusicalItems = async () => {
  try {
    const url = `member/musical/${musicalId}/bookmark`;
    console.log('완성된 URL:', `http://localhost:8081${url}`);
    
    const { data: musicalData, error: musicalError } = await useFetch(url, {
      baseURL: 'http://localhost:8081',
      key: `musical-${musicalId}`,
      headers: {
        'Content-Type': 'application/json',
      },
      onResponseError({ response }) {
        console.error('Response error:', response);
      },
    });

    console.log('API 응답 데이터:', musicalData.value);
    console.log('API 응답 에러:', musicalError.value);

    if (musicalError.value) {
      console.error('Musical API 호출 에러:', musicalError.value);
    } else if (musicalData.value) {
      console.log('받은 데이터:', musicalData.value);
      musicalItems.value = musicalData.value;
      console.log('musicalItems에 데이터 할당됨:', musicalItems.value);
    } else {
      console.log('musicalData가 없음');
    }
  } catch (error) {
    console.error('API 호출 중 예외 발생:', error);
  }
};

const isLoading = ref(true);

const fetchAllData = async () => {
  isLoading.value = true;
  await fetchMusicalItems();
  isLoading.value = false;
};

// const fetchPopupItems = async () => {
//   const url = `/api/v1/member/popup/${popupId}/bookmark`;
//   console.log('완성된 URL:', `http://localhost:8081${url}`);
//   const { data: popupData, error: popupError } = await useFetch(url, {
//     baseURL: 'http://localhost:8081',
//     key: `popup-${popupId}`
// });

//   console.log('API 응답 받음:', popupData.value);
//   if (popupError.value) {
//     console.error('Pop-up API 호출 에러:', popupError.value);
//   } else if (popupData.value) {
//     console.log('받은 데이터:', popupData.value);
//     popupItems.value = (Array.isArray(popupData.value) ? popupData.value : [popupData.value]).slice(0, 4);
//     console.log('popUpItems에 데이터 할당됨:', popupItems.value);
//   } else {
//     console.log('popupData.value가 없음');
//   }
// };


// Concert 데이터 가져오기
// const fetchConcertItems = async () => {
//   const { data: concertData, error: concertError } = await useFetch(`/api/v1/member/concert/${id}/bookmark`, {
//     baseURL: 'http://localhost:8080',
//   })

//   if (concertError.value) {
//     console.error('Concert API 호출 에러:', concertError.value)
//   } else if (concertData.value) {
//     concertItems.value = (Array.isArray(concertData.value) ? concertData.value : [concertData.value]).slice(0, 4)
//     console.log('Fetched concert items:', concertItems.value)
//   }
// }

// Musical 데이터 가져오기
// const fetchMusicalItems = async () => {
//   const { data: musicalData, error: musicalError } = await useFetch(`/api/v1/member/musical/${id}/bookmark`, {
//     baseURL: 'http://localhost:8080',
//   })

//   if (musicalError.value) {
//     console.error('Musical API 호출 에러:', musicalError.value)
//   } else if (musicalData.value) {
//     musicalItems.value = (Array.isArray(musicalData.value) ? musicalData.value : [musicalData.value]).slice(0, 4)
//     console.log('Fetched musical items:', musicalItems.value)
//   }
// }

// Exhibition 데이터 가져오기
// const fetchExhibitionItems = async () => {
//   const { data: exhibitionData, error: exhibitionError } = await useFetch(`/api/v1/member/exhibition/${id}/bookmark`, {
//     baseURL: 'http://localhost:8080',
//   })

//   if (exhibitionError.value) {
//     console.error('Exhibition API 호출 에러:', exhibitionError.value)
//   } else if (exhibitionData.value) {
//     exhibitionItems.value = (Array.isArray(exhibitionData.value) ? exhibitionData.value : [exhibitionData.value]).slice(0, 4)
//     console.log('Fetched exhibition items:', exhibitionItems.value)
//   }
// }

// // 모든 데이터 가져오기
// const fetchAllData = async () => {
//   console.log('fetchAllData 함수 시작');
//   await Promise.all([
//     fetchPopupItems(),
//     // fetchConcertItems(),
//     // fetchMusicalItems(),
//     // fetchExhibitionItems()
//   ])
//   console.log('모든 데이터 fetch 완료');
// }

// 컴포넌트가 마운트되면 데이터 가져오기
onMounted(async () => {
  console.log('컴포넌트 마운트됨, fetchAllData 호출');
  await fetchAllData();
  console.log('데이터 로딩 완료');
});

// getSectionItems 함수 수정
const getSectionItems = (section) => {
  console.log(`getSectionItems 호출됨, 섹션: ${section}`);
  let items;
  switch (section) {
    // case 'Pop-up':
    //   items = popupItems.value;
    //   break;
    // case 'Concert':
    //   items = concertItems.value;
    //   break;
    case 'Musical':
      items = musicalItems.value;
      break;
    // case 'Exhibition':
    //   items = exhibitionItems.value;
      // break;
    default:
      items = [];
  }
  
  console.log(`${section} 섹션 아이템:`, items);
  return items;
}

// 편집 모드 토글
// const toggleEditMode = (event) => {
//   if (event) event.stopPropagation(); // 이벤트 전파 중지
//   editMode.value = !editMode.value;
//   document.body.classList.toggle('editing', editMode.value);
//   if (!editMode.value) {
    // 편집 모드 해제 시 모든 선택 해제
//     [popUpItems, concertItems, musicalItems, exhibitionItems].forEach(items => {
//       items.value.forEach(item => item.selected = false);
//     });
//   }
// };

// 전체 선택
// const selectAll = () => {
//   if (currentSection.value === 'All') {
//     [popUpItems, concertItems, musicalItems, exhibitionItems].forEach(items => {
//       items.value.forEach(item => item.selected = true);
//     });
//   } else {
//     const currentItems = getSectionItems(currentSection.value);
//     currentItems.forEach(item => item.selected = true);
//   }
// };

// 선택된 항목 삭제
// const removeSelected = () => {
//   const currentItems = getSectionItems(currentSection.value);
//   const updatedItems = currentItems.filter(item => !item.selected);

//   switch (currentSection.value) {
//     case 'Pop-up':
//       popUpItems.value = updatedItems;
//       break;
//     case 'Concert':
//       concertItems.value = updatedItems;
//       break;
//     case 'Musical':
//       musicalItems.value = updatedItems;
//       break;
//     case 'Exhibition':
//       exhibitionItems.value = updatedItems;
//       break;
//     case 'All':
//       // 'All' 섹션에서는 모든 섹션의 선택된 아이템을 제거
//       popUpItems.value = popUpItems.value.filter(item => !item.selected);
//       concertItems.value = concertItems.value.filter(item => !item.selected);
//       musicalItems.value = musicalItems.value.filter(item => !item.selected);
//       exhibitionItems.value = exhibitionItems.value.filter(item => !item.selected);
//       break;
//   }
//   showDeleteModal.value = false; // 모달 닫기
// };


// // 모달 관련 코드 추가
// // 삭제 확인 모달 관련 상태
// const showDeleteModal = ref(false);

// // 삭제 확인 모달 표시
// const showDeleteConfirmation = () => {
//   showDeleteModal.value = true;
// };

// // 삭제 확인
// const confirmDelete = () => {
//   removeSelected();
//   showDeleteModal.value = false;
// };

// // 삭제 취소
// const cancelDelete = () => {
//   showDeleteModal.value = false;
// };

// // 아이템 선택 토글
// const toggleItemSelection = (item) => {
//   if (editMode.value) {
//     item.selected = !item.selected;
//   }
// };

// //편집모드 해제 코드
// // 마지막 클릭 시간을 저장할 변수
// const lastClickTime = ref(0);

// // 편집 모드 외부 클릭 처리
// const handleOutsideClick = (event) => {
//   if (!editMode.value) return; // 편집 모드가 아니면 무시

//   // 편집 옵션 영역과 아이템 클릭 무시
//   if (event.target.closest('.bookmark__edit-container') || event.target.closest('.bookmark__item')) return;

//   const currentTime = new Date().getTime();
//   if (currentTime - lastClickTime.value < 300) { // 300ms 이내의 더블 클릭
//     toggleEditMode();
//   }
//   lastClickTime.value = currentTime;
// };

// // 이벤트 리스너 추가 및 제거
// onMounted(() => {
//   setTimeout(() => {
//     document.addEventListener('click', handleOutsideClick);
//   }, 1);
// });

// onUnmounted(() => {
//   document.removeEventListener('click', handleOutsideClick);
// });

</script>

<style scoped>
@import url('/public/css/mypage/bookmark.css');
</style>