<template>
  <div class="pagination-wrapper">
    <div class="pagination">
      <button 
        type="button" 
        class="page-btn start-page" 
        :disabled="!hasPrevPage"
        @click="$emit('page-changed', 1)"
      >
        <i class="bx bx-chevrons-left"></i>
      </button>
      <button 
        type="button" 
        class="page-btn prev-page" 
        :disabled="!hasPrevPage"
        @click="$emit('page-changed', currentPage - 1)"
      >
        <i class="bx bx-chevron-left"></i>
      </button>
      <button 
        v-for="page in visiblePages" 
        :key="page" 
        type="button" 
        class="page-btn"
        :class="{ active: currentPage === page }" 
        @click="$emit('page-changed', page)"
      >
        {{ page }}
      </button>
      <button 
        type="button" 
        class="page-btn next-page" 
        :disabled="!hasNextPage"
        @click="$emit('page-changed', currentPage + 1)"
      >
        <i class="bx bx-chevron-right"></i>
      </button>
      <button 
        type="button"
        class="page-btn end-page" 
        :disabled="!hasNextPage"
        @click="$emit('page-changed', totalPages)"
      >
        <i class="bx bx-chevrons-right"></i>
      </button>
    </div>
    <!-- <div class="registration">
      <RouterLink to="/admin/contents/concert/new">
        <button type="button" class="registration__button">등록</button>
      </RouterLink>
    </div> -->
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },

  totalPages: {
    type: Number,
    required: true
  },

  hasPrevPage: {
    type: Boolean,
    required: true
  },

  hasNextPage: {
    type: Boolean,
    required: true
  }
});

const visiblePages = computed(() => {
  const rangeStart = Math.max(1, props.currentPage - 2);
  const rangeEnd = Math.min(props.totalPages, props.currentPage + 2);

  return Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
});
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