<template>
  <div class="main-wrap">
    <section class="board">
      <div class="board__header">
        <h1>피드 Feed</h1>
        <p>총 게시물수 25건</p>
      </div>   
      <div class="board__container">
        <div class="board__list">
          <div class="board__head">
            <div class="board__no">번호</div>
            <div class="board__title">제목</div>
            <div class="board__writer">작성자</div>
            <div class="board__regDate">작성일</div>
            <div class="board__viewCnt">조회수</div>
            <div class="board__cmtCount">댓글수</div>
            <div class="board__like">좋아요</div>
            <div class="board__management">게시물관리</div>
          </div>
          <div class="board__body">
            <div class="board__content" v-for="(feed, index) in feeds" :key="index" @click="toggleDetails(index)">
              <div class="board__no">{{ feed.no }}</div>
              <div class="board__title">{{ feed.title }}
                <button class="board__title-detail">
                  <i :class="['bx', visibleDetails[index] ? 'bx-chevron-down' : 'bx-chevron-up', { 'rotate-icon': visibleDetails[index] }]"></i>
                </button>
              </div>
              <div class="board__writer">{{ feed.writer }}</div>
              <div class="board__regDate">{{ feed.regDate }}</div>
              <div class="board__viewCnt">{{ feed.viewCnt}}</div>
              <div class="board__cmtCount">{{ feed.cmtCount }}</div>
              <div class="board__like">{{ feed.like }}</div>
              <div class="board__management">
                <button class="invisibleBtn">비공개</button>
                <button class="deleteBtn">삭제</button>
              </div>
              <!-- 아코디언으로 펼쳐질 내용 -->
              <div class="board__details" :style="{ display: visibleDetails[index] ? 'flex' : 'none' }">
                <div class="board__details-contents">
                  <div class="board__details-user-profile">
                    <img src="/images/profile12.jpg" alt="user_profile">
                    <span name="nickname">
                      <strong>{{ feed.writer }}</strong>
                    </span>
                  </div>
                  <div class="board__details-image">
                    <img v-for="image in feed.images" :key="image" :src="image" alt="feed_image">
                  </div>
                  <div class="board__details-text">
                    <p>{{ feed.text }}</p>
                  </div>
                  <div class="board__details-tags">
                    <span v-for="tag in feed.tags" :key="tag" class="tag-item">{{ tag }}</span>
                  </div>
                </div>
              </div><!-- 아코디언 끝 -->
            </div><!-- 하나의 컨텐츠 -->
          </div> <!-- END BOARD BODY -->
        </div> <!-- END BOARD LIST-->
      </div>
      <!-- END BOARD CONTAINER -->

      <!-- PAGENATION -->
      <div class="pagination">
        <button type="button" class="page-btn start-page">
          <i class='bx bx-chevrons-left'></i>
        </button>
        <button type="button" class="page-btn prev-page">
          <i class='bx bx-chevron-left'></i>
        </button>
        <button type="button" class="page-btn active">1</button>
        <button type="button" class="page-btn">2</button>
        <button type="button" class="page-btn">3</button>
        <button type="button" class="page-btn">4</button>
        <button type="button" class="page-btn">5</button>
        <button type="button" class="page-btn next-page">
          <i class='bx bx-chevron-right'></i>
        </button>
        <button type="button" class="page-btn end-page">
          <i class='bx bx-chevrons-right'></i>
        </button>
      </div>
      <!-- END PAGINATION -->
    </section>
  </div> <!-- END MAIN WRAP -->

  <!-- SEARCH BAR -->
  <section class="search">
    <div class="search__bar">
      <div class="search__dropdown">
        <div id="drop-text" class="search__text" @click="toggleDropdown">
          <span id="span">{{ selectedCategory }}</span>
          <i id="icon" class='bx bx-chevron-down' :style="{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }"></i>
        </div>
        <ul id="drop-list" class="search__list" :class="{ show: isOpen }">
          <li class="search__item" v-for="item in categories" :key="item" @click="selectCategory(item)">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="search__box">
        <input type="text" id="search-input" :placeholder="inputPlaceholder" v-model="searchQuery" />
        <i class='bx bx-search'></i>
      </div>
    </div>
  </section>
  <!-- END SEARCH BAR -->
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const feeds = ref([
  {
    no: 15,
    title: "게시물 1",
    writer: "카피바라",
    regDate: "2024-08-25",
    viewCnt: 40,
    cmtCount: 2,
    like: 3,
    profileImage: "/images/profile1.jpg",
    images: [
      "/images/feed_img_1.jpg",
      "/images/feed_img_2.JPG",
      "/images/feed_img_3.JPG",
      "/images/feed_img_4.JPG"
    ],
    text: `무소륵스키의 전람회의 그림!
          실연은 처음인데 너무 좋았잖앙,, 행복한 밤이었다!!
          내년에 또 와주길~!
    `,
    tags: ["#무소륵스키", "#전람회의 그림", "라벨편곡ver", "투간소키예프", "프바협"],
  },
  {
    no: 14,
    title: "게시물 1",
    writer: "카피바라",
    regDate: "2024-08-25",
    viewCnt: 40,
    cmtCount: 2,
    like: 3,
    profileImage: "/images/profile1.jpg",
    images: [
      "/images/feed_img_1.jpg",
      "/images/feed_img_2.JPG",
      "/images/feed_img_3.JPG",
      "/images/feed_img_4.JPG"
    ],
    text: `무소륵스키의 전람회의 그림!
          실연은 처음인데 너무 좋았잖앙,, 행복한 밤이었다!!
          내년에 또 와주길~!
    `,
    tags: ["#무소륵스키", "#전람회의 그림", "라벨편곡ver", "투간소키예프", "프바협"],
  },
  {
    no: 13,
    title: "게시물 1",
    writer: "카피바라",
    regDate: "2024-08-25",
    viewCnt: 40,
    cmtCount: 2,
    like: 3,
    profileImage: "/images/profile1.jpg",
    images: [
      "/images/feed_img_1.jpg",
      "/images/feed_img_2.JPG",
      "/images/feed_img_3.JPG",
      "/images/feed_img_4.JPG"
    ],
    text: `무소륵스키의 전람회의 그림!
          실연은 처음인데 너무 좋았잖앙,, 행복한 밤이었다!!
          내년에 또 와주길~!
    `,
    tags: ["#무소륵스키", "#전람회의 그림", "라벨편곡ver", "투간소키예프", "프바협"],
  },
]);

// const visibleDetailsIndex = ref(null);

// // 아코디언 세부 정보 토글 함수
// const toggleDetails = (index) => {
//   visibleDetailsIndex.value = visibleDetails.value === index ? null : index;
// }

// // 세부 정보 표시 여부 확인 함수
// const isDetailsVisible = computed(() => (index) => visibleDetailsIndex.value === index);

// 각 피드의 상세 내용을 보이는지 여부를 저장할 배열
const visibleDetails = ref(Array(feeds.value.length).fill(false));

// 아코디언 토글 함수
const toggleDetails = (index) => {
  // 클릭한 인덱스의 상세 내용을 토글
  visibleDetails.value[index] = !visibleDetails.value[index];

  // 다른 상세 내용은 닫기
  feeds.value.forEach((feed, idx) => {
    if (idx !== index) {
      visibleDetails.value[idx] = false;
    }
  });
};


// 검색 기능
const categories = ['통합검색', '아이디 + 닉네임', '아이디', '닉네임']; // 검색 카테고리
const selectedCategory = ref('통합검색');
const inputPlaceholder = ref('검색어를 입력해주세요');
const searchQuery = ref('');
const isOpen = ref(false); // dropdown 상태

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  updatePlaceholder(category);
  isOpen.value = false; // 선택 후 드롭다운 클로즈
};

const updatePlaceholder = (category) => {
  if(category === '통합검색') {
    inputPlaceholder.value = '검색어를 입력해주세요';
  } else if(category === '아이디') {
    inputPlaceholder.value = `검색할 ${category}를 입력해주세요`;
  } else if(category === '닉네임'){
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
  } else {
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
  }
};

// 클릭 외부 영역 처리
const handleClickOutside = (e) => {
  if(!e.target.closest('.search')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});


</script>

<style lang="css" scoped>
@import url('/public/css/admin/feed/index.css');
</style>