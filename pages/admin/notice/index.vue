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
      <div class="pagination-wrapper">
        <div class="pagination">
          <button type="button" class="page-btn start-page" :disabled="currentPage === 1" 
            @click.prevent.stop="changePage(1)">
            <i class='bx bx-chevrons-left'></i>
          </button>

          <button type="button" class="page-btn prev-page" :disabled="currentPage === 1"
            @click.prevent.stop="changePage(currentPage - 1)">
            <i class='bx bx-chevron-left'></i>
          </button>

          <button type="button" class="page-btn" v-for="page in pages" :key="page"
            :class="{ active: page === currentPage }" @click.prevent.stop="changePage(page)">
            {{ page }}
          </button>

          <button type="button" class="page-btn next-page" :disabled="currentPage === totalPages"
            @click.prevent.stop="changePage(currentPage + 1)">
            <i class='bx bx-chevron-right'></i>
          </button>

          <button type="button" class="page-btn end-page" :disabled="currentPage === totalPages"
            @click.prevent.stop="changePage(totalPages)">
            <i class='bx bx-chevrons-right'></i>
          </button>
        </div>
        <!-- <div class="pagination" v-if="pages.length > 0">
          <button v-for="page in pages" :key="page" :class="{ active: currentPage === page }" @click="changePage(page)">
            {{ page }}
          </button>
        </div> -->
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
  <section class="search">
    <div class="search__bar">
      <div class="search__dropdown">
        <div id="drop-text" class="search__text" @click="toggleDropdown">
          <span id="span">{{ selectedCategory }}</span>
          <i id="icon" class='bx bx-chevron-down'
            :style="{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }"></i>
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
import { ref, onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { useFetch } from '#app';
import { useNoticeFetch } from '~/composables/useNoticeFetch'; // composable 가져오기
import { parse } from 'vue/compiler-sfc';

// const { $api } = useNuxtApp();
const router = useRouter();
const { fetchNotices, fetchNoticeDelete } = useNoticeFetch(); // 컴포저블에서 가져온 함수

// 상태 관리
const notices = ref([]);    // 공지사항 목록
const totalCount = ref(0);  // 게시물 총 개수
const totalPages = ref(0);  // 전체 페이지 수
const currentPage = ref(1); // 현재 페이지
const pages = ref([]);      // 표시할 페이지 번호 목록

// 검색 관련 상태 관리
// 검색 기능
const categories = ['통합검색', '제목', '내용', '작성자']; // 검색 카테고리
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

// API 요청 URL 설정
const config = useRuntimeConfig();        // 현재 런타임 환경 설정 가져오기
const apiBase = config.public.apiBase;    // 공용 API 기본 URL 가져오기

// 공지사항 목록 fetch
// const { data, error } = await useFetch('/admin/notice', {
//     baseURL: apiBase || 'http://localhost:8080/api/v1',
//     params: { 
//       p: currentPage.value,
//       k: searchQuery.value,
//       s: categoryMapping[selectedCategory.value] || 'ALL'
//     }
//   });

  
//   const notices = ref(data.value?.noticeList || []);
//   const totalCount = ref(data.value?.totalCount || 0);
  
//   // 데이터 받아오기
// watchEffect(() => {
//   if (data.value) {
//     notices.value = data.value.noticeList || [];
//     totalCount.value = data.value.totalCount || 0;
//     totalPages.value = data.value.totalPages || 0;
//     pages.value = Array.from({ length: totalPages.value }, (_, i) => i + 1); // 페이지 번호 리스트 생성
//   }
// }); -- 여기까지 목록은 새로고침시에도 잘 나옴. 페이지네이션 반응 없음.


// -- 22 페이징 여전히 안됨. 목록 새로고침 잘됨.
// 공지사항 데이터 로드 함수
// const loadNotices = async () => { // useFetch를 사용하여 비동기적으로 데이터 가져오기
//   // 로컬 스토리지에서 데이터 가져오기
//   const storedNotices = localStorage.getItem('notices');
  
//   try {
//     if(storedNotices) { 
//       const parsedNotices = JSON.parse(storedNotices); // 로컬 스토리지에 저장된 데이터가 있으면 사용

//       if(Array.isArray(parsedNotices)) {
//         notices.value = parsedNotices;

//         return; // 데이터가 이미 로드되었으므로 api 호출을 하지 않음.
//       }
//     }  
//   } catch(err) {
//     console.error("로컬 스토리지 데이터 파싱 실패:", err);
//   }

//   // 로컬 스토리지에 유효한 데이터가 없으면 api 호출
//   const { data, error } = await useFetch('/admin/notice', {
//     baseURL: apiBase || 'http://localhost:8080/api/v1', // API 기본 URL이 설정되지 않으면 로컬 URL 사용
//     params: {
//       p: currentPage.value,  // 현재 페이지 번호
//       k: searchQuery.value,  // 검색 쿼리
//       s: categoryMapping[selectedCategory.value] || 'ALL'  // 선택된 카테고리에 따라 필터링, 없으면 ALL
//     }
//   });

//   if (error.value) {
// 	  // API 호출 중 오류가 발생한 경우
//     console.error("API 호출 실패:", error.value); // 오류 메세지 콘솔 출력
//     return; // 함수 종료
//   }

//   console.log("API 응답 데이터:", data.value);  // 응답 데이터 확인

//   if (data.value) { // 응답 데이터가 존재하는 경우
//     notices.value = data.value.noticeList || [];  // 공지사항 목록을 notices 변수에 저장, 없으면 빈 배열로 초기화
//     totalCount.value = data.value.totalCount || 0;  // 전체 공지사항 개수를 totalCount 변수에 저장, 없으면 0으로 초기화
//     totalPages.value = data.value.totalPages || 0;  // 전체 페이지 수를 totalPages 변수에 저장, 없으면 0으로 초기화
//     pages.value = data.value.pages || [];  // 페이지 정보를 pages 변수에 저장, 없으면 빈 배열로 초기화
  
//     // 데이터를 로컬 스토리지에 저장
//     localStorage.setItem('notices', JSON.stringify(notices.value));

//   } else {
//     notices.value = [];
//     totalCount.value = 0;
//     totalPages.value = 0;
//     console.error("API 응답이 비어있거나 데이터가 없습니다."); // 응답데이터가 없을 경우 콘솔 메세지 출력
//   }
// };

const resetSearch = () => {
  searchQuery.value = '';
  selectedCategory.value = '통합검색';
  currentPage.value = 1;
};

onMounted(async () => {
  // URL 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const hasSearchParams = urlParams.has('k') || urlParams.has('s');

  if (hasSearchParams) {
    // URL에 검색 파라미터가 있으면 제거
    router.replace({ query: {} });
  }

  // 로컬 스토리지에서 검색 관련 데이터 제거
  localStorage.removeItem('searchQuery');
  localStorage.removeItem('selectedCategory');

  // 검색 상태 초기화
  resetSearch();

  // 데이터 로드
  await loadNotices();
});


// 222
// 데이터 로드 함수
const loadNotices = async () => {
  const { data, error } = await useFetch('/admin/notice', {
    baseURL: apiBase || 'http://localhost:8080/api/v1',
    params: {
      p: currentPage.value,
      k: searchQuery.value,
      s: categoryMapping[selectedCategory.value] || 'ALL',
    },
  });

  if (error.value) {
    console.error("API 호출 실패:", error.value);
    return;
  }

  if (data.value) {
    notices.value = data.value.noticeList || [];
    totalCount.value = data.value?.totalCount || 0;
    totalPages.value = data.value.totalPages || 0;
    totalCount.value = data.value.totalCount || 0; // 데이터 반영

    // 페이지 번호 갱신
    pages.value = Array.from({ length: totalPages.value }, (_, i) => i + 1);

    // 로컬 스토리지 업데이트
    localStorage.setItem('notices', JSON.stringify(notices.value));
    localStorage.setItem('currentPage', JSON.stringify(currentPage.value));
    localStorage.setItem('totalPages', JSON.stringify(totalPages.value));
    localStorage.setItem('pages', JSON.stringify(pages.value));
    localStorage.setItem('totalCount', JSON.stringify(totalCount.value)); // 저장

    console.log("API 데이터 로드 후 로컬 스토리지 업데이트 완료.");
  }
};


// 상태 변경 시 로컬 스토리지 업데이트
watch([notices, currentPage, totalPages, pages], () => {
  localStorage.setItem('notices', JSON.stringify(notices.value));
  localStorage.setItem('currentPage', JSON.stringify(currentPage.value));
  localStorage.setItem('totalPages', JSON.stringify(totalPages.value));
  localStorage.setItem('pages', JSON.stringify(pages.value));
  console.log("로컬 스토리지 업데이트 완료.");
});

watchEffect(() => {
  console.log("현재 totalCount:", totalCount.value);
});



// notices, totalCount, totalPages의 변화를 감지해 loadNotices 함수를 호출하는 watcher 설정
// watch([notices, totalCount, totalPages], () => {
//   console.log('공지사항 데이터가 업데이트되었습니다:', notices.value); // 공지사항 데이터가 업데이트되었음을 콘솔에 출력
// 	loadNotices(); // 공지사항 데이터를 다시 로드함. 함수 호출
// });

// 페이지 변경 핸들러
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page; // 현재 페이지 업데이트
    loadNotices(); // 데이터 다시 로드
  }
};

// watch(currentPage, async (newPage, oldPage) => {
//   if (newPage !== oldPage) {
//     console.log(`페이지가 ${oldPage}에서 ${newPage}로 변경되었습니다.`);
//     await loadNotices(); // 페이지 변경 시 데이터 다시 로드
//   }
// });

watch(currentPage, async () => {
  await loadNotices();
});


// 검색 실행 함수
const performSearch = async () => {
  currentPage.value = 1; // 검색 시 첫 페이지로 리셋

  await loadNotices();
  // URL 업데이트 (옵션)
  router.push({ query: { k: searchQuery.value, s: categoryMapping[selectedCategory.value] } });
};

// 카테고리 선택 함수
const selectCategory = (category) => {
  selectedCategory.value = category;
  updatePlaceholder(category);
  isOpen.value = false;
  // currentPage.value = 1;

  // loadNotices();
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);

  // 공백 제거 및 점 삭제 ("2024. 11. 03." -> "2024.11.03")
  return formattedDate.replace(/\s/g, '').replace(/\.$/, '')
};

// 검색 - 드롭다운
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};


// 검색 - placeholder update
const updatePlaceholder = (category) => {
  if (category === '통합검색') {
    inputPlaceholder.value = '검색어를 입력해주세요';
  } else if (category === '작성자') {
    inputPlaceholder.value = `검색할 ${category}를 입력해주세요`;
  } else {
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
  }
};

// 검색 - 외부 영역 처리
const handleClickOutside = (e) => {
  if (!e.target.closest('.search')) {
    isOpen.value = false;
  }
};

// 페이지 로드 시 외부 클릭 이벤트 리스너
onMounted(async () => {
  window.addEventListener('click', handleClickOutside);
  await loadNotices();
});

onMounted(async () => {
  const storedNotices = JSON.parse(localStorage.getItem('notices'));
  const storedPage = JSON.parse(localStorage.getItem('currentPage'));
  const storedTotalPages = JSON.parse(localStorage.getItem('totalPages'));
  const storedPages = JSON.parse(localStorage.getItem('pages'));
  const storedTotalCount = JSON.parse(localStorage.getItem('totalCount')); // 추가

  if (storedNotices && storedPage && storedTotalPages && storedPages && storedTotalCount) {
    // 로컬 스토리지에 데이터가 있다면 복원
    notices.value = storedNotices;
    currentPage.value = storedPage;
    totalPages.value = storedTotalPages;
    pages.value = storedPages;
    totalCount.value = storedTotalCount;
    console.log("로컬 스토리지에서 데이터 복구 완료.");
  } else {
    // 로컬 스토리지에 데이터가 없으면 API 호출
    console.log("로컬 스토리지에 데이터 없음. API 호출 시작.");
    await loadNotices();
  }
});


// 페이지 언마운트 시 외부 클릭 이벤트 리스너 제거
onUnmounted(async () => {
  window.removeEventListener('click', handleClickOutside);
  await loadNotices();
});

// 페이지 변경 시 데이터 로드
watch(totalPages,(newTotalPages) => {
  console.log("전체 페이지 수: ", newTotalPages);
});

watch(totalCount, (newValue) => {
  console.log("totalCount 업데이트됨:", newValue);
})



// 비공개처리 핸들러 - 아직 구현 전
const hiddenHandler = (id) => {

}


// 수정 버튼 이벤트
const goToEditPage = (id) => {
  router.push(`/admin/notice/${id}/edit`); // 동적으로 id를 사용하여 라우팅
  // router.push('/admin/notice/15/edit'); // 하드코딩
};

// 삭제 핸들러
// const deleteHandler = async (id) => {
//   if (confirm("선택하신 게시물을 삭제하시겠습니까?")) {
//     try {
//       await fetchNoticeDelete(id);
//       alert("공지사항이 정상적으로 삭제되었습니다.");
//       // await fetchNotices(); // 목록 새로고침 — 고치기

//     } catch (error) {
//       alert("공지사항 삭제에 실패했습니다: " + error.message);
//     }
//   }
// };


const deleteHandler = async (id) => {
  if (confirm("선택하신 게시물을 삭제하시겠습니까?")) {
    try {
      await fetchNoticeDelete(id);
      alert("공지사항이 정상적으로 삭제되었습니다.");
      await loadNotices(); // 목록 새로고침
    } catch (error) {
      alert("공지사항 삭제에 실패했습니다: " + error.message);
    }
  }
};



</script>

<style lang="css" scoped>
@import url('/public/css/admin/notice/index.css');
</style>