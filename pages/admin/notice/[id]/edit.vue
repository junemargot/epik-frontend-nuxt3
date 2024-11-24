<template>
<div class="wrap">
    <!-- MAIN -->
    <div class="contents-wrap">
      <form action="#" method="POST" id="regForm" enctype="multipart/form-data">
      <section class="notice-registration">
        <h1>게시물 수정 - 공지사항</h1>
        <div class="input__item">
          <div class="input__title">제목</div>
          <input type="text" v-model="title" name="title" placeholder="제목을 입력해주세요" autocomplete="off" />
        </div>
        <!-- 에디터를 적용할 요소 (컨테이너) -->
    
        <div id="contsEditor" ref="editorRef" name="content"></div>
      
        <!-- 이미지 업로드 및 미리보기 -->
        <div class="input__item">
          <div class="input__title">이미지첨부</div>
          <label class="imgUpload" for="imgInput">선택</label>
          <input type="file" name="img" id="imgInput" multiple @change="imgUploadHandler" />
        </div>
        <div id="image-preview" :class="{ 'with-border': images.length > 0 }">
          <div v-for="(image, index) in images" :key="index" class="image-preview-item">
            <img :src="image" alt="Image Preview" />
            <button type="button" class="remove-image" @click="removeImage(index)">&times;</button>
          </div>
        </div>

        <!-- 취소와 저장 버튼 -->
        <div class="btn-bottom">
          <button type="button" class="btns cancel" @click="cancelHandler">취소</button>
          <button type="submit" class="btns submit" @click="submitHandler">수정</button>
        </div>
      </section>
      </form>
    </div>
    <!-- END CONTENTS WRAP -->
  </div>
  <!-- END WRAP -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Editor } from '@toast-ui/editor';
import { useRouter } from 'vue-router';
import { useNoticeFetch } from '~/composables/useNoticeFetch'; // composable 가져오기

const title = ref('');
const editor = ref(null);
const router = useRouter();
const route = useRoute();
const images = ref([]); // 초기화 이미지 미리보기 배열
const noticeId = route.params.id;
const editorRef = ref(null);
const { fetchNoticeById, fetchNoticeUpdate } = useNoticeFetch();

onMounted(async () => {
  try {
    const noticeData = await fetchNoticeById(noticeId);
    title.value = noticeData.title;

    // TOAST UI 에디터 초기화
    editor.value = new Editor({
      el: document.querySelector('#contsEditor'),
      previewStyle: 'vertical',
      initialEditType: 'wysiwyg',
      height: '700px',
      initialValue: noticeData.content,
      hideModeSwitch: true
    });


    // 이미지처리 생략
  } catch(error) {
    console.error("공지사항 데이터 로드 실패:", error);
    alert("공지사항 데이터를 불러오는데 실패했습니다.");
  }
});


// 수정 제출 핸들러
const submitHandler = async (event) => {
  event.preventDefault(); // 폼 제출 기본 동작 막기

  if(!editor.value) return;

  // 수정된 내용 가져오기
  const updatedContent = editor.value.getMarkdown();
  const patchData = {
    title: title.value,
    content: updatedContent,
    // images: images.value
  };

  try {
    const updatedNotice = await fetchNoticeUpdate(noticeId, patchData);
    console.log('수정된 공지사항: ', updatedNotice);
    alert("게시물이 성공적으로 수정되었습니다.");
    router.push('/admin/notice');
  } catch(error) {
    console.error("게시물 수정 실패: ", error);
    alert("게시물 수정에 실패했습니다. " + error.message);
  }
};


// 취소 핸들러
const cancelHandler = () => {
  const titleValue = title.value.trim();

  // editor.value가 null인지 확인
  if(editor.value) {
    const editorContent = editor.value.getHTML().trim();
    const isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';
  }

  if (titleValue.length > 0 || !isEditorEmpty) {
    const userConfirmed = window.confirm("수정 중인 글쓰기를 종료하시겠습니까?");
    if (userConfirmed) {
      router.push('/admin/notice');
    } 
  } else {
    router.push('/admin/notice');
  }
};

// 이미지 업로드 핸들러
const imgUploadHandler = (event) => {
  const files = event.target.files;
  images.value = []; // 기존 이미지 초기화

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.push(e.target.result); // 미리보기 이미지 추가
    };
    reader.readAsDataURL(file);
  });
};

// 이미지 삭제 핸들러
const removeImage = (index) => {
  images.value.splice(index, 1); // 선택 인덱스의 이미지 삭제
};


</script>

<style lang="css" scoped>
@import url('/public/css/admin/notice/edit.css');
</style>