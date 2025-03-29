<template>
    <div class="event__header">
      <h1>{{ title }}</h1>
      <!-- <div class="event__icons">
        <div class="event__icon">
          <a href="#" @click.prevent="$emit('notification-click')">
            <i class="bx bx-bell"></i>
          </a>
          <span>알림받기</span>
        </div>
        <div class="event__icon">
          <a href="#" @click.prevent="$emit('bookmark-click')">
            <i class="bx bx-bell"></i>
          </a>
          <span>북마크</span>
        </div>
      </div> -->
    </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string
  }>()

</script>

<style>
@import url('/public/css/components/event.css');
</style>

