<template>
  <div class="wrap">
    <!-- MAIN -->
    <section class="board">
      <div class="board__header">
        <h1>공지사항</h1>
        <p>총 게시물 : {{ totalCount }}건</p>
      </div>
      <div class="board__container">
        <div class="board__list">
          <div class="board__head">
            <div class="board__no">번호</div>
            <div class="board__title">제목</div>
            <div class="board__writer">작성자</div>
            <div class="board__writeDate">작성일</div>
            <div class="board__viewCount">조회수</div>
            <div class="board__management">게시물관리</div>
          </div>
          <div class="board__body">
            <div class="board__content" v-for="notice in notices" :key="notice.id">
              <div class="board__no">{{ notice.id }}</div>
              <div class="board__title">
                <RouterLink :to="`/admin/notice/${notice.id}`">{{ notice.title }}</RouterLink>
              </div>
              <div class="board__writer">{{ notice.writer }}</div>
              <div class="board__writeDate">{{ formatDate(notice.writeDate) }}</div>
              <div class="board__viewCount">{{ notice.viewCount }}</div>
              <div class="board__management">
                <button class="hiddenBtn" @click="hiddenHandler(notice.id)">비공개</button>
                <button class="editBtn" @click="goToEditPage(notice.id)">수정</button>
                <button class="deleteBtn" @click="deleteHandler(notice.id)">삭제</button>
              </div>
            </div>
          </div> <!-- END BOARD BODY -->
        </div> <!-- END BOARD LIST-->
      </div>
      <!-- END BOARD CONTAINER -->

      <!-- PAGINATION / REGISTRATION -->
      <div class="pagination-registration-container">
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          :has-prev-page="currentPage > 1"
          :has-next-page="currentPage < totalPages"
          :visible-pages="pages"
          @page-change="changePage"
        />
        <div class="registration">
          <RouterLink to="/admin/notice/new">
            <button type="button" class="registration__button">등록</button>
          </RouterLink>
        </div>
      </div>
      <!-- END PAGINATION -->
    </section>
  </div> <!-- END MAIN WRAP -->

  <!-- SEARCH BAR -->
  <SearchBar
    :initial-category="getInitialCategory()"
    :initial-query="searchQuery"
    @search="handleSearch"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePaginationStore } from '~/stores/pagination';
import Pagination from '~/components/admin/Pagination.vue';
import SearchBar from '~/components/admin/SearchBar.vue';
import { categoryMapping } from '~/utils/categoryMapping';

// Pinia 스토어 초기화
const paginationStore = usePaginationStore();

// computed 상태 (Pinia 스토어와 실시간 동기화)
const totalPages = computed(() => paginationStore.totalPages);
const currentPage = computed(() => paginationStore.currentPage);
const hasPrevPage = computed(() => paginationStore.hasPrevPage);
const hasNextPage = computed(() => paginationStore.hasNextPage);
const pages = computed(() => paginationStore.visiblePages);

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase || 'http://localhost:8081/api/v1';

// 공지사항 목록 및 상태 관리
const notices = ref([]);
const totalCount = ref(0);
const searchQuery = ref('');

// 검색 초기 카테고리 값 가져오기
const getInitialCategory = () => {
  const searchType = route.query.s;
  if(!searchType) return '통합검색';

  // searchType 파라미터 값에 따라 적절한 카테고리 반환
  const category = Object.entries(categoryMapping)
    .find(([key, value]) => value === searchType)?.[0];

  return category || '통합검색';
};

// 공지사항 목록 fetch
const fetchNotices = async (page = 1) => {
  try {
    // 쿼리 파라미터 구성
    const params = {
      p: page,
      ...(searchQuery.value && { k: searchQuery.value }),
      ...(route.query.s && { s: route.query.s })
    };

    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${apiBase}/admin/notice?${queryString}`;
    console.log("[REQUEST URL]: ", fullUrl);

    // API 요청
    const responseData = await $fetch(fullUrl);
    console.log("[API 응답 전체]: ", responseData);

    // 목록 데이터 세팅
    notices.value = responseData.noticeList || [];
    totalCount.value = responseData.totalCount || 0;

    // Pinia 스토어 업데이트
    paginationStore.setPagination({
      currentPage: page,
      totalPages: responseData.totalPages || 1, // API 응답 데이터 반영
      hasPrevPage: responseData.hasPrev || false,
      hasNextPage: responseData.hasNext || false
    });

  } catch(error) {
    console.error("Error Fetching Notice List: ", error);

    if(error.response) {
      console.error("Error Response: ", await error.response.text());
    }

    paginationStore.setPagination({
      currentPage: page,
      totalPages: 1,
      hasPrevPage: false,
      hasNextPage: false
    });
  }
};

// 페이지 변경 핸들러
const changePage = async (page) => {
  if (page < 1 || page > paginationStore.totalPages) return;

  // URL 쿼리 파라미터 업데이트
  router.push({
    query: {
      p: page,
      ...(searchQuery.value && { k: searchQuery.value }),
      ...(route.query.s && { s: route.query.s })
    }
  });

  // 데이터 재요청
  await fetchNotices(page);
};

// 검색 핸들러
const handleSearch = async (searchData) => {
  searchQuery.value = searchData.query;
  console.log('검색 데이터: ', searchData);

  // 페이지 초기화
  paginationStore.setPagination({
    currentPage: 1,
    totalPages: paginationStore.totalPages,
    hasPrevPage: false,
    hasNextPage: paginationStore.hasNextPage
  });

  // URL 쿼리 파라미터 업데이트
  router.push({
    query: {
      p: 1,
      ...(searchData.query ? { k: searchData.query } : {}),
      s: searchData.categoryCode || 'ALL'
    }
  });

  await fetchNotices(1);
};

// 수정 버튼 이벤트
const goToEditPage = (id) => {
  router.push(`/admin/notice/${id}/edit`);
};

// 삭제 핸들러
const deleteHandler = async (id) => {
  if (confirm("선택하신 게시물을 삭제하시겠습니까?")) {
    try {
      await fetchNotices(currentPage.value);
      alert("공지사항이 정상적으로 삭제되었습니다.");
      await fetchNotices(); // 목록 새로고침

    } catch (error) {
      alert("공지사항 삭제에 실패했습니다: " + error.message);
    }
  }
};

// 비공개 처리 핸들러
const hiddenHandler = async (id) => {
  try {
    if(!confirm("해당 게시물의 공개 상태를 변경하시겠습니까?")) {
      return;
    }

    const url = `${apiBase}/admin/notice/${id}/change-status`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(!response.ok) {
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    alert("게시물의 공개 상태가 변경되었습니다.");
    await fetchNotices(currentPage.value);
  
  } catch(error) {
    console.error(`공지사항 공개 상태 변경 중 오류 발생: `, error);
    alert(`공개 상태 변경 중 오류 발생: ${error.message}`);
  }
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '.').replace(/\.$/, '');
};

// route 변경 감지
const watchRouteQuery = () => {
  const newPage = parseInt(route.query.p) || 1;
  const newSearchQuery = route.query.k || '';
  const newSearchType = route.query.s || '';

  paginationStore.currentPage = newPage;
  searchQuery.value = newSearchQuery;
  fetchNotices(newPage);
}

// onMounted 시 초기 데이터 로드
onMounted(async () => {
  // 초기 검색어 설정
  searchQuery.value = route.query.k || '';

  // 페이지 번호 설정
  const page = parseInt(route.query.p) || 1;

  // 초기 데이터 로드
  await fetchNotices(page);

  // 라우드 변경 감지
  watch(() => route.query, async (newQuery) => {
    const newPage = parseInt(newQuery.p) || 1;
    searchQuery.value = newQuery.k || '';

    await fetchNotices(newPage);
  }, {deep: true});
});

// onMounted(async () => {
//   const storedNotices = JSON.parse(localStorage.getItem('notices'));
//   const storedPage = JSON.parse(localStorage.getItem('currentPage'));
//   const storedTotalPages = JSON.parse(localStorage.getItem('totalPages'));
//   const storedPages = JSON.parse(localStorage.getItem('pages'));
//   const storedTotalCount = JSON.parse(localStorage.getItem('totalCount')); // 추가

//   if (storedNotices && storedPage && storedTotalPages && storedPages && storedTotalCount) {
//     // 로컬 스토리지에 데이터가 있다면 복원
//     notices.value = storedNotices;
//     paginationStore.currentPage = storedPage;
//     totalPages.value = storedTotalPages;

//     paginationStore.setPagination({
//       currentPage: storedPage,
//       totalPages: storedTotalPages,
//       hasPrevPage: storedPage > 1,
//       hasNextPage: storedPage < storedTotalPages
//     });
    
//     console.log("로컬 스토리지에서 데이터 복구 완료.");

//   } else {
//     // 초기 검색어 설정
//     searchQuery.value = route.query.k || '';

//     // 페이지 번호 설정
//     const page = parseInt(route.query.p) || 1;

//     // 초기 데이터 로드
//     await fetchNotices(page);
//   }

//   // 라우트 변경 감지
//   watch(() => route.query, async (newQuery) => {
//     const newPage = parseInt(newQuery.p) || 1;
//     searchQuery.value = newQuery.k || '';

//     await fetchNotices(newPage);
//   }, {deep: true});
// });

// beforeRouteUpdate 가드
const beforeRouteUpdate = async (to, from, next) => {
  await watchRouteQuery();
  next();
};
defineExpose({ beforeRouteUpdate });

</script>

<style lang="css" scoped>
@import url('/public/css/admin/notice/index.css');
</style>