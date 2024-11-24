<template>
  <div v-if="modelValue" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">&times;</button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 16px;
  width: 400px;
  text-align: center;
  position: relative;
}

.close-button {
  display: none; 
}

:deep(.delete-confirmation) {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

:deep(.delete-confirmation h2) {
  font-family: 'pretendard-bold';
  font-size: 18px;
  margin: 0;
}

:deep(.delete-confirmation p) {
  font-family: 'pretendard-medium';
  font-size: 16px;
  color: #666;
  margin: 0;
}

:deep(.modal-buttons) {
  display: flex;
  justify-content: space-between; /* 버튼들을 양끝으로 배치 */
  gap: 40px;
  padding: 0 20px; 
}

:deep(.modal-buttons button) {
  padding: 15px 40px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  flex: 1; /* 버튼이 동일한 너비를 가지도록 설정 */
}

:deep(.modal-buttons button:first-child) {
  background-color: #808180;
  color: white;
}

:deep(.modal-buttons button:last-child) {
  background-color: #EA3921;
  color: white;
}
</style>