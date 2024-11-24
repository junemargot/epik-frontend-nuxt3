<template>
  <div class="feed__wrap">
    <!-- 업로드 이미지 -->
    <div class="uploadImage-container">
      <div class="select-image" ref="selectImageDiv">
        <img v-if="selectedImage" :src="selectedImage" alt="Selected Image" />
      </div>
      <div class="thumbnail-container" ref="thumbnailContainer" v-show="thumbnails.length > 0">
        <div v-for="(thumbnail, index) in thumbnails" :key="index" class="thumbnail-img" draggable="true"
          @dragstart="dragStart(index)" @dragend="dragEnd" @dragover.prevent @dragenter.prevent="dragEnter($event)"
          @dragleave="dragLeave($event)" @drop.prevent="drop($event, index)">
          <img :src="thumbnail" :alt="`Uploaded Image ${index + 1}`" class="thumbnail" @click="selectImage(index)" />
          <button type="button" class="removeButton" @click="removeImage(index)">
            <i class="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="feed__file">
      <label for="imageUpload" class="file-label">
        이미지 선택 (최대 4장)
        <input class="feed__file-input" id="imageUpload" type="file" accept="image/*" multiple
          @change="handleImageUpload">
      </label>
    </div>

    <!-- 내용 작성 영역 -->
    <div class="feed__text">
      <span class="feed__text-label">내용 작성</span>
      <div class="feed__textarea-wrap">
        <textarea v-model="content" placeholder="내용을 작성해주세요."></textarea>
      </div>
    </div>

    <!-- 카테고리 선택 영역 -->
    <div class="feed__category-select">
      <span>카테고리 선택</span>
      <div class="feed__radio-items">
        <div v-for="category in categories" :key="category.id" class="feed__radio-item">
          <input type="radio" :id="category.id" v-model="selectedCategory" :value="category.id" name="category">
          <label :for="category.id">{{ category.label }}</label>
        </div>
      </div>
    </div>

    <!-- 버튼 영역 -->
    <div class="feed__buttons">
      <button @click="cancel">취소</button>
      <button @click="submit">게시</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const thumbnailContainer = ref(null);
const selectImageDiv = ref(null);
const thumbnails = ref([]);
const selectedImage = ref(null);
const content = ref('');
const selectedCategory = ref('');

const categories = [
  { id: 'popup', label: '팝업' },
  { id: 'concert', label: '콘서트' },
  { id: 'musical', label: '뮤지컬' },
  { id: 'exhibition', label: '전시회' },
];

let draggedIndex = null;

const handleImageUpload = (event) => {
  const files = event.target.files;
  if (files.length === 0) return;
  if (files.length > 4) {
    alert('이미지는 최대 4개까지만 업로드할 수 있습니다.');
    event.target.value = '';
    thumbnails.value = [];
    return;
  }

  thumbnails.value = [];
  Array.from(files).forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      thumbnails.value.push(e.target.result);
      if (index === 0) {
        selectedImage.value = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  });
};

const selectImage = (index) => {
  selectedImage.value = thumbnails.value[index];
};

const removeImage = (index) => {
  thumbnails.value.splice(index, 1);
  if (thumbnails.value.length === 0) {
    selectedImage.value = null;
  } else if (selectedImage.value === thumbnails.value[index]) {
    selectedImage.value = thumbnails.value[0];
  }
};

const dragStart = (index) => {
  draggedIndex = index;
  setTimeout(() => {
    thumbnailContainer.value.children[index].style.opacity = '0.5';
  }, 0);
};

const dragEnd = () => {
  setTimeout(() => {
    thumbnailContainer.value.children[draggedIndex].style.opacity = '1';
    draggedIndex = null;
  }, 0);
};

const dragEnter = (event) => {
  event.target.closest('.thumbnail-img').classList.add('drag-over');
};
const dragLeave = (event) => {
  event.target.closest('.thumbnail-img').classList.remove('drag-over');
};

const drop = (event, index) => {
  event.target.closest('.thumbnail-img').classList.remove('drag-over');
  if (draggedIndex !== null && draggedIndex !== index) {
    const temp = thumbnails.value[draggedIndex];
    thumbnails.value.splice(draggedIndex, 1);
    thumbnails.value.splice(index, 0, temp);
  }
};

const cancel = () => {
  // 취소 로직
  content.value = '';
  selectedCategory.value = '';
  thumbnails.value = [];
  selectedImage.value = null;
};

const submit = () => {
  // 게시 로직
  console.log('Content:', content.value);
  console.log('Category:', selectedCategory.value);
  console.log('Images:', thumbnails.value);
};

onMounted(() => {
  // 필요한 경우 여기에 추가 초기화 로직을 넣을 수 있습니다.
});
</script>

<style scoped>
.feed__wrap {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 492px;
  margin: 0 auto;
  margin-top: 43px;
  /* background-color: #000; */
}

/* ******** 업로드한 이미지 미리보기 영역 ******** */

/* ############# 메인 컨테이너 ############# */
.uploadImage-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

/* ############# 대표사진 컨테이너 ############# */
.select-image {
  overflow: hidden;
  /* 슬라이더 영역을 넘어가는 이미지를 숨김 */
  width: 513px;
  /* 슬라이더의 너비 */
  height: 545px;
  /* 슬라이더의 높이 */
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* ############# 대표사진 스타일 ############# */
.select-image img {
  width: 100%;
  /* 너비를 100%로 설정하여 슬라이더에 맞춤 */
  height: 100%;
  /* 높이도 100%로 설정하여 슬라이더에 맞춤 */
  object-fit: cover;
  /* 이미지 비율 유지 및 크기 맞춤, 잘림 방지 */
}

/* ############# 미리 보기 영역(사진 4개뜨는곳) ############# */
.thumbnail-container {
  width: 513px;
  /* 컨테이너 너비 */
  height: 150px;
  /* 컨테이너 높이 */
  display: grid;
  /* Grid 레이아웃 사용 */
  grid-template-columns: repeat(4, 1fr);
  /* 4개의 열을 동일한 너비로 설정 */
  gap: 5px;
  /* 그리드 아이템 간의 간격 */
  border: 1px solid #bbbbbb;
  padding: 5px;
  box-sizing: border-box;
  overflow: hidden;
  margin-bottom: 20px;
  /* display: none; */
  /* 초기에는 숨김 */
}

/* ############# 미리 보기 영역안의 각각의 사진 ############# */
.thumbnail {
  width: 121px;
  height: 138px;
  object-fit: cover;
  /* 비율을 유지하며 크기 맞춤 */
}

.drag-over {
  border: 2px dashed #000;
}





/* ******** infut file 버튼 스타일 변경 ********  */

.feed__file {
  margin-top: 10px;
}

.feed__file-input {
  display: none;
}

.file-label {
  display: block;
  width: 420px;
  padding: 10px;
  /*padding를 주어 텍스트를 바탕으로 주변이 10px만큼 떨어지도록 설정*/
  text-align: center;
  /*버튼에서 텍스트가 가운데 있도록 설정*/
  background-color: #efefef;
  /*배경 색을 설정(원하는 걸로 바꿔도 됨)*/
  color: #686868;
  /*글자 색*/
  border: 1px solid #bbbbbb;
  font-family: 'pretendard-regular';
  cursor: pointer;
  border-radius: 10px;
  /*버튼의 둥근 정도를 설정*/
  transition: opacity linear 0.1s;
}

/* 내용 작성칸 */
/* w:417px, h:283px */

.feed__text {
  margin-top: 30px;
}

.feed__text-label {
  font-family: 'pretendard-regular';
  text-indent: 100px;
}

.feed__textarea-wrap textarea {
  width: 417px;
  height: 283px;
  resize: none;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #bbbbbb;
  padding: 15px;
}

.feed__textarea-wrap textarea::placeholder {
  font-family: 'pretendard-medium';
  font-size: 14px;
}

/* ******** 라디오 버튼 만들기******** */
.feed__category-select {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  margin-left: 24px;
  margin-top: 40px;
  font-family: 'pretendard-medium';
  font-size: 14px;
}

.feed__radio-items {
  display: flex;
}

.feed__radio-item {
  padding: 15px 0px;
  padding-right: 10px;
}

.feed__radio-item input[type=radio] {
  display: none;
}

.feed__radio-item input[type=radio]+label {
  display: block;
  cursor: pointer;
  height: 30px;
  width: 70px;
  border: 1px solid #222222;
  border-radius: 8px;
  line-height: 30px;
  text-align: center;
  background-color: transparent;
  color: #333;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.feed__radio-item input[type=radio]:checked+label {
  background-color: #EA3921;
  color: #fff;
}

/* ********버튼 스타일******** */
.feed__buttons {
  border-top: 1px solid #d9d9d9;
  margin-top: 20px;
  padding: 20px 10px;
}

.feed__buttons button {
  width: 200px;
  height: 40px;
  background-color: #d9d9d9;
  border: 1px solid #bbbbbb;
  border-radius: 8px;
  font-family: 'pretendard-semibold';
  font-size: 16px;
}

.feed__buttons button:first-child {
  margin-right: 10px;
}

.feed__buttons button:hover {
  background-color: #EA3921;
}

/* 이미지 삭제 버튼 */
.thumbnail-img {
  position: relative;
}

.thumbnail-img:nth-child(1) button {
  position: absolute;
  right: 1px;
  top: 5px;
  border: none;
  background-color: transparent;
}

.thumbnail-img:nth-child(2) button {
  position: absolute;
  right: 1px;
  top: 5px;
  border: none;
  background-color: transparent;
}

.thumbnail-img:nth-child(3) button {
  position: absolute;
  right: 1px;
  top: 5px;
  border: none;
  background-color: transparent;
}

.thumbnail-img:nth-child(4) button {
  position: absolute;
  right: 1px;
  top: 5px;
  border: none;
  background-color: transparent;
}

.thumbnail-img button i {
  color: white;
  /* 아이콘 색상 설정 */
  width: 15px;
  height: 15px;
}
</style>