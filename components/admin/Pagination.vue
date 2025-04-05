<template>
  <div class="pagination-wrapper">
    <div class="pagination">
      <button 
        type="button" 
        class="page-btn start-page" 
        @click.prevent="handlePageChange(1)"
        :disabled="!hasPrevPage"
      >
        <i class="bx bx-chevrons-left"></i>
      </button>
      <button 
        type="button" 
        class="page-btn prev-page" 
        @click.prevent="handlePageChange(currentPage - 1)"
        :disabled="!hasPrevPage"
      >
        <i class="bx bx-chevron-left"></i>
      </button>
      <button 
        v-for="page in visiblePages" 
        :key="page" 
        type="button"
        class="page-btn"
        :class="{ active: currentPage === page }" 
        @click.prevent="handlePageChange(page)"
      >
        {{ page }}
      </button>
      <button 
        type="button" 
        class="page-btn next-page" 
        @click.prevent="handlePageChange(currentPage + 1)"
        :disabled="!hasNextPage"
      >
        <i class="bx bx-chevron-right"></i>
      </button>
      <button 
        type="button"
        class="page-btn end-page" 
        @click.prevent="handlePageChange(totalPages)"
        :disabled="!hasNextPage"
      >
        <i class="bx bx-chevrons-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// props: 부모로부터 전달받은 데이터
const props = defineProps({
  currentPage: { type: Number, required: true },  // 현재 페이지 번호
  totalPages: {type: Number, required: true },    // 전체 페이지 수
  hasPrevPage: { type: Boolean, required: true }, // 이전 페이지 존재 여부
  hasNextPage: { type: Boolean, required: true }, // 다음 페이지 존재 여부
  visiblePages: { type: Array, required: true }   // 표시할 페이지 번호 배열
});

// emits: 부모 컴포넌트로 전달할 이벤트
const emit = defineEmits(['page-change']);

// 페이지 변경 이벤트 핸들러
const handlePageChange = (page) => {
  emit('page-change', page); // 부모 컴포넌트에 변경된 페이지 번호 전달
};

</script>

<style scoped>
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
  flex-grow: 1;
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
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-grey-6);
  border-radius: var(--radius-2);
  padding: 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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