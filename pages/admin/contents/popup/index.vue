<template>
  <div class="main-wrap">
    <ContentBoard 
      title="팝업 Pop-up"
      :postCount="totalCount"
      :items="items"
      contentType="popup"
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
} = useContentList('popup');

defineExpose({ beforeRouteUpdate });

</script>
