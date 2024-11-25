<template>
  <div class="bookmark" @click="handleOutsideClick">
    <div class="bookmark__header">
      <div class="bookmark__title-container">
        <h1 class="bookmark__heading">NOTIFICATION</h1>
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
        <a href="#" @click.prevent="currentSection = section"
          :class="{ 'active': currentSection === section }">{{ section }}
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

      <div class="bookmark__popup" v-for="section in (currentSection === 'All' ? sections.slice(1) : [currentSection])" :key="section">
        <div class="bookmark__section">
          <div class="bookmark__header-container">
            <h2>{{ section }}</h2>
          </div>
          <div class="bookmark__grid">
            <div class="bookmark__item" v-for="(item, index) in getSectionItems(section)" :key="index" @click="toggleItemSelection(item)">
              <div class="bookmark__image-container">
                <img :src="item.image" :alt="item.title">
                <span class="bookmark__status">{{ item.status }}</span>
              </div>
              <div class="bookmark__info">
                <h3>{{ item.title }}</h3>
                <div class="bookmark__location-date">
                  <div class="bookmark__text-container">
                    <p class="bookmark__location">{{ item.location }}</p>
                    <p class="bookmark__date">{{ item.date }}</p>
                  </div>
                  <!-- <input type="checkbox" class="bookmark__checkbox" v-if="editMode" v-model="item.selected"> -->
                  <div class="bookmark__checkbox-container" v-if="editMode">
                    <input type="checkbox" class="bookmark__checkbox" v-model="item.selected" @click.stop>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal v-model="showDeleteModal">
      <div class="delete-confirmation">
        <h2>삭제 확인</h2>
        <p>선택한 항목을 정말 삭제하시겠습니까?</p>
        <div class="modal-buttons">
          <button @click="confirmDelete">확인</button>
          <button @click="cancelDelete">취소</button>
        </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref , onMounted, onUnmounted } from 'vue';

// 편집 모드 상태
const editMode = ref(false);

// 섹션 목록
const sections = ['All', 'Pop-up', 'Concert', 'Musical', 'Exhibition'];
const currentSection = ref('All');

// 각 섹션의 아이템들
const popUpItems = ref([
  { title: '주술회전 0 전시회 팝업스토어', image: '/images/주술회전.jpg', location: '용산구 아이파크몰', date: '24.11.23-25.03.30', status: '진행중', selected: false },
  { title: 'BTS 진 HAPPY 팝업스토어 Running Wild to Happiness', image: '/images/진.jpg', location: '더현대 서울', date: '24.11.19-12.01', status: '진행중', selected: false },
]);

const concertItems = ref([
  { title: '찰리푸스 내한공연  “Something New” in Seoul', image: '/images/찰리푸스.gif', location: '고척스카이돔', date: '24.12.07-12.08', status: '예정', selected: false },
  { title: '2024 성시경 연말 콘서트 〈성시경〉', image: '/images/성시경.gif', location: 'KSPO DOME', date: '24.12.27-12.31', status: '예정', selected: false },
]);

const musicalItems = ref([
  { title: '뮤지컬 지킬앤하이드 (Jekyll ＆ Hyde) - 20주년', image: '/images/지킬앤하이드.gif', location: '블루스퀘어 신한카드홀', date: '24.11.29-25.05.18', status: '예정', selected: false },
  { title: '뮤지컬 〈킹키부츠〉 - 대구', image: '/images/킹키부츠 포스터.gif', location: '계명아트센터', date: '25.01.11-01.26', status: '예정', selected: false },
]);

const exhibitionItems = ref([
  { title: '빛의 거장 카라바조 ＆ 바로크의 얼굴들', image: '/images/24016040_p.gif', location: '예술의전당 한가람미술관 2층', date: '24.11.09-25.03.27', status: '진행중', selected: false },
  { title: '스폰지밥 전시회_IN BUSAN展', image: '/images/24016635_p.gif', location: '부산 영도 피아크 전시장', date: '24.11.30-12.31', status: '예정', selected: false },
]);

// 섹션별 아이템 가져오기
const getSectionItems = (section) => {
  switch (section) {
    case 'Pop-up': return popUpItems.value;
    case 'Concert': return concertItems.value;
    case 'Musical': return musicalItems.value;
    case 'Exhibition': return exhibitionItems.value;
    default: return [];
  }
};

// 편집 모드 토글
const toggleEditMode = (event) => {
  if (event) event.stopPropagation(); // 이벤트 전파 중지
  editMode.value = !editMode.value;
  document.body.classList.toggle('editing', editMode.value);
  if (!editMode.value) {
    // 편집 모드 해제 시 모든 선택 해제
    [popUpItems, concertItems, musicalItems, exhibitionItems].forEach(items => {
      items.value.forEach(item => item.selected = false);
    });
  }
};

// 전체 선택
const selectAll = () => {
  if (currentSection.value === 'All') {
    [popUpItems, concertItems, musicalItems, exhibitionItems].forEach(items => {
      items.value.forEach(item => item.selected = true);
    });
  } else {
    const currentItems = getSectionItems(currentSection.value);
    currentItems.forEach(item => item.selected = true);
  }
};

// 선택된 항목 삭제
const removeSelected = () => {
  const currentItems = getSectionItems(currentSection.value);
  const updatedItems = currentItems.filter(item => !item.selected);
  
  switch (currentSection.value) {
    case 'Pop-up':
      popUpItems.value = updatedItems;
      break;
    case 'Concert':
      concertItems.value = updatedItems;
      break;
    case 'Musical':
      musicalItems.value = updatedItems;
      break;
    case 'Exhibition':
      exhibitionItems.value = updatedItems;
      break;
    case 'All':
      // 'All' 섹션에서는 모든 섹션의 선택된 아이템을 제거
      popUpItems.value = popUpItems.value.filter(item => !item.selected);
      concertItems.value = concertItems.value.filter(item => !item.selected);
      musicalItems.value = musicalItems.value.filter(item => !item.selected);
      exhibitionItems.value = exhibitionItems.value.filter(item => !item.selected);
      break;
  }
  showDeleteModal.value = false; // 모달 닫기
};


// 모달 관련 코드 추가
// 삭제 확인 모달 관련 상태
const showDeleteModal = ref(false);

// 삭제 확인 모달 표시
const showDeleteConfirmation = () => {
  showDeleteModal.value = true;
};

// 삭제 확인
const confirmDelete = () => {
  removeSelected();
  showDeleteModal.value = false;
};

// 삭제 취소
const cancelDelete = () => {
  showDeleteModal.value = false;
};

// 아이템 선택 토글
const toggleItemSelection = (item) => {
  if (editMode.value) {
    item.selected = !item.selected;
  }
};

//편집모드 해제 코드
// 마지막 클릭 시간을 저장할 변수
const lastClickTime = ref(0);

// 편집 모드 외부 클릭 처리
const handleOutsideClick = (event) => {
  if (!editMode.value) return; // 편집 모드가 아니면 무시

  // 편집 옵션 영역과 아이템 클릭 무시
  if (event.target.closest('.bookmark__edit-container') || event.target.closest('.bookmark__item')) return;

  const currentTime = new Date().getTime();
  if (currentTime - lastClickTime.value < 300) { // 300ms 이내의 더블 클릭
    toggleEditMode();
  }
  lastClickTime.value = currentTime;
};

// 이벤트 리스너 추가 및 제거
onMounted(() => {
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 1);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

</script>

<style scoped>
@import url('/public/css/mypage/bookmark.css');
</style>