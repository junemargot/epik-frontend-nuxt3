<template>
  <div class="wrap">
  <!-- SIDEBAR -->
  <section id="sidebar">
    <RouterLink to="/admin" class="logo">
      <strong>EPIK</strong><span>관리자페이지</span>
    </RouterLink>
    <ul class="sidebar__menu">
      <li>
        <RouterLink to="/admin" class="active"> <!-- active 수정 -->
          <i class='bx bx-home icon'></i>Dashboard
        </RouterLink>
      </li>
      <li class="sidebar__menu-divider" data-text="menu">member</li>
      <li v-for="(item, index) in memberMenuItems" :key="index" :class="{ active: activeMenu === item.name }">
        <a href="#" @click.prevent="toggleDropdown(item.name)">
          <i class='bx bx-user icon'></i>{{ item.label }}
          <i class='bx bxs-chevron-right icon-right'></i>
        </a>
        <ul class="sidebar__menu-dropdown" :class="{ show: activeDropdown === item.name }">
          <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
            <RouterLink :to="subItem.link" :class="{ active: activeMenu === item.name }">{{ subItem.label }}</RouterLink> <!--여기까지 일단 수정 -->
          </li>
        </ul>
      </li>
      <li class="sidebar__menu-divider">contents</li>
      <li v-for="(item, index) in contentsMenuItems" :key="index">
        <a href="#" @click.prevent="toggleDropdown(item.name)">
          <i class='bx bx-box icon'></i>{{ item.label }}
          <i class='bx bxs-chevron-right icon-right'></i>
        </a>
        <ul class="sidebar__menu-dropdown" :class="{ show: activeDropdown === item.name }">
          <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
            <RouterLink :to="subItem.link">{{ subItem.label }}</RouterLink>
          </li>
        </ul>
      </li>
      <li v-for="(item, index) in feedMenuItems" :key="index">
        <a href="#" @click.prevent="toggleDropdown(item.name)">
          <i class='bx bx-book-content icon'></i>{{ item.label }}
          <i class='bx bxs-chevron-right icon-right'></i>
        </a>
        <ul class="sidebar__menu-dropdown" :class="{ show: activeDropdown === item.name }">
          <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
            <RouterLink :to="subItem.link">{{ subItem.label }}</RouterLink>
          </li>
        </ul>
      </li>
      <li class="sidebar__menu-divider">manage</li>
      <li v-for="(item, index) in reportMenuItems" :key="index">
        <a href="#" @click.prevent="toggleDropdown(item.name)">
          <i class='bx bx-flag icon'></i>{{ item.label }}
          <i class='bx bxs-chevron-right icon-right'></i>
        </a>
        <ul class="sidebar__menu-dropdown" :class="{ show: activeDropdown === item.name }">
          <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
            <RouterLink :to="subItem.link">{{ subItem.label }}</RouterLink>
          </li>
        </ul>
      </li>
      <li v-for="(item, index) in inquiryMenuItems" :key="index">
        <a href="#" @click.prevent="toggleDropdown(item.name)">
          <i class='bx bx-edit icon'></i>{{ item.label }}
          <i class='bx bxs-chevron-right icon-right'></i>
        </a>
        <ul class="sidebar__menu-dropdown" :class="{ show: activeDropdown === item.name }">
          <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
            <RouterLink :to="subItem.link">{{ subItem.label }}</RouterLink>
          </li>
        </ul>
      </li>
      <li v-for="(item, index) in noticeMenuItems" :key="index">
        <a href="#" @click.prevent="toggleDropdown(item.name)">
          <i class='bx bx-bell icon'></i>{{ item.label }}
          <i class='bx bxs-chevron-right icon-right'></i>
        </a>
        <ul class="sidebar__menu-dropdown" :class="{ show: activeDropdown === item.name }">
          <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
            <RouterLink :to="subItem.link">{{ subItem.label }}</RouterLink>
          </li>
        </ul>
      </li>
    </ul>
    <div class="sidebar__profile">
      <div class="profile" ref="profile">
        <!-- <img src="/images/profile3.jpg" alt="프로필사진" ref="imgProfile" /> -->
        <img :src="getFullImageUrl(currentUser.profileImg)" alt="프로필이미지" />
        <div class="profile__name" ref="nameProfile" @click="profileToggleDropdown">
          {{ currentUser.nickname }}
          <ul 
            class="profile__link" 
            ref="dropdownProfile" 
            :class="{ show: profileDropdownVisible }">
            <li>
              <a @click="logoutHandler" href="#">
                <i class='bx bx-log-out'></i>
                로그아웃
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  </div>
  <!-- END SIDEBAR -->
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상태 관리 변수
const currentUser = ref({});


// SIDEBAR DROPDOWN ===========================
// dropdown status
const activeDropdown = ref(null);
const activeMenu = ref(null); // 현재 활성화된 메뉴 항목

// menu list toggle event
const memberMenuItems = [
  {
    name: 'user',
    label: '회원 관리',
    icon: ['far', 'user'],
    subItems: [{ label: '회원 목록', link: '/admin/member' }],
  },
];

const contentsMenuItems = [
  {
    name: 'contents',
    label: '컨텐츠 관리',
    icon: ['fas', 'inbox'],
    subItems: [
      { label: '팝업', link: '/admin/contents/popup' },
      { label: '콘서트', link: '/admin/contents/concert' },
      { label: '뮤지컬', link: '/admin/contents/musical' },
      { label: '전시회', link: '/admin/contents/exhibition' }
    ],
  },
];

// const feedMenuItems = [
//   {
//     name: 'feed',
//     label: '피드 관리',
//     icon: ['fat', 'list-alt'],
//     subItems: [
//       { label: '피드 관리', link: '/admin/feed' },
//       { label: '댓글 관리', link: '/admin/feed/comment' }
//     ],
//   },
// ];

// const reportMenuItems = [
//   {
//     name: 'report',
//     label: '신고 관리',
//     icon: ['fas', 'exclamation-triangle'],
//     subItems: [
//       { label: '피드 신고 내역', link: '/admin/reports/feed' },
//       { label: '댓글 신고 내역', link: '/admin/reports/comment' }
//     ],
//   },
// ];

const inquiryMenuItems = [
  {
    name: 'inquiry',
    label: '문의 관리',
    icon: ['far', 'edit'],
    subItems: [
      { label: '1:1 문의 내역', link: '/admin/inquiries/personal' },
      { label: '비즈니스 문의 내역', link: '/admin/inquiries/business' }
    ],
  },
];

const noticeMenuItems = [
  {
    name: 'notice',
    label: '공지 관리',
    icon: ['fas', 'volume-up'],
    subItems: [
    { label: '공지사항 관리', link: '/admin/notice' }
    ]
  }
]

// dropdown toggle method
const toggleDropdown = (menuName) => {
  activeDropdown.value = activeDropdown.value === menuName ? null : menuName;
  console.log("사이드바 버튼 클릭됨");
};

const setActiveMenu = (menuName, subMenuName = null) => {
  activeMenu.value = subMenuName ? `${menuName} - ${subMenuName}` : menuName;
};



// PROFILE DROPDOWN
// const profile = ref(null);
const imgProfile = ref(null);
const nameProfile = ref(null);
const dropdownProfile = ref(null);
const profileDropdownVisible = ref(false);


// dropdown toggle method
const profileToggleDropdown = () => {
  profileDropdownVisible.value = !profileDropdownVisible.value;
};

// click outside handler
// const handleClickOutside = (e) => {
//   if (dropdownProfile.value && 
//       !dropdownProfile.value.contains(e.target) && 
//       !imgProfile.value.contains(e.target) && 
//       !nameProfile.value.contains(e.target)) {
//     profileDropdownVisible.value = false;
//   }
// }

const handleClickOutside = (e) => {
  const dropdownEl = dropdownProfile.value;
  const imgEl = imgProfile.value;
  const nameEl = nameProfile.value;

  if(!profileDropdownVisible.value) return;

  if(
    dropdownProfile.value?.contains(e.target) ||
    imgProfile.value?.contains(e.target) ||
    nameProfile.value?.containes(e.target)
  ) {
    return;
  }

  profileDropdownVisible.value = false;
}

onMounted(() => {
  // imgProfile.value.addEventListener('click', profileToggleDropdown);
  // nameProfile.value.addEventListener('click', profileToggleDropdown);
  window.addEventListener('click', handleClickOutside);
});

// when component unmount remove event
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});

//로그아웃
const userDetails = useUserDetails(); 
// const currentUser = computed(() => userDetails.user || { name: '관리자' }); // 기본값 설정

const fetchCurrentUser = async () => {
  try {
    const { data } = await useFetch('/admin/user/current', {
      baseURL: apiBase || 'http://localhost:8081/api/v1',
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}`}
    });

    if(data.value) {
      currentUser.value = data.value;
      console.log('현재 사용자 정보: ', currentUser.value);
    }

  } catch(error) {
    console.error('관리자 정보 가져오기 실패: ', error);
  }
};

// 프로필 이미지 url 생성 함수
const getFullImageUrl = (imagePath) => {
  return imagePath
    ? `${apiBase}/images/${imagePath}`
    : '/images/basic.png';
}

// 로그아웃 처리
const logoutHandler = () => {
  localStorage.removeItem('authToken');
  router.push('http://localhost:3000/login');
}

// const logoutHandler =()=>{
//   userDetails.logout();
//   localStorage.clear();
//   location.href = 'http://localhost:3000'
// }

onMounted(() => {
  fetchCurrentUser(); // 컴포넌트 마운트 시 사용자 정보 가져오기
  window.addEventListener('click', handleClickOutside);
});


</script>


<style lang="css" scoped>
@import url("/public/css/admin/aside.css");


</style>