<template>
  <div class="main-wrap">
    <ContentBoard 
      title="콘서트 Concert"
      :postCount="totalCount"
      :items="items"
      contentType="concert"
      :current-page="currentPage"
      :total-pages="totalPages"
      :has-prev-page="hasPrevPage"
      :has-next-page="hasNextPage"
      :visible-pages="pages"
      @edit="goToEditPage"
      @delete="deleteHandler"
      @hidden="hiddenHandler"
      @page-change="changePage"
    />
  </div>
  <!-- END MAIN WRAP -->

  <!-- SEARCH BAR -->
  <SearchBar
    :initial-category="getInitialCategory()"
    :initial-query="searchQuery"
    @search="handleSearch"
  />
</template>

<script setup>
import { useContentList } from '~/composables/useContentList';
import ContentBoard from '~/components/admin/ContentBoard.vue';
import SearchBar from '~/components/admin/SearchBar.vue';

const {
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
} = useContentList('concert');

defineExpose({ beforeRouteUpdate });

</script>