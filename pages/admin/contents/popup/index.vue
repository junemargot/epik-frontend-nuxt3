<template>
  <div class="main-wrap">
    <section class="board">
      <div class="board__header">
        <h1>팝업 Pop-up</h1>
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
            <div class="board__content" v-for="popup in popups" :key="popup.id">
              <div class="board__no">{{ popup.id }}</div>
              <div class="board__title">
                <RouterLink :to="`/admin/contents/popup/${popup.id}`">
                  {{ popup.title }}
                </RouterLink>
              </div>
              <div class="board__writer">{{ popup.writer }}</div>
              <div class="board__regDate">{{ formatDate(popup.writeDate) }}</div>
              <div class="board__viewCnt">{{ popup.viewCount }}</div>
              <div class="board__management">
                <button 
                  class="hiddenBtn"
                  :class="{ 'activeBtn' : !popup.isPrivate }"
                  @click="hiddenHandler(popup.id)">
                    {{ popup.isPrivate ? '공개' : '비공개' }}
                </button>
                <button class="modifyBtn" @click="goToEditPage(popup.id)">수정</button>
                <button class="deleteBtn" @click="deleteHandler(popup.id)">삭제</button>
              </div>
            </div>
          </div> <!-- END BOARD BODY -->
        </div> <!-- END BOARD LIST-->
      </div>
      <!-- END BOARD CONTAINER -->
        
      <!-- Pagination -->
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
          <RouterLink to="/admin/contents/popup/new">
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Pagination from '~/components/admin/Pagination.vue';
import { usePaginationStore } from '~/stores/pagination';
import SearchBar from '~/components/admin/SearchBar.vue';
import { categoryMapping } from '~/utils/categoryMapping';

// Pinia 스토어 초기화
const paginationStore = usePaginationStore();

// 페이지네이션 상태 관리
const totalPages = computed(() => paginationStore.totalPages);
const currentPage = computed(() => paginationStore.currentPage);
const hasPrevPage = computed(() => paginationStore.hasPrevPage);
const hasNextPage = computed(() => paginationStore.hasNextPage);
const pages = computed(() => paginationStore.visiblePages);

// 라우터 및 라우트 설정
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase || 'http://localhost:8081/api/v1';

// 상태 관리를 위한 ref 선언
const popups = ref([]);
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

// 팝업 목록 fetch
const fetchPopups = async (page = 1) => {
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
    const fullUrl = `${apiBase}/admin/popup?${queryString}`;
    console.log("[REQUEST URL]:", fullUrl); // 요청 URL 확인

    // API 요청
    const responseData = await $fetch(fullUrl);
    console.log("[API 응답 전체]: ", responseData);
    console.log("[API 응답] totalPages: ", responseData.totalPages); // 응답 데이터 확인

    // 목록 데이터 세팅
    popups.value = responseData.popupList || [];
    totalCount.value = responseData.totalCount || 0;

    // Pinia 스토어 업데이트
    paginationStore.setPagination({
      currentPage: page,
      totalPages: responseData.totalPages || 1, // API 응답 데이터 반영
      hasPrevPage: responseData.hasPrev || false,
      hasNextPage: responseData.hasNext || false
    });
  
  } catch(error) {
    console.error("Error Fetching Popup List:", error);

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
}

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
  await fetchPopups(page);
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

  await fetchPopups(1);
};

// 수정 버튼 이벤트
const goToEditPage = (id) => {
  router.push(`/admin/contents/popup/${id}/edit`); // 하드코딩
};

// 삭제 처리
const deleteHandler = async (id) => {
  // 사용자 확인 요청
  if(!confirm('해당 게시물을 삭제하시겠습니까?')) {
    return; // 사용자가 취소한 경우
  }

  try {
    // DELETE 요청 보내기
    const url = `${apiBase || 'http://localhost:8081/api/v1'}/admin/popup/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `서버 응답 오류: ${response.status}`);
    }
    alert('게시물이 삭제되었습니다.');

    // 현재 페이지에 항목이 하나만 있고, 첫 페이지가 아닌 경우 이전 페이지로 이동
    if(popups.value.length === 1 && currentPage.value > 1) {
      await changePage(currentPage.value - 1);
    } else {
      await fetchPopups(currentPage.value);
    }
  }catch(error) {
    console.error('팝업 삭제 중 오류 발생: ', error);
    alert(`팝업 삭제 중 오류 발생: ${error.message}`);
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
  fetchPopups(newPage); // 데이터 재요청
};

// onMounted 시 초기 데이터 로드
onMounted(async () => {
  // 초기 검색어 설정
  searchQuery.value = route.query.k || '';

  // 페이지 번호 설정
  const page = parseInt(route.query.p) || 1;

  // 초기 데이터 로드
  await fetchPopups(page);

  // 라우트 변경 감지
  watch(() => route.query, async (newQuery) => {
    const newPage = parseInt(newQuery.p) || 1;
    searchQuery.value = newQuery.k || '';

    await fetchPopups(newPage);
  }, {deep: true});
});

// beforeRouteUpdate 가드
const beforeRouteUpdate = async (to, from, next) => {
  await watchRouteQuery();
  next();
};
defineExpose({ beforeRouteUpdate });

// 비공개 처리
const hiddenHandler = async (id) => {
  try {
    if(!confirm('해당 게시물의 공개 상태를 변경하시겠습니까?')) {
      return;
    }

    const url = `${apiBase || 'http://localhost:8081/api/v1'}/admin/popup/${id}/change-status`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(!response.ok) {
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    // 성공 메시지 표시
    alert('게시물의 공개 상태가 변경되었습니다.');

    // 목록 새로고침
    await fetchPopups(currentPage.value);
    await nextTick();

  } catch(error) {
    console.error('팝업 공개 상태 변경 중 오류 발생: ', error);
    alert(`팝업 공개 상태 변경 중 오류 발생: ${error.message}`);
  }
};


</script>

<style lang="css" scoped>
@import url('/public/css/admin/contents/popup/index.css');
</style>