<template>
  <div class="wrap">
    <!-- MAIN -->
    <div class="contents-wrap">
      <form @submit.prevent="submitHandler" action="#" method="POST" id="regForm" enctype="multipart/form-data">
        <section class="notice-registration">
          <h1>공지사항 등록</h1>
          <div class="input__item">
            <div class="input__title">제목</div>
            <input v-model="title" ref="titleInput" type="text" name="title" placeholder="제목을 입력해주세요"
              autocomplete="off" />
          </div>

          <!-- 에디터를 적용할 요소 (컨테이너) -->
          <div id="contsEditor" name="content"></div>

          <!-- 취소와 저장 버튼 -->
          <div class="btn-bottom">
            <button type="button" class="btn cancel" @click="cancelHandler">취소</button>
            <button type="submit" class="btn submit">등록</button>
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
import { useRouter } from 'vue-router';
import { useDataFetch } from '~/composables/useDataFetch';

const router = useRouter(); // useRouter 훅 사용
const title = ref('');
const titleInput = ref(null); // cursor 주기 위한 변수
const editor = ref(null);
// const images = ref([]); // 초기화 

onMounted(() => {
  // TOAST EDITOR RESET
  editor.value = new toastui.Editor({
    el: document.querySelector('#contsEditor'),
    previewStyle: 'vertical',
    initialEditType: 'wysiwyg',
    height: '700px',
    placeholder: '내용을 입력해주세요',
    hideModeSwitch: true,
    /* image hooks */
    hooks: {
      addImageBlobHook(blob, callback) {
        console.log(blob);
        console.log(callback);
      }
    }
  });

  // 제목 입력 요소에 포커스 추가
  setTimeout(() => {
    titleInput.value.focus();
  }, 1);
});


// API 요청 함수 구현 - 컴포저블 사용 안하기
const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Unexpected response: ${text}`);
    }

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`HTTP Error ${response.status}: ${errorDetails.message}`);
    }

    return await response.json(); // 응답 처리
  } catch (error) {
    console.error("API 요청 중 에러 발생: ", error);
    throw error;
  }
};


// 취소 핸들러
const cancelHandler = () => {
  const titleValue = title.value.trim();
  const editorContent = editor.value.getHTML().trim(); // 에디터에서 html 컨텐츠 가져오기
  // const hasImage = images.value.length > 0; // 이미지있는지 체크

  // editorContent가 실제 내용인지 확인하기 위해 html 태그 검사
  const isEditorEmpty = editorContent === '<p><br></p>' || editorContent === ''; // 에디터가 비어있는지 확인

  // 제목, 에디터 내용, 이미지가 있을 경우에만 팝업창 안내
  if (titleValue.length > 0 || !isEditorEmpty) {
    console.log("title", titleValue, "editor", editorContent);
    const userConfirmed = window.confirm("작성 중인 글쓰기를 종료하시겠습니까?");

    if (userConfirmed) {
      router.push('/admin/notice');
    }
  } else {
    router.push('/admin/notice'); // 내용이 없을 경우 바로 이동
  }
}


// 공지사항 등록 처리 함수
const submitHandler = async () => {
  const titleValue = title.value.trim(); // 제목
  const editorContent = editor.value.getHTML().trim(); // 내용

  // 제목과 에디터 내용 유효성 검사
  if (titleValue === '') {
    alert("제목을 입력해주세요.")
    return;

  } else if (editorContent === '') {
    alert("내용을 입력해주세요.");
    return;
  }

  // formData가 아닌 JSON 객체로 데이터 구성
  const noticeData = {
    title: titleValue,
    content: editorContent
  };

  // FormData 생성
  const formData = new FormData();
  formData.append('title', titleValue); // 제목 추가
  formData.append('content', editorContent); // 내용 추가

  try {
    // useDataFetch를 사용하여 POST 요청
    const response = await useDataFetch('admin/notice', {
      method: 'POST',
      body: JSON.stringify(noticeData), // formdata 객체를 요청 본문에 담아 전송
      headers: {
        'Content-Type': 'application/json' // 요청 헤더에 Content-Type을 'application/json'으로 설정
      }
    });

    // response는 이미 파싱된 데이터일 수 있으므로 직접 사용?
    console.log("공지사항 등록 성공: ", response);
    alert("게시글이 등록되었습니다.");

    // 로컬 스토리지에 페이지 정보 저장
    localStorage.setItem('currentPage', '1');
    localStorage.setItem('forceRefresh', 'true');

    // 공지사항 등록 성공 시 페이지 이동 처리
    router.push('/admin/notice');

  } catch (error) {
    console.error('Error submitting the notice:', error);
    alert('api 요청 중 에러 발생: ', error);
  }

  // 22
  // try {
  //   const response = await fetchData('/admin/notice', {
  //     method: 'POST',
  //     body: JSON.stringify(noticeData),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });

  //   console.log("공지사항 등록 성공:", response);
  //   router.push('/admin/notice');
  // } catch(error) {
  //   alert('API 요청 중 에러 발생. 다시 시도해주세요.');
  // }
};
</script>

<style lang="css" scoped>
@import url('/public/css/admin/notice/new.css');
</style>