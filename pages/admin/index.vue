<!-- ADMIN MAIN PAGE -->
<template>
  <div class="wrap">
    <section id="content">
      <!-- MAIN -->
      <main>
        <h1 class="content__title">Dashboard</h1>
        <div class="content__info-data">
          <div class="card" v-for="(item, index) in progressItems" :key="index"> <!-- one card -->
            <div class="card__head">
              <div>
                <h2>{{ item.value }}<span>명</span></h2>
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
                <Router-Link :to="section.link">{{ section.title }}</Router-Link> <!-- 소제목 링크 달기 -->
              </h3>
              <div class="menu">
                <i class='bx bx-dots-horizontal-rounded icon' @click="toggleMenu(index)"></i>
                <ul class="menu-link" :class="{ show: isMenuOpen[index] }">
                  <li><RouterLink :to="section.link">더보기</RouterLink></li>
                  <li v-if="section.title === '공지사항'"><RouterLink to="/admin/notice/new">글작성</RouterLink></li> <!-- 수정 다른 하위 메뉴에선 안보이도록 -->
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
                    <!-- <td class="content-num">{{ item.number }}</td>
                    <td class="content-title">{{ item.title }}</td>
                    <td class="content-writer">{{ item.writer }}</td>
                    <td class="content-date">{{ item.date }}</td> -->
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
import { useNoticeFetch } from '~/composables/useNoticeFetch';

const routes = [
  {
    path: '/admin/notice/:id',
    name: 'NoticeDetail', // 여기 수정
  }
]
const adminNotices = ref([]); // 관리자 메인페이지에 표시할 공지사항

// 데이터 로드 함수
const loadAdminNotices = async () => {
  try {
    const { fetchNotices } = useNoticeFetch();
    const { notices } = await fetchNotices();
    adminNotices.value = notices.slice(0, 5);
    // noticeList가 존재하는지 확인 후 처리
    // if (data && data.notices) {
    //     adminNotices.value = data.noticeList.slice(0, 5); // 상위 5개 데이터 확인
    //   } else { D
    //     console.error('noticeList is undefined');
    //   }
  } catch (error) {
    console.error('Failed to load notices:', error);
  }
};


// 진행률 데이터
const progressItems = ref([
  { value: 1500, description: '오늘 방문자 수', date: '2024.09.16 기준', progress: '60%' },
  { value: 60, description: '오늘 신규회원', date: '2024.09.16 기준', progress: '30%' },
  { value: 24, description: '새로 등록된 피드', date: '2024.09.16 기준', progress: '40%' },
  { value: 5, description: '1:1 문의접수', date: '2024.09.16 기준', progress: '50%' },
]);

onMounted(() => {
  const allProgress = document.querySelectorAll('main .card__progress');
  allProgress.forEach(item => {
    item.style.setProperty('--value', item.dataset.value);
  });
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
      items: adminNotices.value,
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
        { id: 5, title: '협찬 제안 문의', writer: 'ABC기업', writeDate: '2024-11-25' },
        { id: 4, title: '공동 이벤트 제안', writer: 'XYZ회사', writeDate: '2024-11-23' },
        { id: 3, title: '탈퇴 신청 문의', writer: '김철수', writeDate: '2024-11-20' },
        { id: 2, title: '이메일 인증 실패', writer: '박민수', writeDate: '2024-11-20' },
        { id: 1, title: '포인트 적립 관련 문의', writer: '최유리', writeDate: '2024-11-19' },
      ]
    },
    {
      title: '피드 신고내역',
      link: '/admin/reports/feed',
      items: [
        { id: 5, title: '게시물 수정 요청드립니다.', writer: '바니띵크', writeDate: '2024-11-25' },
        { id: 4, title: '공동 이벤트 제안', writer: 'XYZ회사', writeDate: '2024-11-23' },
        { id: 3, title: '탈퇴 신청 문의', writer: '김철수', writeDate: '2024-11-20' },
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
@import 'public/css/admin/index.css';
</style>