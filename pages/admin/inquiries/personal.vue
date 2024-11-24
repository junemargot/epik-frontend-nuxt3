<template>
  <div class="main-wrap">
    <section class="board">
      <div class="board__header">
        <h1>문의 관리 - 1:1 문의내역</h1>
        <p>총 게시물수 90건</p>
      </div>
      <div class="board__container">
        <div class="board__list">
          <div class="board__head">
            <div class="board__no">번호</div>
            <div class="board__title">제목</div>
            <div class="board__writer">작성자</div>
            <div class="board__regDate">문의접수일</div>
            <div class="board__replyDate">답변일</div>
            <div class="board__management">처리상태</div>
          </div>
          <div class="board__body">
            <div class="board__content" v-for="concert in concerts" :key="concert.id">
              <div class="board__no">{{ concert.no }}</div>
              <div class="board__title">
                <RouterLink :to="`/admin/contents/concert/${concert.id}`">
                  {{ concert.title }}
                </RouterLink>
              </div>
              <div class="board__writer">{{ concert.writer }}</div>
              <div class="board__regDate">{{ concert.regDate }}</div>
              <div class="board__replyDate">{{ concert.replyDate }}</div>
              <div class="board__management">
                <button class="modBtn" @click="goToEditPage(concert.id)">수정</button>
                <button class="delBtn">삭제</button>
              </div>
            </div>
          </div> <!-- END BOARD BODY -->
        </div> <!-- END BOARD LIST-->
      </div>
      <!-- END BOARD CONTAINER -->
    
      <!-- PAGINATION / REGISTRATION -->
      <div class=pagination-wrapper>
        <div class="pagination">
          <button type="button" class="page-btn start-page">
            <i class='bx bx-chevrons-left'></i>
          </button>
          <button type="button" class="page-btn prev-page">
            <i class='bx bx-chevron-left'></i>
          </button>
          <button type="button" class="page-btn active">1</button>
          <button type="button" class="page-btn">2</button>
          <button type="button" class="page-btn">3</button>
          <button type="button" class="page-btn">4</button>
          <button type="button" class="page-btn">5</button>
          <button type="button" class="page-btn next-page">
            <i class='bx bx-chevron-right'></i>
          </button>
          <button type="button" class="page-btn end-page">
            <i class='bx bx-chevrons-right'></i>
          </button>
        </div>
        <div class="registration">
          <RouterLink to="/admin/contents/concert/new">
            <button type="button" class="registration__button">등록</button>
          </RouterLink>
        </div>
      </div>
      <!-- END PAGINATION -->
    </section>
  </div> 
  <!-- END MAIN WRAP -->

  <!-- SEARCH BAR -->
  <section class="search">
    <div class="search__bar">
      <div class="search__dropdown">
        <div id="drop-text" class="search__text" @click="toggleDropdown">
          <span id="span">{{ selectedCategory }}</span>
          <i id="icon" class='bx bx-chevron-down' :style="{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }"></i>
        </div>
        <ul id="drop-list" class="search__list" :class="{ show: isOpen }">
          <li class="search__item" v-for="item in categories" :key="item" @click="selectCategory(item)">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="search__box">
        <input type="text" id="search-input" :placeholder="inputPlaceholder" v-model="searchQuery" />
        <i class='bx bx-search'></i>
      </div>
    </div>
  </section>
</template>

<script setup>
const concerts = ref([
  {
    id: 15,
    no: 15,
    title: "문의드립니다.",
    writer: "안녕",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 14,
    no: 14,
    title: "채팅방 개설에 관하여 문의드립니다.",
    writer: "하세요",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 13,
    no: 13,
    title: "문희드립니다.",
    writer: "잘",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 12,
    no: 12,
    title: "문희드립니다.",
    writer: "부탁",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 11,
    no: 11,
    title: "신고관련 문의드립니다.",
    writer: "드립니다.",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 10,
    no: 10,
    title: "(나)문희드립니다.",
    writer: "저는",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 9,
    no: 9,
    title: "(산와)문희드립니다.",
    writer: "사회자입니다.",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 8,
    no: 8,
    title: "(호피)문희드립니다.",
    writer: "밤이",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 7,
    no: 7,
    title: "(절)문희드립니다.",
    writer: "되었으니",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 6,
    no: 6,
    title: "(태극)문희드립니다.",
    writer: "마피아는",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 5,
    no: 5,
    title: "(빗살)문희드립니다.",
    writer: "고개를",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 4,
    no: 4,
    title: "(체크)문희드립니다.",
    writer: "들고",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 3,
    no: 3,
    title: "(석가)문희드립니다.",
    writer: "죽일",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 2,
    no: 2,
    title: "문의드립니다",
    writer: "시민을",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  },
  {
    id: 1,
    no: 1,
    title: "문의드립니다",
    writer: "골라주세요.",
    regDate: "2024-08-25",
    replyDate: "2024-11-15",
  }
]);

// 수정 버튼 이벤트
const router = useRouter();
const goToEditPage = (id) => {
  router.push(`/admin/contents/concert/${id}/edit`); // 하드코딩
};


// 검색 기능
const categories = ['통합검색', '제목 + 내용', '제목', '내용', '작성자']; // 검색 카테고리
const selectedCategory = ref('통합검색');
const inputPlaceholder = ref('검색어를 입력해주세요');
const searchQuery = ref('');
const isOpen = ref(false); // dropdown 상태

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  updatePlaceholder(category);
  isOpen.value = false; // 선택 후 드롭다운 클로즈
};

const updatePlaceholder = (category) => {
  if(category === '통합검색') {
    inputPlaceholder.value = '검색어를 입력해주세요';
  } else if(category === '작성자') {
    inputPlaceholder.value = `검색할 ${category}를 입력해주세요`;
  } else {
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
  }
};

// 클릭 외부 영역 처리
const handleClickOutside = (e) => {
  if(!e.target.closest('.search')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});



</script>

<style lang="css" scoped>
/* @import "@/assets/css/admin/contents/concert/index.css"; */
@import url("/public/css/admin/inquiries/personal.css");
</style>