<template>
  <div class="main-wrap">
    <ContentBoard 
      title="전시회 Exhibition"
      :postCount="totalCount"
      :items="exhibitions"
      contentType="exhibition"
      :current-page="currentPage"
      :total-pages="totalPages"
      :has-prev-page="hasPrevPage"
      :has-next-page="hasNextPage"
      :visible-pages="pages"
      @edit="goToEditPage"
      @delete="deleteHandler"
      @hidden="hiddenHandler"
      @page-change="changePage"
    />
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
import ContentBoard from '~/components/admin/ContentBoard.vue';

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

// 전시회 목록 및 검색 상태
const exhibitions = ref([]);
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

// 전시회 목록 fetch
const fetchExhibitions = async (page = 1) => {
  try {
    const params = {
      p: page,
      ...(searchQuery.value && { k: searchQuery.value }),
      ...(route.query.s && { s: route.query.s })
    };

    // url 쿼리 문자열 생성
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${apiBase}/admin/exhibition?${queryString}`;
    console.log("[REQUEST URL]:", fullUrl); // 요청 URL 확인

    // API 요청
    const responseData = await $fetch(fullUrl);
    console.log("[API 응답 전체]: ", responseData);

    // 목록 데이터 세팅
    exhibitions.value = responseData.exhibitionList || [];
    totalCount.value = responseData.totalCount || 0;

    // Pinia 스토어 업데이트
    paginationStore.setPagination({
      currentPage: page,
      totalPages: responseData.totalPages || 1, // API 응답 데이터 반영
      hasPrevPage: responseData.hasPrev || false,
      hasNextPage: responseData.hasNext || false
    });

  } catch(error) {
    console.error("Error Fetching Concert List:", error);

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

// 페이지 이동 핸들러
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

  await fetchExhibitions(page);
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

  await fetchExhibitions(1);
};

// 수정 버튼 이벤트
const goToEditPage = (id) => {
  router.push(`/admin/contents/exhibition/${id}/edit`);
};

// 삭제 핸들러
const deleteHandler = async (id) => {
  if(confirm("게시물을 삭제하시겠습니까?")) {
    try {
      const response = await fetch(`${apiBase}/admin/exhibition/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      alert("게시물이 정상적으로 삭제되었습니다.");
      await fetchExhibitions(currentPage.value);

    } catch(error) {
      console.error('전시회 게시물 삭제 중 오류 발생: ', error);
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
  fetchExhibitions(newPage); // 데이터 재요청
};

// onMounted 시 초기 데이터 로드
onMounted(async () => {
  // 초기 검색어 설정
  searchQuery.value = route.query.k || '';

  // 페이지 번호 설정
  const page = parseInt(route.query.p) || 1;

  // 초기 데이터 로드
  await fetchExhibitions(page);

  // 라우트 변경 감지
  watch(() => route.query, async (newQuery) => {
    const newPage = parseInt(newQuery.p) || 1;
    searchQuery.value = newQuery.k || '';

    await fetchExhibitions(newPage);
  }, {deep: true});
});

// beforeRouteUpdate 가드
const beforeRouteUpdate = async (to, from, next) => {
  await watchRouteQuery();
  next();
};
defineExpose({ beforeRouteUpdate });

</script>