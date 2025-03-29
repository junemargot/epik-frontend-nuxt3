<template>
  <section class="event__intro">
    <div v-html="content"></div>
    <div class="event__video" v-if="youtubeUrl">
      <iframe 
        id="youtube-video" 
        :src="embedYoutubeUrl" 
        frameborder="0" 
        allowfullscreen
        sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
      ></iframe>
    </div>
    <div class="event__schedule" v-if="schedules && schedules.length">
      <p v-for="(schedule, index) in schedules" :key="index">{{ schedule }}</p>
    </div>
    <div class="event__images" v-if="images && images.length">
      <img 
        v-for="(image, index) in images" 
        :key="index" 
        :src="image" 
        :alt="`${title} 상세${index + 1}`" 
        class="event__image--long"
      />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  content: String,
  youtubeUrl: String,
  images: Array
});
</script>

<style>
@import url('/public/css/components/event.css');
</style>