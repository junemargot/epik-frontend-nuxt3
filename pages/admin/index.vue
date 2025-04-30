<!-- ADMIN MAIN PAGE -->
<template>
  <div class="admin_wrap">
    <section id="content">
      <!-- MAIN -->
      <main>
        <div class="content__info-data">
          <div class="card" v-for="(item, index) in progressItems" :key="index"> <!-- one card -->
            <div class="card__head">
              <div>
                <h2>{{ item.value }}<span>{{ item.unit }}</span></h2>
                <p>{{ item.description }}</p>
                <p>{{ item.date }}</p>
              </div>
              <i class='bx bx-trending-up icon'></i>
            </div>
            <span class="card__progress" :data-value="item.progress"></span>
            <span class="label">{{ item.progress }}</span>
          </div> <!-- one card end -->
        </div>
        <div class="data">
          <div class="content-data" v-for="(section, index) in contentSections" :key="index">
            <div class="head">
              <h3>
                <Router-Link :to="section.link">{{ section.title }}</Router-Link>
              </h3>
              <div class="menu">
                <i class='bx bx-dots-horizontal-rounded icon' @click="toggleMenu(index)"></i>
                <ul class="menu-link" :class="{ show: isMenuOpen[index] }">
                  <li>
                    <RouterLink :to="section.link">더보기</RouterLink>
                  </li>
                  <li v-if="section.title === '공지사항'">
                    <RouterLink to="/admin/notice/new">글작성</RouterLink>
                  </li>
                </ul>
              </div>
            </div>
            <div class="notice">
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(notice, idx) in section.items" :key="notice.id">
                    <td class="content-num">{{ notice.id }}</td>
                    <td class="content-title">
                      <RouterLink :to="`/admin/notice/${notice.id}`">{{ notice.title }}</RouterLink>
                    </td>
                    <td class="content-writer">{{ notice.writer }}</td>
                    <td class="content-date">{{ formatDate(notice.writeDate) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <!-- END MAIN -->
    </section>
  </div>
  <!-- END WRAP -->

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase || 'http://localhost:8081/api/v1';

const adminNotices = ref([]); // 관리자 메인페이지에 표시할 공지사항

// 데이터 로드 함수
const loadAdminNotices = async () => {
  try {
    const params = new URLSearchParams({
      p: 1,
      size: 5,
      sort: 'writeDate,desc'
    })
    const response = await fetch(`${apiBase}/admin/notice?${params}`);
    // const response = await fetch(`${apiBase}/admin/notice?p=1&size=5`);
    if(!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    adminNotices.value = (data.noticeList || []).slice(0, 5);
    
  } catch (error) {
    console.error('Failed to load notices:', error);
  }
};


// 진행률 데이터
const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0].replace(/-/g, '.'); // "2025.04.30"
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const progressItems = ref([
  { value: getRandomInt(20, 60), description: '오늘 방문자 수', date: getToday(), unit: '명', progress: '60%' },
  { value: getRandomInt(5, 20), description: '오늘 신규회원', date: getToday(), unit: '명', progress: '30%' },
  { value: getRandomInt(5, 10), description: '새로 등록된 피드', date: getToday(), unit: '건', progress: '40%' },
  { value: getRandomInt(1, 10), description: '1:1 문의접수', date: getToday(), unit: '건', progress: '50%' },
]);

onMounted(() => {
  const allProgress = document.querySelectorAll('main .card__progress');
  allProgress.forEach(item => {
    item.style.setProperty('--value', item.dataset.value);
  });

  console.log('최종 렌더될 progressItem: ', progressItems.value);
});

// 공지사항 및 컨텐츠 데이터
const contentSections = ref([]);

// 컨텐츠 더 보기 DROPDOWN
const props = defineProps({
  contentSections: {
    type: Array,
    default: () => [] // 기본값으로 빈 배열 설정
  }
}); // contentSections 각 컨텐츠 데이터

const isMenuOpen = ref(Array(props.contentSections.length).fill(false));

const toggleMenu = (index) => {
  isMenuOpen.value[index] = !isMenuOpen.value[index];
};

const closeMenu = (event) => {
  if (!event.target.closest('.menu')) {
    isMenuOpen.value.fill(false);
  }
};

onMounted(() => {
  window.addEventListener('click', closeMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', closeMenu);
});


// 메인 컨텐츠 데이터 불러오기
onMounted(async () => {
  await loadAdminNotices();

  contentSections.value = [
    {
      title: '공지사항',
      link: '/admin/notice',
      items: adminNotices.value.map(notice => ({
        id: notice.id,
        title: notice.title,
        writer: notice.writer,
        writeDate: notice.writeDate
      }))
    },
    {
      title: '1:1 문의내역',
      link: '/admin/inquiries/personal',
      items: [
        { id: 5, title: '회원가입 문의', writer: 'apple1234', writeDate: '2024-11-23' },
        { id: 4, title: '비밀번호 변경 방법', writer: '이영희', writeDate: '2024-11-23' },
        { id: 3, title: '탈퇴 신청 문의', writer: '김철수', writeDate: '2024-11-20' },
        { id: 2, title: '이메일 인증 실패', writer: '박민수', writeDate: '2024-11-20' },
        { id: 1, title: '포인트 적립 관련 문의', writer: '최유리', writeDate: '2024-11-19' },
      ]
    },
    {
      title: '비즈니스 문의내역',
      link: '/admin/inquiries/business',
      items: [
        { id: 5, title: '협찬 제안 문의', writer: '김경민', writeDate: '2024-11-25' },
        { id: 4, title: '공동 이벤트 제안', writer: '담당자', writeDate: '2024-11-23' },
        { id: 3, title: '탈퇴 신청 문의', writer: '김철재', writeDate: '2024-11-20' },
        { id: 2, title: '이메일 인증 실패', writer: '박민수', writeDate: '2024-11-20' },
        { id: 1, title: '포인트 적립 관련 문의', writer: '최유리', writeDate: '2024-11-19' },
      ]
    },
    {
      title: '피드 신고내역',
      link: '/admin/reports/feed',
      items: [
        { id: 5, title: '게시물 수정 요청드립니다.', writer: '바니', writeDate: '2024-11-25' },
        { id: 4, title: '공동 이벤트 제안', writer: '래빗', writeDate: '2024-11-23' },
        { id: 3, title: '탈퇴 신청 문의', writer: '애플', writeDate: '2024-11-20' },
        { id: 2, title: '이메일 인증 실패', writer: '박민수', writeDate: '2024-11-20' },
        { id: 1, title: '포인트 적립 관련 문의', writer: '최유리', writeDate: '2024-11-19' },
      ]
    },
  ]
})

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);

  // 공백 제거 및 점 삭제 ("2024. 11. 03." -> "2024.11.03")
  return formattedDate.replace(/\s/g, '').replace(/\.$/, '')
};

</script>

<style lang="css" scoped>
@import url('public/css/admin/index.css');
</style>