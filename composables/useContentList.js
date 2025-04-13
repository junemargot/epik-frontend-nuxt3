import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePaginationStore } from '~/stores/pagination';
import { categoryMapping } from '~/utils/categoryMapping';

export function useContentList(contentType) {
  const paginationStore = usePaginationStore();
  const router = useRouter();
  const route = useRoute();
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || 'http://localhost:8081/api/v1';

  // 페이지네이션 상태
  const totalPages = computed(() => paginationStore.totalPages);
  const currentPage = computed(() => paginationStore.currentPage);
  const hasPrevPage = computed(() => paginationStore.hasPrevPage);
  const hasNextPage = computed(() => paginationStore.hasNextPage);
  const pages = computed(() => paginationStore.visiblePages);

  // 데이터 상태
  const items = ref([]);
  const totalCount = ref(0);
  const searchQuery = ref('');

  // 검색 초기 카테고리 값 가져오기
  const getInitialCategory = () => {
    const searchType = route.query.s;
    if(!searchType) return '통합검색';

    const category = Object.entries(categoryMapping)
      .find(([key, value]) => value === searchType)?.[0];

    return category || '통합검색';
  };

  // 데이터 가져오기
  const fetchItems = async (page = 1) => {
    try {
      const params = {
        p: page,
        ...(searchQuery.value && { k: searchQuery.value }),
        ...(route.query.s && { s: route.query.s })
      };

      const queryString = new URLSearchParams(params).toString();
      
      const fullUrl = `${apiBase}/admin/${contentType}?${queryString}`;
      const responseData = await $fetch(fullUrl);

      // 응답 데이터의 키 이름이 contentType에 따라 다름
      const listKey = `${contentType}List`;
      items.value = responseData[listKey] || [];
      totalCount.value = responseData.totalCount || 0;

      paginationStore.setPagination({
        currentPage: page,
        totalPages: responseData.totalPages || 1,
        hasPrevPage: responseData.hasPrev || false,
        hasNextPage: paginationStore.hasNext || false
      });

    } catch(error) {
      console.error(`Error Fetching ${contentType} List: `, error);

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
    
    router.push({
      query: {
        p: page,
        ...(searchQuery.value && { k: searchQuery.value }),
        ...(route.query.s && { s: route.query.s })
      }
    });
    
    await fetchItems(page);
  }

  // 검색 핸들러
  const handleSearch = async (searchData) => {
    searchQuery.value = searchData.query;

    paginationStore.setPagination({
      currentPage: 1,
      totalPages: paginationStore.totalPages,
      hasPrevPage: false,
      hasNextPage: paginationStore.hasNextPage
    });

    router.push({
      query: {
        p: 1,
        ...(searchData.query ? { k: searchData.query } : {}),
        s: searchData.categoryCode || 'ALL'
      }
    });

    await fetchItems(1);
  };

  // 수정 페이지 이동
  const goToEditPage = (id) => {
    router.push(`/admin/contents/${contentType}/${id}/edit`);
  };

  //삭제 핻늘러
  const deleteHandler = async (id) => {
    if(confirm("게시물을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`${apiBase}/admin/${contentType}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if(!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }
        
        alert("게시물이 정상적으로 삭제되었습니다.");
        await fetchItems(currentPage.value);
      } catch(error) {
        console.error(`${contentType} 삭제 중 오류 발생:`, error);
        alert("게시물 삭제에 실패했습니다: " + error.message);
      }
    }
  };

  // 비공개 처리 핸들러
  const hiddenHandler = async (id) => {
    try {
      if(!confirm("해당 게시물의 공개 상태를 변경하시겠습니까?")) {
        return;
      }

      const url = `${apiBase}/admin/${contentType}/${id}/change-status`;

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
      await fetchItems(currentPage.value);
    
    } catch(error) {
      console.error(`${contentType} 공개 상태 변경 중 오류 발생: `, error);
      alert(`공개 상태 변경 중 오류 발생: ${error.message}`);
    }
  };

  // 초기화
  onMounted(async () => {
    searchQuery.value = route.query.k || '';
    const page = parseInt(route.query.p) || 1;

    await fetchItems(page);

    watch(() => route.query, async (newQuery) => {
      const newPage = parseInt(newQuery.p) || 1;
      searchQuery.value = newQuery.k || '';

      await fetchItems(newPage);
    }, {deep: true});
  });

  // 라우트 가드
  const beforeRouteUpdate = async (to, from, next) => {
    const newPage = parseInt(to.query.p) || 1;
    searchQuery.value = to.query.k || '';
    await fetchItems(newPage);
    next();
  };

  return {
    items,
    totalCount,
    totalPages,
    currentPage,
    hasPrevPage,
    hasNextPage,
    pages,
    searchQuery,
    getInitialCategory,
    fetchItems,
    changePage,
    handleSearch,
    goToEditPage,
    deleteHandler,
    hiddenHandler,
    beforeRouteUpdate
  };
}