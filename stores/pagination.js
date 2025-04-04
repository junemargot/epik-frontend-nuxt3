import { defineStore } from "pinia";

export const usePaginationStore = defineStore('pagination', {
  state: () => ({
    currentPage: 1,
    totalPages: 1, // 최소값 보장
    hasPrevPage: false,
    hasNextPage: false
  }),

  getters: {
    visiblePages(state) {
      if(state.totalPages <= 0) return []; // totalPages가 0 이하일 경우 빈 배열 반환

      const rangeStart = Math.max(1, state.currentPage - 2);
      const rangeEnd = Math.min(state.totalPages, state.currentPage + 2);
    
      return Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
    }
  },

  actions: {
    setPagination({ currentPage, totalPages, hasPrevPage, hasNextPage }) {
      if(currentPage < 1 || totalPages < 0) return;
      this.currentPage = currentPage;
      this.totalPages = totalPages;
      this.hasPrevPage = hasPrevPage;
      this.hasNextPage = hasNextPage;
    },

    changePage(page) {
      if(page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    }
  }
});