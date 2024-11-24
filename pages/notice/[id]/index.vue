<!-- 사용자 공지사항 상세 화면 -->
<template>
  <!-- 공지사항 상세페이지 전체 영역 -->
  <div class="notice-detail__wrap">
    <!-- 공지사항 제목 영역 -->
    <div v-if="noticeDetail" class="notice-detail__title-wrap">
      <h1 class="notice-detail__title">{{ noticeDetail.title }}</h1>
      <div class="notice-detail__info">
        <span>{{ noticeDetail.writer }}</span>
        <span>|</span>
        <span>{{ formatDate(noticeDetail.writeDate) }}</span>
      </div>
    </div>

    <!-- 공지사항 내용 영역 -->
    <div class="notice-detail__content" v-if="noticeDetail">
      <p v-html="noticeDetail.content"></p>
    </div>

    <!-- 목록 버튼-->
    <div class="notice-detail__button">
      <button @click="goToList">목록</button>
    </div>
  </div>
  <!--end 공지사항 전체 영역 -->
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const noticeId = route.params.id;

const noticeDetail = ref(null);

// 런타임 환경 변수 가져오기
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상세 데이터 가져오기
const { data, error } = await useFetch(`/notice/${noticeId}`, {
  baseURL: apiBase || 'http://localhost:8081/api/v1'
});

if (data.value) {
  noticeDetail.value = data.value; // API에서 가져온 데이터를 noticeDetail에 저장
} else if (error.value) {
  console.error("공지사항 데이터를 불러오는 중 에러 발생:", error.value);
}



// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);

  // 공백 제거 및 점 삭제 ("2024. 11. 03." -> "2024.11.03")
  return formattedDate.replace(/\s/g, '').replace(/\.$/, '')
};

// 목록 페이지로 이동하는 함수
const goToList = () => {
  // router.push('/notice'); // 목록 페이지로 라우팅
  navigateTo('/notice');
};

</script>

<style scoped>
.notice-detail__wrap {
  width: 858px;
  margin: 0 auto;
}

/* 타이틀 영역 */
.notice-detail__title-wrap {
  padding-bottom: 25px;
  border-bottom: 1px solid #858585;
}

.notice-detail__title {
  font-family: 'pretendard-semibold';
  font-size: 26px;
  margin-top: 38px;
}

.notice-detail__info {
  margin-top: 10px;
  /* color: #858585; */
  color: var(--black);
  font-family: 'pretendard-regular';
  font-size: 15px;
}

.notice-detail__info span {
  margin: 0 3px;
}

.notice-detail__info span:first-child {
  margin-left: 0; /* 첫 번째 span은 왼쪽 여백 제거 */
}

.notice-detail__info span:last-child {
  margin-right: 0; /* 마지막 span은 오른쪽 여백 제거 */
}

/* 상세 내용 */
.notice-detail__content {
  padding-top: 20px;
  padding-left: 10px;
  font-family: 'pretendard-regular';
  line-height: 22px;
  padding-bottom: 40px;
  border-bottom: 1px solid #858585;

  /* 유연한 높이 조정 */
  min-height: 600px; /* 기본 최소 높이 설정 */
  height: auto; /* 텍스트 내용에 따라 높이 자동 조정 */
  overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
}

.notice-detail__content p {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.6;
  margin-bottom: 100px;
}

/* 버튼 */
.notice-detail__button {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-bottom: 30px;
}

.notice-detail__button button {
  margin-top: 20px;
  margin-right: 10px;
  display: block;
  width: 150px;
  height: 42px;
  border: 1px solid var(--black);
  background-color: transparent;
  color: var(--white);
  color: var(--black);
  text-align: center;
  font-family: 'pretendard-medium';
  border-radius: 8px;
  cursor: pointer;
}

.notice-detail__button button:hover {
  background-color: var(--black);
  color: var(--white);
}


</style>