<template>
  <div class="venue-modal" v-if="isOpen">
    <div class="venue-modal__overlay" @click="$emit=('close')"></div>
    <div class="venue-modal__content">
      <div class="venue-modal__header">
        <h2>공연장 정보</h2>
        <button class="venue-modal__close" @click="$emit('close')">
          <i class='bx bx-x'></i>
        </button>
      </div>
      <div class="venue-modal__body">
        <div class="venue-modal__address">
          <i class="bx bx-map"></i>
          <span>{{ address }}</span>
        </div>
        <div id="kakao-map" class="venue-modal__map" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
import { useKakaoMap } from '~/composables/useKakaoMap';

const props = defineProps({
  isOpen: Boolean,
  venue: String,
  address: String
});

defineEmits(['close']);

const config = useRuntimeConfig();
const kakaoMapApiKey = config.public.kakaoMapApiKey;
const { loadKakaoMapScript, initKakaoMap } = useKakaoMap();


watch(() => props.isOpen, (newValue) => {
  if(newValue) {
    // 모달이 열릴 때 지도 초기화
    nextTick(() => {
      initializeMap();
    });
  }
});

function initializeMap() {
  loadKakaoMapScript(kakaoMapApiKey, () => {
    const container = document.getElementById('kakao-map');
    if(container) {
      initKakaoMap(container, kakaoMapApiKey, props.address);
    } else {
      console.error('지도 컨테이너를 찾을 수 없습니다.');
    }
  });
}

onMounted(() => {
  if(props.isOpen) {
    nextTick(() => {
      initializeMap();
    });
  }
});

</script>

<style scoped>
.venue-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.venue-modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.venue-modal__content {
  position: relative;
  width: 90%;
  max-width: 700px;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  overflow: hidden;
}

.venue-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--color-grey-3);
}

.venue-modal__header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--black);
}

.venue-modal__close {
  background: none;
  border: none;
  font-size: var(--font-size-11);
  cursor: pointer;
  color: var(--color-grey-9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.venue-modal__body {
  padding: 20px;
}

.venue-modal__address {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: var(--font-size-7);
}

.venue-modal__address i {
  margin-right: 5px;
  color: var(--black);
}

.venue-modal__map {
  width: 100%;
  height: 400px;
  border-radius: 4px;
  overflow: hidden;
}
</style>