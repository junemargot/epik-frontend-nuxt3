<template>
  <div class="main-wrap">
    <section class="board">
      <div class="board__header">
        <h1>전시회 Exhibition</h1>
        <p>총 게시물수 75건</p>
      </div>
      <div class="board__container">
        <div class="board__list">
          <div class="board__head">
            <div class="board__no">번호</div>
            <div class="board__title">제목</div>
            <div class="board__writer">작성자</div>
            <div class="board__regDate">작성일</div>
            <div class="board__viewCnt">조회수</div>
            <div class="board__management">게시물관리</div>
          </div>
          <div class="board__body">
            <div class="board__content" v-for="exhibition in exhibitions" :key="index">
              <div class="board__no">{{ exhibition.no }}</div>
              <div class="board__title">
                <RouterLink :to="`/admin/contents/exhibition/${exhibition.id}`">
                  {{ exhibition.title }}
                </RouterLink>
              </div>
              <div class="board__writer">{{ exhibition.writer }}</div>
              <div class="board__regDate">{{ exhibition.regDate }}</div>
              <div class="board__viewCnt">{{ exhibition.viewCnt }}</div>
              <div class="board__management">
                <button class="modBtn" @click="goToEditPage(exhibition.id)">수정</button>
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
          <RouterLink to="/admin/contents/exhibition/new">
            <button type="button" class="registration__button">등록</button>
          </RouterLink>
        </div>
      </div>
      <!-- END PAGINATION -->
    </section>
  </div> <!-- END MAIN WRAP -->

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
const exhibitions = ref([
  {
    id: 15,
    no: 15,
    title: "[얼리버드] 우연히 웨스 앤더슨 2",
    writer: "관리자2",
    regDate: "2024-08-25",
    viewCnt: 15,
  },
  {
    id: 14,
    no: 14,
    title: "대구간송미술관 개관기념 국보.보물전 <여세동보>",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 20,
  },
  {
    id: 13,
    no: 13,
    title: "[슈퍼 얼리버드] 디즈니 100년 특별전",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 22,
  },
  {
    id: 12,
    no: 12,
    title: "[얼리버드]유코 히구치 특별展 : 비밀의 숲",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 32,
  },
  {
    id: 11,
    no: 11,
    title: "[슈퍼 얼리버드] 불멸의 화가 반 고흐",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 21,
  },
  {
    id: 10,
    no: 10,
    title: "ICONS OF URBAN ART - 어반아트: 거리에서 미술관으로",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 18,
  },
  {
    id: 9,
    no: 9,
    title: "[얼리버드] 툴루즈 로트렉",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 15,
  },
  {
    id: 8,
    no: 8,
    title: "[북촌]2024년 9월~10월_어둠속의대화(DIALOGUE IN THE DARK)",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 10,
  },
  {
    id: 7,
    no: 7,
    title: "2024 대전국제와인EXPO 와인&주류 박람회",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 20,
  },
  {
    id: 6,
    no: 6,
    title: "2024년 하반기 경복궁 야간관람",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 17,
  },
  {
    id: 5,
    no: 5,
    title: "장줄리앙의 종이세상",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 20,
  },
  {
    id: 4,
    no: 4,
    title: "리얼 뱅크시 REAL BANKSY",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 12,
  },
  {
    id: 3,
    no: 3,
    title: "[슈퍼 얼리버드] 미피와 마법 우체통",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 10,
  },
  {
    id: 2,
    no: 2,
    title: "[마감할인] 인사이드미 시즌2(~10월 13일 종료)",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 7,
  },
  {
    id: 1,
    no: 1,
    title: "다니엘 아샴: 서울3024",
    writer: "관리자",
    regDate: "2024-08-25",
    viewCnt: 11,
  }
]);

// 수정 버튼 이벤트
const router = useRouter();
const goToEditPage = (id) => {
  router.push(`/admin/contents/exhibition/${id}/edit`); // 하드코딩
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
@import url(/public/css/admin/contents/exhibition/index.css);
</style>