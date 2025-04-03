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
            <div class="board₩__title">제목</div>
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
       
      <!-- PAGINATION -->
      <!-- <div class="pagination-wrapper">
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
      </div> -->
      <!-- END PAGINATION -->
      <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        :has-prev-page="hasPrevPage"
        :has-next-page="hasNextPage"
        @page-changed="changePage"
      />
    </section>

    <RouterLink to="/admin/contents/concert/new">
      <button type="button" class="registration__button">등록</button>
    </RouterLink>
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Pagination from '~/components/admin/Pagination.vue';

// 싱테 관리를 위한 ref 선언
const concerts = ref([]);
const totalCount = ref(0);

// 페이지네이션 상태 관리
const totalPages = ref(0);
const currentPage = ref(1);
const hasPrevPage = ref(false);
const hasNextPage = ref(false);
const pages = ref([]);

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

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 데이터 가져오기 함수
const fetchConcerts = async (page = 1) => {
  try {
    const pageNumber = page; // 0-based index

    // url 및 파라미터 구성
    const url = `${apiBase || 'http://localhost:8081/api/v1'}/admin/concert`;
    const params = {
      p: pageNumber,
      ...(searchQuery.value ? { k: searchQuery.value } : {}),
      ...(categoryMapping[selectedCategory.value] && categoryMapping[selectedCategory.value] !== 'ALL'
        ? { s: categoryMapping[selectedCategory.value] }
        : {})
    };

    // url 쿼리 문자열 생성
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // api 요청 실행
    const fullUrl = `${url}?${queryString}`;
    console.log("REQUEST SENT TO: ", fullUrl);

    const responseData = await $fetch(fullUrl);
    console.log("SERVER RESPONSE DATA: ", responseData);

    // 응답데이터 처리
    concerts.value = responseData.concertList || [];
    totalCount.value = responseData.totalCount || 0;
    totalPages.value = responseData.totalPages || 0;
    hasPrevPage.value = responseData.hasPrev || false;
    hasNextPage.value = responseData.hasNext || false;

    // 페이지 번호 계산
    const rangeStart = Math.max(1, page - 2);
    const rangeEnd = Math.min(totalPages.value, page + 2);
    pages.value = Array.from({ length: rangeEnd - rangeStart + 1}, (_, i) => rangeStart + i);

    currentPage.value = page;

  } catch(error) {
    console.error("ERROR FETCHING CONCERT LIST: ", error);
  }
};

// 페이지 이동 핸들러
const changePage = async (page) => {
  if (page < 1 || page > totalPages.value) return;

  // URL 쿼리 파라미터 업데이트
  router.push({
    query: {
      page,
      ...(searchQuery.value ? { k: searchQuery.value } : {}),
      ...(categoryMapping[selectedCategory.value] && categoryMapping[selectedCategory.value] !== 'ALL'
        ? { s: categoryMapping[selectedCategory.value] }
        : {})
    }
  });

  await fetchConcerts(page);
};

// 수정 버튼 이벤트
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

// 드롭다운 토글
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 키테고리 선택 함수
const selectCategory = (category) => {
  selectedCategory.value = category;
  updatePlaceholder(category);
  isOpen.value = false; // 선택 후 드롭다운 클로즈
};

// placeholder 업데이트
const updatePlaceholder = (category) => {
  if (category === '통합검색') {
    inputPlaceholder.value = '검색어를 입력해주세요';
  } else if (category === '작성자') {
    inputPlaceholder.value = `검색할 ${category}를 입력해주세요`;
  } else {
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
  }
};

// 검색 수행
const performSearch = async () => {
  currentPage.value = 1;

  // URL 쿼리 파라미터 업데이트
  router.push({
    query: {
      page: 1,
      ...(searchQuery.value ? { k: searchQuery.value } : {}),
      ...(categoryMapping[selectedCategory.value] && categoryMapping[selectedCategory.value] !== 'ALL'
        ? { s: categoryMapping[selectedCategory.value] }
        : {})
    }
  });

  await fetchConcerts();
}

// 클릭 외부 영역 처리
const handleClickOutside = (e) => {
  if (!e.target.closest('.search')) {
    isOpen.value = false;
  }
};

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

// URL 쿼리 파라미터 변경 감지
const watchRouteQuery = () => {
  const newPage = parseInt(route.query.page) || 1;
  const newSearchQuery = route.query.k || '';
  const newSearchType = route.query.s || '';

  currentPage.value = newPage;
  searchQuery.value = newSearchQuery;

  if(newSearchType) {
    const category = Object.entries(categoryMapping)
      .find(([key, value]) => value === newSearchType)?.[0];

    if(category) {
      selectedCategory.value = category;
      updatePlaceholder(category);
    }
  }

    fetchConcerts(newPage);
};

// 단일 onMounted 훅으로 통합
onMounted(async () => {
  await watchRouteQuery(); // URL 쿼리 파라미터 기반으로 초기 데이터 로드

  window.addEventListener('click', handleClickOutside);

  // url 변경 감지 
  watch(() => route.query, watchRouteQuery, { deep: true });
});

// beforeRouteUpdate 가드 추가
const beforeRouteUpdate = async(to, from, next) => {
  await watchRouteQuery();
  next();
};

// defineExpose를 사용해 beforeRouteUpdate를 외부에 노출
defineExpose({ beforeRouteUpdate });

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});


</script>

<style lang="css" scoped>
@import url("/public/css/admin/contents/concert/index.css");
</style>