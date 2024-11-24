<!-- 사용자 공지사항 목록 화면 -->
<template>
  <!-- 공지사항 전체 영역 -->
  <div class="notice__wrap">
    <!-- 공지사항 제목 자리 -->
    <div class="notice__title">
      <h2>공지사항</h2>
    </div>
    <!-- 공지사항 항목 바인딩 -->
    <table class="notice__table">
      <thead class="notice__table-head">
        <tr class="notice__table-head-row">
          <th class="notice__table-number">번호</th>
          <th class="notice__table-title">제목</th>
          <th class="notice__table-author">작성자</th>
          <th class="notice__table-date">작성일</th>
        </tr>
      </thead>
      <!-- 공지사항 내용 -->
      <tbody class="notice__table-body">
        <tr v-for="(notice, index) in notices" :key="index" class="notice__table-row">
          <td>{{ notice.id }}</td>
          <td class="notice__table-title">
            <RouterLink :to="`/notice/${notice.id}`">{{ notice.title }}</RouterLink>
          </td>
          <td>{{ notice.writer }}</td>
          <td>{{ formatDate(notice.writeDate) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- PAGINATION -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <button type="button" class="page-btn start-page" @click="changePage(1)" :disabled="currentPage === 1">
          <i class='bx bx-chevrons-left'></i>
        </button>
        <button type="button" class="page-btn prev-page" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          <i class='bx bx-chevron-left'></i>
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page" 
          type="button" 
          class="page-btn" 
          :class="{ active: page === currentPage }" 
          @click="changePage(page)">
          {{ page }}
        </button>
        <button type="button" class="page-btn next-page" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
          <i class='bx bx-chevron-right'></i>
        </button>
        <button type="button" class="page-btn end-page" @click="changePage(totalPages)" :disabled="currentPage === totalPages">
          <i class='bx bx-chevrons-right'></i>
        </button>
      </div>
    </div>
    <!-- END PAGINATION -->

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
        </div>
      </div> -->
      <!-- END PAGINATION -->
    <!-- <div class="pagination">
      <a href="#" class="pagination__prev"><i class="fa-solid fa-angle-left"></i></a>
      <ul class="pagination__list">
      </ul>
      <a href="#" class="pagination__next"><i class="fa-solid fa-angle-right"></i></a>
    </div> -->
  </div><!--end 공지사항 전체 영역 -->
</template>

<script setup>
import { ref } from 'vue';

// 공지사항 리스트 저장
const notices = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

// 런타임 환경 변수 가져오기
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 서버에서 공지사항 가져오기
const fetchNotices = async (page) => {
  const { data, error } = await useFetch(`/notice?&p=${page}`, {
    baseURL: apiBase || 'http://localhost:8081/api/v1'
  });

  if(data.value) {
  console.log("받아온 데이터 구조: ", data.value);
  notices.value = data.value.noticeList || [];
  totalPages.value = data.value.totalPages || 1; // 서버에서 전달받은 총 페이지 수
  
  // notices.value = JSON.parse(JSON.stringify(data.value));
  } else if(error.value) {
    console.error("공지사항 데이터를 불러오는 중 에러 발생:", error.value);
  }
};

// 초기 공지사항 목록 가져오기
fetchNotices(currentPage.value);

// 페이지 변경 함수
const changePage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  currentPage.value = page;
  fetchNotices(currentPage.value);
};



// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);

  // 공백 제거 및 점 삭제 ("2024. 11. 03." -> "2024.11.03")
  return formattedDate.replace(/\s/g, '').replace(/\.$/, '')
};




</script>

<style scoped>
.notice__wrap {
  width: 858px;
  margin: 0 auto;
  min-height: calc(100vh - 150px);
  box-sizing: border-box;
  margin-bottom: 20px;
}

/* 공지사항 제목 영역 */
.notice__title {
  margin-top: 38px;
}

.notice__title h2 {
  font-family: 'pretendard-semibold';
  font-size: 26px;
}

/* 공지사항 항목 영역*/
.notice__table {
  width: 100%;
  table-layout: fixed;
  margin-top: 20px;
  font-family: 'pretendard-regular';
  font-size: 15px;
  min-height: 400px;
  margin-bottom: 20px;
}

/* 공지사항 항목 없을 경우를 대비한 빈 테이블 스타일 */
.notice__table-body:empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px; /* 빈 상태에서도 일정한 높이 유지 */
  color: #aaa;
  font-size: 16px;
}

.notice__table-head-row {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.notice__table-head-row th,
.notice__table-row td {
  padding: 15px;
}

.notice__table-row td {
  text-align: center;
  border-bottom: 1px solid #cfcfcf;
}

.notice__table-row .notice__table-title {
  text-align: left;
}

.notice__table-number {
  width: 10%;
}

.notice__table-title {
  width: 55%;
}

.notice__table-title:hover {
  text-decoration: underline;
}

.notice__table-author {
  width: 10%;
}

.notice__table-date {
  width: 20%;
}

/* PAGINATION */
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.pagination {
  display: flex;
  padding: 25px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: 4px;
  flex-grow: 1; /* 가운데 배치를 위해 공간 확장 */
}

.pagination button {
  background: none;
  appearance: none;
  -webkit-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  border: none;
  cursor: pointer;
}

.pagination button i {
  color: var(--black);
  font-size: 18px;
}

.pagination .page-btn {
  background: var(--white);
  color: var(--black);
  height: 36px;
  border: 1px solid var(--color-grey-6);
  border-radius: var(--border-1);
  padding: 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: background 0.3s ease;
}

.pagination .page-btn:not([class$="-page"]) {
  width: 36px;
}

.page-btn[class$="-page"] {
  background-color: var(--white);
  font-size: 10px;
  font-weight: 600;
}

.page-btn.active {
  background: var(--color-grey-8);
  color: var(--white);
}

.page-btn[disabled] {
  opacity: 0.3;
}


</style>