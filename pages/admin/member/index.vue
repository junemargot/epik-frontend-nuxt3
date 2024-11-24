<template>
  <div class="main-wrap">
    <section class="board">
      <div class="board__header">
        <h1>회원 목록</h1>
        <!-- <p>총 가입자수 180명</p> -->
        <p>전체 회원수 : {{ totalCount }}명</p>
      </div>
      <div class="board__container">
        <div class="board__list">
          <div class="board__head">
            <div class="board__no">회원번호</div>
            <!-- <div class="board__type">가입유형</div> -->
            <div class="board__thumb">프로필사진</div>
            <div class="board__id">아이디</div>
            <div class="board__nickname">닉네임</div>
            <div class="board__joinDate">가입일</div>
            <!-- <div class="board__connDate">최근접속일</div> -->
            <div class="board__status">회원상태</div>
            <div class="board__management">계정관리</div>
          </div>
          <div class="board__body">
            <div class="board__content" v-for="(member, index) in members" :key="index" @click="toggleDetails(index)">
              <div class="board__no">{{ member.id }}</div>
              <!-- <div class="board__type">{{ getLoginTypeLabel(member.loginType) }}</div> -->
              <div class="board__thumb">
                <img :src="member.profileImage" alt="">
              </div>
              <div class="board__id">{{ member.username }}</div><!-- 아이디 -->
              <div class="board__nickname">{{ member.nickname }}</div>
              <div class="board__joinDate">{{ formatDate(member.joinDate) }}</div>
              <!-- <div class="board__connDate" :class="{'custom-connDate': true}">{{ member.lastAccess }}</div> -->
              <!-- <div class="board__connDate">
                <span class="date">{{ member.lastAccess.split(' ')[0] }}</span>
                <span class="time">{{ member.lastAccess.split(' ')[1] }}</span>
              </div> -->
              <div class="board__status">정상</div>
              <div class="board__management">
                <button class="delBtn" @click.stop="deleteAccount(member.id)">계정 삭제</button>
              </div>
              <!-- 아코디언으로 펼쳐질 내용 -->
              <div class="board__user-details" 
                  :style="{ display: isDetailsVisible(index) ? 'flex' : 'none' }">
                <div class="board__user-detail-section-left">
                  <!-- <div class="board__user-number">
                    <p><strong>회원 번호:</strong> {{ member.id }}</p>
                  </div> -->
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
                  <!-- <div class="board__user-type">
                    <p><strong>가입 유형:</strong>{{ getLoginTypeLabel(member.loginType) }}</p>
                  </div> -->
                  <div class="board__user-feed-count">
                    <p><strong>작성 피드:</strong> {{ member.writtenFeedCount }}</p>
                  </div>
                  <!-- <div class="board__user-report-count">
                    <p><strong>누적 신고수:</strong> {{ member.reportedCount }}</p>
                  </div> -->
                  <div class="board__user-status">
                    <!-- <p><strong>회원 상태:</strong> {{ member.status || '정상' }}</p> -->
                    <p><strong>회원 상태:</strong>정상</p>
                  </div>
                  <div class="board__user-signup-date">
                    <p><strong>가입일:</strong> {{ formatDate(member.joinDate) }}</p>
                  </div>
                  <!-- <div class="board__user-connection-date">
                    <p><strong>최근 접속일:</strong> {{ member.lastAccess }}</p>
                  </div> -->
                </div>
              </div><!-- board__user-details -->
            </div>
          </div> <!-- END BOARD BODY -->
        </div> <!-- END BOARD LIST-->
      </div>
      <!-- END BOARD CONTAINER -->

      <!-- PAGINATION / REGISTRATION -->
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
      </div>
      <!-- END PAGINATION -->
    </section>

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
    <!-- END SEARCH BAR -->
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useDataFetch } from '~/composables/useDataFetch';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase; // runtimeConfig.public에서 api를 가져옴 `${config.public.apiBase}`

// 회원 및 페이지네이션 상태 관리
const members = ref([]);
const totalCount = ref(0);

// 페이지네이션 상태 관리
const totalPages = ref(0);
const currentPage = ref(1);
const hasPrevPage = ref(false);
const hasNextPage = ref(false);
const pages = ref([]);

// 검색 관련 상태 관리
const categories = ['통합검색', '아이디 + 닉네임', '아이디', '닉네임']; // 검색 카테고리
const selectedCategory = ref('통합검색');
const inputPlaceholder = ref('검색어를 입력해주세요');
const searchQuery = ref('');
const isOpen = ref(false); // dropdown 상태

const categoryMapping = {
  '통합검색': 'ALL',
  '아이디 + 닉네임': 'USERNAME_NICKNAME',
  '아이디': 'ID',
  '닉네임': 'NICKNAME'
};


// const getLoginTypeLabel = (loginType) => {
//   switch(loginType) {
//     case 'ID': return '아이디';
//     case 'NAVER': return '네이버';
//     case 'KAKAO': return '카카오';
//     case 'GOOGLE': return '구글';
//     default: return '알 수 없음';
//   }
// }

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);

  // 공백 제거 및 점 삭제 ("2024. 11. 03." -> "2024.11.03")
  return formattedDate.replace(/\s/g, '').replace(/\.$/, '')
};


const fetchMembers = async (page = 1) => {
  const pageNumber = page;
  
  const { data, error } = await useFetch('/admin/member', {
    baseURL: apiBase || 'http://localhost:8080/api/v1',
    params: {
      p: pageNumber,
      k: searchQuery.value,
      s: categoryMapping[selectedCategory.value] || 'ALL'
    },
    cache: false,
    key: `members-page-${page}`,
    // credentials: 'include',
    onResponse({ response }) {
      console.log("SERVER RAW RESPONSE: ", response._data);
    }
  });

  if(error.value) {
    console.error("페치 에러: ", error.value);
  }

  if(data.value) {
    const responseData = data.value;
    console.log('API 응답: ', data.value);
    
    members.value = responseData.memberList || [];
    totalCount.value = responseData.totalCount || 0;
    totalPages.value = responseData.totalPages || 0;
    hasPrevPage.value = responseData.hasPrev || false;
    hasNextPage.value = responseData.hasNext || false;
    pages.value = responseData.pages || [];

    console.log("MEMBER LIST: ", members.value);

    // 페이지 번호 계산
    const rangeStart = Math.max(1, page - 2);
    const rangeEnd = Math.min(totalPages.value, page + 2);
    pages.value = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);

    currentPage.value = page;
  } else {
    console.warn("NO DATA RECEIVED");
  }

  console.log("server response data:", responseData);

};


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

onMounted(() => {
  fetchMembers();
});


const visibleDetailsIndex = ref(null);

// 아코디언 세부 정보 토글 함수
const toggleDetails = (index) => {
  visibleDetailsIndex.value = visibleDetailsIndex.value === index ? null : index;
};

// 세부 정보 표시 여부 확인 함수
const isDetailsVisible = computed(() => (index) => visibleDetailsIndex.value === index);


// 페이지 이동 핸들러
const changePage = async (page) => {
  if (page < 1 || page > totalPages.value) {
    console.warn("INVALID PAGE NUMBER:", page);
    return;
  }

  console.log(`Changing to page: ${page}`); // 페이지 디버깅
  await fetchMembers(page);
  console.log("Current Page Data: ", members.value);
};





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
  } else if(category === '아이디') {
    inputPlaceholder.value = `검색할 ${category}를 입력해주세요`;
  } else if(category === '닉네임'){
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
  } else {
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
  }
};

const performSearch = async () => {
  currentPage.value = 1;

  await fetchMembers();
  router.push({ 
    query: { 
      k: searchQuery.value, 
      s: categoryMapping[selectedCategory.value] 
    }
  });
}

// 클릭 외부 영역 처리
const handleClickOutside = (e) => {
  if (!e.target.closest('.search')) {
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
@import url('/public/css/admin/member/index.css');
</style>