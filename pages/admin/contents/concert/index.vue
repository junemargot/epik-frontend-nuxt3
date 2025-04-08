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
    
      <div class="pagination-registration-container">
        <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        :has-prev-page="hasPrevPage"
        :has-next-page="hasNextPage"
        :visible-pages="pages"
        @page-change="changePage"
        />

        <div class="registration">
          <RouterLink to="/admin/contents/concert/new">
            <button type="button">등록</button>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
  <!-- END MAIN WRAP -->

  <!-- SEARCH BAR -->
  <SearchBar
    :initial-category="getInitialCategory()"
    :initial-query="searchQuery"
    @search="handleSearch"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Pagination from '~/components/admin/Pagination.vue';
import { usePaginationStore } from '~/stores/pagination';
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

// 콘서트 목록 및 검색 상태
const concerts = ref([]);
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

// 콘서트 목록 fetch
const fetchConcerts = async (page = 1) => {
  try {
    // 쿼리 파라미터 구성
    const params = {
      p: page,
      ...(searchQuery.value && { k: searchQuery.value }),
      ...(route.query.s && { s: route.query.s })
    };
  
    // 디버깅 코드
    console.log('[검색 파라미터 상세]: ',{
      searchQuery: searchQuery.value,
      routeQueryS: route.query.s,
      finalParams: params
    });

    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${apiBase}/admin/concert?${queryString}`;
    console.log("[REQUEST URL]:", fullUrl); // 요청 URL 확인

    // API 요청
    const responseData = await $fetch(fullUrl);
    console.log("[API 응답 전체]: ", responseData);
    console.log("[API 응답] totalPages: ", responseData.totalPages); // 응답 데이터 확인

    // 목록 데이터 세팅
    concerts.value = responseData.concertList || [];
    totalCount.value = responseData.totalCount || 0;

    // Pinia 스토어 업데이트
    paginationStore.setPagination({
      currentPage: page,
      totalPages: responseData.totalPages || 1, // API 응답 데이터 반영
      hasPrevPage: responseData.hasPrev || false,
      hasNextPage: responseData.hasNext || false
    });

  } catch (error) {
    console.error("Error Fetching Concert List:", error);

    if(error.response) {
      console.error("Error Response: ", await error.response.text());
    }

    // 최소한의 fallback
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

  // URL 쿼리 파라미터 업데이트 (?p=2)
  router.push({
    query: {
      p: page,
      ...(searchQuery.value && { k: searchQuery.value }),
      ...(route.query.s && { s: route.query.s }) // selectedCategory 대신 route.query.s 사용
    }
  });

  // 데이터 재요청
  await fetchConcerts(page);
};


// 검색 핸들러 (SearchBar 컴포넌트에서 emit된 이벤트 처리)
const handleSearch = async (searchData) => {
  searchQuery.value = searchData.query;
  console.log('검색 데이터: ', searchData);

  // 페이지 초기화
  paginationStore.setPagination(({
    currentPage: 1,
    totalPages: paginationStore.totalPages,
    hasPrevPage: false,
    hasNextPage: paginationStore.hasNextPage
  }));

  // URL 쿼리 파라미터 업데이트
  router.push({
    query: {
      p: 1,
      ...(searchData.query ? { k: searchData.query } : {}),
      s: searchData.categoryCode || 'ALL'
    }
  });

  await fetchConcerts(1);
};

// 수정 버튼 이벤트
const goToEditPage = (id) => {
  router.push(`/admin/contents/concert/${id}/edit`); // 하드코딩
};

// 삭제 핸들러
const deleteHandler = async (id) => {
  if(confirm("게시물을 삭제하시겠습니까?")) {
    try {
      const response = await fetch(`${apiBase}/admin/concert/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`) ;
      }

      alert("게시물이 정상적으로 삭제되었습니다.");
      await fetchConcerts(currentPage.value);

    } catch(error) {
      console.error('콘서트 삭제 중 오류 발생: ', error);
      alert("게시물 삭제에 실패했습니다: " + error.message);
    }
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

// 라우트 변경 감지
const watchRouteQuery = () => {
  const newPage = parseInt(route.query.p) || 1;
  const newSearchQuery = route.query.k || '';
  const newSearchType = route.query.s || '';

  paginationStore.currentPage = newPage; // Pinia 스토어 동기화
  searchQuery.value = newSearchQuery;

  if(newSearchType) {
    const category = Object.entries(categoryMapping)
      .find(([key, value]) => value === newSearchType)?.[0];
    if(category) {
      selectedCategory.value = category;
      updatePlaceholder(category);
    }
  }
  fetchConcerts(newPage); // 데이터 재요청
};

// onMounted 시 초기 데이터 로드
onMounted(async () => {
  // 초기 검색어 설정
  searchQuery.value = route.query.k || '';

  // 페이지 번호 설정
  const page = parseInt(route.query.p) || 1;

  // 초기 데이터 로드
  await fetchConcerts(page);

  // await watchRouteQuery();
  // window.addEventListener('click', handleClickOutside);
  // watch(() => route.query, watchRouteQuery, { deep: true });

  // 라우트 변경 감지
  watch(() => route.query, async (newQuery) => {
    const newPage = parseInt(newQuery.p) || 1;
    searchQuery.value = newQuery.k || '';

    await fetchConcerts(newPage);
  }, {deep: true});
});

// beforeRouteUpdate 가드
const beforeRouteUpdate = async (to, from, next) => {
  await watchRouteQuery();
  next();
};
defineExpose({ beforeRouteUpdate });


</script>

<style lang="css" scoped>
@import url("/public/css/admin/contents/concert/index.css");
</style>