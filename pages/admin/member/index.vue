<template>
  <div class="main-wrap">
    <section class="board">
      <div class="board__header">
        <h1>회원 목록</h1>
        <p>전체 회원수 {{ totalCount }}명</p>
      </div>
      <div class="board__container">
        <div class="board__list">
          <div class="board__head">
            <div class="board__no">회원번호</div>
            <div class="board__type">가입유형</div>
            <div class="board__thumb">프로필사진</div>
            <div class="board__id">아이디</div>
            <div class="board__nickname">닉네임</div>
            <div class="board__joinDate">가입일</div>
            <div class="board__status">회원상태</div>
            <div class="board__management">계정관리</div>
          </div>
          <div class="board__body">
            <div class="board__content" v-for="(member, index) in members" :key="index" @click="toggleDetails(index)">
              <div class="board__no">{{ member.id }}</div>
              <div class="board__type">{{ getLoginTypeLabel(member.loginType) }}</div>
              <div class="board__thumb">
                <img :src="getFullImageUrl(member.profileImg)" alt="프로필이미지" />
              </div>
              <div class="board__id">{{ member.username }}</div><!-- 아이디 -->
              <div class="board__nickname">{{ member.nickname }}</div>
              <div class="board__joinDate">{{ formatDate(member.joinDate) }}</div>
              <div class="board__status">정상</div>
              <div class="board__management">
                <button class="delBtn" @click.stop="deleteAccount(member.id)">계정 삭제</button>
              </div>
              <!-- 아코디언으로 펼쳐질 내용 -->
              <div class="board__user-details" :style="{ display: isDetailsVisible(index) ? 'flex' : 'none' }">
                <div class="board__user-detail-section-left">
                  <div class="board__user-number">
                    <p><strong>회원 번호:</strong> {{ member.id }}</p>
                  </div>
                  <div class="board__user-id">
                    <p><strong>회원 아이디:</strong> {{ member.username }}</p>
                  </div>
                  <div class="board__user-email">
                    <p><strong>이메일:</strong> {{ member.email }}</p>
                  </div>
                  <div class="board__user-nickname">
                    <p><strong>닉네임:</strong> {{ member.nickname }}</p>
                  </div>
                </div>
                <div class="board__user-detail-section-right">
                  <div class="board__user-type">
                    <p><strong>가입 유형:</strong>{{ getLoginTypeLabel(member.loginType) }}</p>
                  </div>
                  <!-- <div class="board__user-feed-count">
                    <p><strong>작성 피드:</strong> {{ member.writtenFeedCount }}</p>
                  </div> -->
                  <!-- <div class="board__user-report-count">
                    <p><strong>누적 신고수:</strong> {{ member.reportedCount }}</p>
                  </div> -->
                  <div class="board__user-status">
                    <p><strong>회원 상태:</strong>정상</p>
                  </div>
                  <div class="board__user-signup-date">
                    <p><strong>가입일:</strong> {{ formatDate(member.joinDate) }}</p>
                  </div>
                  <div class="board__user-connection-date">
                    <p><strong>최근 접속일:</strong> {{ formatDateTime(member.lastAccess) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END BOARD CONTAINER -->
      <!-- PAGINATION -->
      <div class="pagination-registration-container">
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          :has-prev-page="currentPage > 1"
          :has-next-page="currentPage < totalPages"
          :visible-pages="pages"
          @page-change="changePage"
        />
      </div>
    </section>
  </div>
  <!-- SEARCH BAR -->
  <SearchBar
    :initial-category="getInitialCategory()"
    :initial-query="searchQuery"
    @search="handleSearch"
  />
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

// API 기본 URL 설정
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 회원 데이터 및 페이지네이션 상태 관리
const members = ref([]);
const totalCount = ref(0);
const searchQuery = ref('');

const getMemberStatusText = (status) => {
  if(status === 1) return '정상회원';
  if(status === 2) return '탈퇴회원'; 
  if(status === 3) return '강퇴회원';
  return '알 수 없음';
}

const getLoginTypeLabel = (loginType) => {
  // loginType이 객체인 경우
  if(typeof loginType === 'object' && loginType !== null) {
    return loginType.description || loginType.name || '알 수 없음';
  }

  // loginType이 문자열인 경우 기존 로직 사용
  switch(loginType) {
    case 'ID': return '아이디';
    case 'NAVER': return '네이버';
    case 'KAKAO': return '카카오';
    case 'GOOGLE': return '구글';
    default: return '알 수 없음';
  }
}

// 검색 초기 카테고리 값 가져오기
const getInitialCategory = () => {
  const searchType = route.query.s;
  if(!searchType) return '통합검색';

  // searchType 파라미터 값에 따라 적절한 카테고리 반환
  const category = Object.entries(categoryMapping)
    .find(([key, value]) => value === searchType)?.[0];

  return category || '통합검색';
};

// 회원 목록 조회
const fetchMembers = async (page = 1) => {
  try {
    const params = {
      p: page,
      ...(searchQuery.value && { k: searchQuery.value }),
      ...(route.query.s && { s: route.query.s })
    };

    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${apiBase}/admin/member?${queryString}`;
    console.log("[REQUEST URL]: ", fullUrl);

    // API 요청
    const responseData = await $fetch(fullUrl);
    console.log("[API 응답 전체]: ", responseData);

    members.value = responseData.memberList || [];
    totalCount.value = responseData.totalCount || 0;

    // Pinia 스토어 업데이트
    paginationStore.setPagination({
      currentPage: page,
      totalPages: responseData.totalPages || 1, // API 응답 데이터 반영
      hasPrevPage: responseData.hasPrev || false,
      hasNextPage: responseData.hasNext || false
    });
  } catch(error) {
    console.error("Error Fetching Member List: ", error);

    if(error.message) {
      console.error("Error Response: ", await error.response.text());
    }

    paginationStore.setPagination({
      currentPage: page,
      totalPages: 1,
      hasPrevPage: false,
      hasNextPage: false
    });
  };
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
  await fetchMembers(page);
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

  await fetchMembers(1);
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);

  // 공백 제거 및 점 삭제 ("2024. 11. 03." -> "2024.11.03")
  return formattedDate.replace(/\s/g, '').replace(/\.$/, '')
};

const formatDateTime = (dateString) => {
  if(!dateString) return '';

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 프로필 이미지 url 생성 함수
const getFullImageUrl = (imagePath) => {
  // URL 형식인지 확인
  if(typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath; // 이미 URL이면 그대로 반환
  }

  // 아니면 서버 경로와 결합
  return `${apiBase}/${imagePath}`;
}

// 계정 삭제
const deleteAccount = async (id) => {
  if (confirm("정말로 이 계정을 삭제하시겠습니까?")) {
    try {
      const response = await useDataFetch(`admin/member/${id}`, {
        method: 'DELETE'
      });

      if (response && response._data !== undefined) {
        alert("계정이 성공적으로 삭제되었습니다.");
        // 목록에서 삭제된 회원 제거
        members.value = members.value.filter(member => member.id !== id);
        // 총 회원 수 업데이트
        // totalCount.value--;
      } else {
        throw new Error("삭제 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error('계정 삭제 중 오류 발생:', error);
      alert("계정 삭제 중 오류가 발생했습니다: " + error.message);
    }
  }
};

// route 변경 감지
const watchRouteQuery = () => {
  const newPage = parseInt(route.query.p) || 1;
  const newSearchQuery = route.query.k || '';
  const newSearchType = route.query.s || '';

  paginationStore.currentPage = newPage;
  searchQuery.value = newSearchQuery;
  fetchMembers(newPage);
}


onMounted(() => {
  const storeMembers = localStorage.getItem('cachedMembers');
  if(storeMembers) {
    // 캐시된 데이터가 있으면 복원
    const cachedData = JSON.parse(storeMembers);
    members.value = cachedData.member;
    totalCount.value = cachedData.totalCount;
  
  } else {
    fetchMembers();    
  }
});

// onMounted 시 초기 데이터 로드
onMounted(async () => {
  // 초기 검색어 설정
  searchQuery.value = route.query.k || '';

  // 페이지 번호 설정
  const page = parseInt(route.query.p) || 1;

  // 초기 데이터 로드
  await fetchMembers(page);

  // 라우드 변경 감지
  watch(() => route.query, async (newQuery) => {
    const newPage = parseInt(newQuery.p) || 1;
    searchQuery.value = newQuery.k || '';

    await fetchMembers(newPage);
  }, {deep: true});
});

// beforeRouteUpdate 가드
const beforeRouteUpdate = async (to, from, next) => {
  await watchRouteQuery();
  next();
};
defineExpose({ beforeRouteUpdate });

const visibleDetailsIndex = ref(null);

// 아코디언 세부 정보 토글 함수
const toggleDetails = (index) => {
  visibleDetailsIndex.value = visibleDetailsIndex.value === index ? null : index;
};

// 세부 정보 표시 여부 확인 함수
const isDetailsVisible = computed(() => (index) => visibleDetailsIndex.value === index);

</script>

<style lang="css" scoped>
@import url('/public/css/admin/member/index.css');
</style>