<!-- CONCERT INDEX PAGE -->
<template>
  <div class="main-wrap">
    <section class="board">
      <div class="board__header">
        <h1>콘서트 Concert</h1>
        <p>전체 게시물수 {{ totalCount }}</p>
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
            <div class="board__content" v-for="concert in concerts" :key="concert.id">
              <div class="board__no">{{ concert.id }}</div>
              <div class="board__title">
                <RouterLink :to="`/admin/contents/concert/${concert.id}`">
                  {{ concert.title }}
                </RouterLink>
              </div>
              <div class="board__writer">{{ concert.writer }}</div>
              <div class="board__regDate">{{ formatDate(concert.writeDate) }}</div>
              <div class="board__viewCnt">{{ concert.viewCount }}</div>
              <div class="board__management">
                <button class="hiddenBtn" @click="hiddenHandler(concert.id)">비공개</button>
                <button class="modifyBtn" @click="goToEditPage(concert.id)">수정</button>
                <button class="deleteBtn" @click="deleteHandler(concert.id)">삭제</button>
              </div>
            </div>
          </div> <!-- END BOARD BODY -->
        </div> <!-- END BOARD LIST-->
      </div>
      <!-- END BOARD CONTAINER -->

      <!-- PAGINATION / REGISTRATION -->
      <!-- <div class=pagination-wrapper>
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
        </div> -->
      <!-- PAGINATION -->
      <div class="pagination-wrapper">
        <div class="pagination">
          <button type="button" class="page-btn start-page" :disabled="!hasPrevPage"
            @click.prevent.stop="changePage(1)">
            <i class="bx bx-chevrons-left"></i>
          </button>
          <button type="button" class="page-btn prev-page" :disabled="!hasPrevPage"
            @click.prevent.stop="changePage(currentPage - 1)">
            <i class="bx bx-chevron-left"></i>
          </button>
          <button v-for="page in pages" :key="page" type="button" class="page-btn"
            :class="{ active: currentPage === page }" @click.prevent.stop="changePage(page)">
            {{ page }}
          </button>
          <button type="button" class="page-btn next-page" :disabled="!hasNextPage"
            @click.prevent.stop="changePage(currentPage + 1)">
            <i class="bx bx-chevron-right"></i>
          </button>
          <button type="button" class="page-btn end-page" :disabled="!hasNextPage"
            @click.prevent.stop="changePage(totalPages)">
            <i class="bx bx-chevrons-right"></i>
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
          <i id="icon" class='bx bx-chevron-down' :style="{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }">
          </i>
        </div>
        <ul id="drop-list" class="search__list" :class="{ show: isOpen }">
          <li class="search__item" v-for="item in categories" :key="item" @click="selectCategory(item)">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="search__box">
        <input type="text" id="search-input" :placeholder="inputPlaceholder" v-model="searchQuery"
          @keyup.enter="performSearch" />
        <i class='bx bx-search' @click.prevent.stop='performSearch'></i>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 싱테 관리를 위한 ref 선언
const concerts = ref([]);
const totalCount = ref(0);

// 페이지네이션 상태 관리
const totalPages = ref(0);
const currentPage = ref(1);
const hasPrevPage = ref(false);
const hasNextPage = ref(false);
const pages = ref([]);

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;


const fetchConcerts = async (page = 1) => {
  const pageNumber = page; // 0-based index

  const { data, error } = await useFetch('/admin/concert', {
    baseURL: apiBase || 'http://localhost:8080/api/v1',
    // params: { page: pageNumber }, // 서버로 요청할 페이지
    params: {
      p: pageNumber,
      k: searchQuery.value || '',
      s: categoryMapping[selectedCategory.value] || 'ALL'
    }, // 요청 페이지
    cache: false, // 캐싱 비활성화
    key: `concerts-page-${page}`,
    onRequest({ options }) {
      console.log("REQUEST SENT: ", options.url, options.params);
      console.log("pagenumber: ", typeof(pageNumber));
    },
    onResponse({ response }) {
      console.log("SERVER RAW RESPONSE: ", response);
      console.log("SERVER RESPONSE DATAS: ", response._data);
    }
  });

  if (error.value) {
    console.error("ERROR FETCHING CONCERT LIST: ", error.value);
    return;
  }

  if(data.value) {
    const responseData = data.value;

    // 서버 응답 디버깅
    console.log("SERVER RESPONSE DATAS: ", responseData);

    concerts.value = responseData.concertList || [];
    totalCount.value = responseData.totalCount || 0;
    totalPages.value = responseData.totalPages || 0;
    hasPrevPage.value = responseData.hasPrev || false;
    hasNextPage.value = responseData.hasNext || false;
    pages.value = responseData.pages || [];
    // currentPage.value = page;

    // 페이지 번호 계산
    const rangeStart = Math.max(1, page - 2);
    const rangeEnd = Math.min(totalPages.value, page + 2);
    pages.value = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);

    currentPage.value = page;
  } else {
    console.warn("NO DATA RECEIVED");
  }
};


onMounted(async () => {
  await fetchConcerts(1); // 데이터 fetch 후 상태 갱신 - 페이지 로드 시 1 페이지 데이터 가져오기
  console.log('Concerts: ', concerts.value); // 페이지 데이터
  console.log('Total Count: ', totalCount.value); // 총 게시물수
})


// 페이지 이동 핸들러
const changePage = async (page) => {
  if (page < 1 || page > totalPages.value) {
    console.warn("INVALID PAGE NUMBER:", page);
    return;
  }

  console.log(`Changing to page: ${page}`); // 페이지 디버깅
  await fetchConcerts(page);
  console.log("Current Page Data: ", concerts.value);
};


// 수정 버튼 이벤트
const router = useRouter();
const goToEditPage = (id) => {
  router.push(`/admin/contents/concert/${id}/edit`); // 하드코딩
};

// 삭제 핸들러
// const deleteHandler = async (id) => {
//   if(confirm("선택하신 게시물을 삭제하시겠습니까?")) {
//     try {
//       await fetchNoticeDelete(id);
//       alert("공지사항이 정상적으로 삭제되었습니다.");
//       await fetchNoticeList(); // 목록 새로고침

//     } catch(error) {
//       alert("공지사항 삭제에 실패했습니다: " + error.message);
//     }
//   }
// };


// 검색 기능
const categories = ['통합검색', '제목 + 내용', '제목', '내용', '작성자']; // 검색 카테고리
const selectedCategory = ref('통합검색');
const inputPlaceholder = ref('검색어를 입력해주세요');
const searchQuery = ref('');
const isOpen = ref(false); // dropdown 상태

const categoryMapping = {
  '통합검색': 'ALL',
  '제목': 'TITLE',
  '내용': 'CONTENT',
  '작성자': 'WRITER'
};


const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 키테고리 선택 함수
const selectCategory = (category) => {
  selectedCategory.value = category;
  updatePlaceholder(category);
  isOpen.value = false; // 선택 후 드롭다운 클로즈
};

const updatePlaceholder = (category) => {
  if (category === '통합검색') {
    inputPlaceholder.value = '검색어를 입력해주세요';
  } else if (category === '작성자') {
    inputPlaceholder.value = `검색할 ${category}를 입력해주세요`;
  } else {
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
  }
};

const performSearch = async () => {
  currentPage.value = 1;

  await fetchConcerts();
  router.push({ query: { k: searchQuery.value, s: categoryMapping[selectedCategory.value] } });
}

// 클릭 외부 영역 처리
const handleClickOutside = (e) => {
  if (!e.target.closest('.search')) {
    isOpen.value = false;
  }
};



onMounted(() => {
  window.addEventListener('click', handleClickOutside);

  // console.log("FETCHED DATA:", data.value);
  // console.log("ERROR:", error.value);

  // if(data.value) {
  //   concerts.value = data.value.concertList || [];
  //   totalCount.value = data.value.totalCount || 0;
  // } else {
  //   console.warn("NO DATA RECEIVED OR DATA IS UNDEFINED");
  // }

});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

// 날짜 포맷팅 함수 추가
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '.').replace(/\.$/, '');
};


</script>

<style lang="css" scoped>
/* @import "@/assets/css/admin/contents/concert/index.css"; */
@import url("/public/css/admin/contents/concert/index.css");
</style>