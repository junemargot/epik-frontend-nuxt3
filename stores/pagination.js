import { defineStore } from "pinia";

export const usePaginationStore = defineStore('pagination', {
  state: () => ({
    currentPage: 1,       // 현재 페이지 (기본값: 1)
    totalPages: 1,        // 전체 페이지 수 (최소 1로 초기화)
    hasPrevPage: false,   // 이전 페이지 존재 여부
    hasNextPage: false    // 다음 페이지 존재 여부
  }),

  getters: {
    // 표시할 페이지 번호 배열 계산
    visiblePages(state) {
      if(state.totalPages <= 0) return []; // 유효성 검사, totalPages가 0 이하일 경우 빈 배열 반환

      const rangeStart = Math.max(1, state.currentPage - 2);  // 시작 페이지 (최소 1)
      const rangeEnd = Math.min(state.totalPages, state.currentPage + 2);  // 끝 페이지 (최대 totalPages)
    
      return Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
    }
  },

  actions: {
    // 페이지네이션 상태 업데이트 (API 응답 후 호출)
    setPagination({ currentPage, totalPages, hasPrevPage, hasNextPage }) {
      if(currentPage < 1 || totalPages < 0) return; // 유효성 검사
      this.currentPage = currentPage;
      this.totalPages = totalPages;
      this.hasPrevPage = hasPrevPage;
      this.hasNextPage = hasNextPage;
    },

    // 페이지 변경 (컴포넌트에서 호출)
    changePage(page) {
      if(page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    }
  }
});