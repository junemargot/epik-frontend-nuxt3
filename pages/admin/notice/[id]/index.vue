<template>
<div class="wrap">
    <!-- PRODUCT CONTAINER -->
    <div class="main-wrap">
    <section class="board__container">
      <!-- PRODUCT HEADER -->
      <div class="board__header">
        <div class="board__category">
          <RouterLink to="/admin/notice">
            <strong>공지사항</strong>
            <i class='bx bx-chevron-right'></i>
          </RouterLink>
        </div>
        <div class="board__title">
          <h3 class="board__title-detail">{{ notice.title }}</h3>
        </div>
        <div class="board__registration">
          <div class="board__registration-writer">
            <span class="name">{{ notice.writer }}</span>
            <div class="board__registration-date">
              <span>{{ formatDate(notice.writeDate) }}</span>
            </div>
          </div>
        </div>
      </div> 
      <!-- END PRODUCT HEADER -->
      <div class="board__content">
        <div class="board__content-detail">
          <!-- tui viewer 렌더링 요소 -->
          <div id="viewer"></div>
        </div>
      </div>
      <div class="product__content-buttons">
        <div class="left-buttons">
          <button type="button" class="hidden">비공개</button>
          <RouterLink :to="`/admin/notice/${noticeId}/edit`">
            <button type="button" class="modify">수정</button>
          </RouterLink>
        </div>
        <div class="right-buttons">
          <RouterLink to="/admin/notice">
            <button type="button" class="list">목록으로 이동</button>
          </RouterLink>
          </div>
        </div>
    </section>
  </div> <!-- MAIN WRAP -->
</div> <!-- wrap -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import { useNoticeFetch } from '~/composables/useNoticeFetch'; // 컴포저블 가져오기
import { useFetch } from '#app'; // useFetch 훅 임포트

const { $api } = useNuxtApp(); // API 호출 함수 임포트 useNuxtApp 사용해 api 가져오기

// 라우트에서 noticeId 가져오기
const route = useRoute(); // 현재 라우트 정보
const noticeId = route.params.id; // noticeId는 router에서 정의된 파라미터 이름

// 컴포저블에서 불러온 함수
const { fetchNoticeById } = useNoticeFetch();


// 공지사항 데이터
const notice = ref({
  title: '',
  writer: '',
  writeDate: '',
  content: ''
});


// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '날짜 없음';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('유효하지 않은 날짜:', dateString);
      return '유효하지 않은 날짜';
    }

    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul' // 한국 시간대 설정
    };
    
    const formattedDate = date.toLocaleString('ko-KR', options);
    return formattedDate.replace(/\. /g, '.').replace(/\.$/, '').replace(/\.(?=[0-9]{2}:)/, ' ');
  } catch (error) {
    console.error('날짜 형식 변환 중 오류 발생:', error);
    return '날짜 형식 오류';
  }
};

// 컴포넌트 마운트 시 공지사항 상세정보 불러오기
onMounted(async () => {
  const fetchNoticeDetail = await fetchNoticeById(noticeId); // 공지사항 데이터 가져오기

  if(fetchNoticeDetail) {
    // 데이터가 성공적으로 로드되면 notice ref에 저장
    notice.value = {
      ...fetchNoticeDetail,
      writeDate: formatDate(fetchNoticeDetail.writeDate)
  };
  
  // TOAST UI EDITOR 뷰어 렌더링
  const viewer = new Viewer({
    el: document.querySelector('#viewer'), // viewer를 렌더링할 엘리먼트 지정
    height: "500px",
    initialValue: "notice.value.content" // markdown 내용으로 초기화
  });

  viewer.setMarkdown(notice.value.content); // 마크다운 렌더링
}});

</script>

<style lang="css" scoped>
@import url('/public/css/admin/notice/detail.css');

</style>