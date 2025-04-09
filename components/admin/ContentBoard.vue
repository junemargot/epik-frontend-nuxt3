<template>
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
        <RouterLink to="/admin/contents/concert/new">
          <button type="button">등록</button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { usePaginationStore } from '~/stores/pagination';
import Pagination from '~/components/admin/Pagination.vue';

// Pinia 스토어 사용
const paginationStore = usePaginationStore();

// Pagination 관련 computed 속성
const currentPage = computed(() => paginationStore.currentPage);
const totalPages = computed(() => paginationStore.totalPages);
const hasPrevPage = computed(() => paginationStore.hasPrevPage);
const hasNextPage = computed(() => paginationStore.hasNextPage);
const visiblePages = computed(() => paginationStore.visiblePages);

const props = defineProps({
  title: { type: String, required: true },
  postCount: { type: Number, required: true },
  items: { type: Array, required: true },
  contentType: { type: String, required: true }
});

// 이벤트 정의
const emit = defineEmits(['edit', 'delete', 'hidden', 'page-change'])

// 상세 페이지 URL 생성
const detailUrl = (id) => {
  return `/admin/contents/${props.contentType}/${id}`;
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if(!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '.').replace(/\.$/, '');
};

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  emit('page-change', page);
};


</script>

<style lang="css" scoped>
/* 보드 전체 스타일 */
.board {
  width: 95%;
  padding: 10px 0 0 300px;
}

.board .board__header {
  display: flex;
  margin: 20px 0 15px 5px;
}

.board .board__header h1 {
  font-size: 22px;
  font-weight: 600;
}

.board .board__header p {
  margin: 9px 0 0 8px;
  font-size: 12px;
}

/* 리스트 영역 */
.board__list {
  border-top: 2px solid var(--black);
}

.board__list .board__body {
  border-bottom: 1px solid var(--black);
}

.board__head {
  padding: 10px 0;
  border-bottom: 1px solid var(--black);
  font-weight: 600;
  pointer-events: none;
}

.board__head,
.board__body .board__content {
  font-size: 0;
  padding: 8px 0;
}

.board__head > div,
.board__body .board__content > div {
  display: inline-block;
  font-size: 14px;
  text-align: center;
}

.board__list .board__content {
  border-bottom: 1px solid var(--color-grey-3);
}

.board__list .board__no {
  width: 7%;
}

.board__list .board__title {
  width: 45%;
  text-align: left;
}

.board__list .board__title:hover {
  cursor: pointer;
  text-decoration: underline;
}

.board__list .board__writer {
  width: 10%;
}

.board__list .board__regDate {
  width: 10%;
}

.board__list .board__viewCnt {
  width: 7%;
}

.board__list .board__management {
  width: 21%;
}

.board__body .board__management .hiddenBtn,
.board__body .board__management .modifyBtn,
.board__body .board__management .deleteBtn {
  margin-right: 5px;
  background: var(--white);
  padding: 5px 12px;
  border: 1px solid var(--black);
  border-radius: 3px;
  cursor: pointer;
}

.board__body .board__management .hiddenBtn:hover,
.board__body .board__management .modifyBtn:hover,
.board__body .board__management .deleteBtn:hover {
  border: 1px solid var(--accent-1);
  color: var(--accent-1);
}

.board__body .board__management .deleteBtn {
  margin-right: 0;
}

/* 페이지네이션 및 등록 버튼 영역 */
.pagination-registration-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 10px 0;
  position: relative;
}

.pagination-registration-container .pagination-wrapper {
  flex-grow: 1;
  padding-right: 0;
}

.registration {
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.registration button {
  background-color: var(--white);
  color: var(--black);
  height: 36px;
  padding: 0 20px;
  border-radius: var(--radius-2);
  border: 1px solid var(--color-grey-6);
  cursor: pointer;
}

.registration button:hover {
  background-color: var(--color-grey-8);
  color: var(--white);
}
</style>