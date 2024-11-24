<template>
  <div class="main-wrap">
      <section class="board">
        <div class="board__header">
          <h1>신고 관리 - 피드 신고내역</h1>
          <p>총 댓글 163건</p>
        </div>
        <div class="board__container">
          <div class="board__list">
            <div class="board__head">
              <div class="board__no">번호</div>
              <div class="board__title">내용</div>
              <div class="board__feed-text">피드 본문</div>
              <div class="board__writer">작성자</div>
              <div class="board__regDate">작성일</div>
              <div class="board__status">상태</div>
              <div class="board__management">댓글 관리</div>
            </div>
            <div class="board__body">
              <div class="board__content" v-for="(comment, index) in comments" :key="index">
                <div class="board__content-summary">
                  <div class="comment__no">{{ comment.no }}</div>
                  <div class="comment__title" @click="toggleDetails(index)">{{ comment.title }}</div>
                  <div class="comment__feed-text"><i class='bx bx-file'></i></div>
                  <div class="comment__writer">{{ comment.writer }}</div>
                  <div class="comment__regDate">{{ comment.regDate}}</div>
                  <div class="comment__status">{{ comment.status }}</div>
                  <div class="comment__management">
                    <button class="invisibleBtn">비공개</button>
                    <button class="deleteBtn">삭제</button>
                  </div>
                </div>
                <!-- 아코디언으로 펼쳐질 내용 -->
                <div class="board__details" :style="{ display: visibleDetails === index ? 'flex' : 'none' }">
                  <div class="board__details-contents">
                    <div class="board__details-user-image">
                      <img :src="comment.userImage" alt="user_profile" />
                    </div>
                    <div class="board__details-text-container">
                    <div class="board__details-user-nickbox">
                      <span name="nickname"><strong>{{ comment.nickname }}</strong></span>
                    </div>
                    <div class="board__details-textbox">
                      <p name="content">{{ comment.content }}</p>
                    </div>
                    <div class=board__details-info>
                      <span class="board__details-regdate">{{ comment.detailRegDate }}</span>
                    </div>
                    </div>
                  </div>
                </div>
              </div> <!-- one contents -->
              
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
  import { ref } from 'vue';
  
  const visibleDetails = ref(null);
  
  const comments = ref([
    {
      no: 15,
      title: "이 사람 없애주세요.",
      writer: "madman",
      regDate: "2024-11-15",
      status: "정상",
      userImage: "/images/profile12.jpg",
      nickname: "stranger",
      content: "메롱",
      detailRegDate: "2024.10.20. 19:46"
    },
    {
      no: 14,
      title: "허위 사실을 올렸어요.",
      writer: "witness",
      regDate: "2024-08-25",
      status: "정상",
      userImage: "/images/profile13.jpg",
      nickname: "바흐",
      content: "임윤찬은 피아노를 못 쳐!!",
      detailRegDate: "2024.10.20. 19:46"
    },
  ]);
  
  const toggleDetails = (index) => {
    visibleDetails.value = visibleDetails.value === index ? null : index;
  }
  
  
  
  // 검색 기능
  const categories = ['통합검색', '내용 + 닉네임', '내용', '닉네임']; // 검색 카테고리
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
    } else {
      inputPlaceholder.value = `검색할 ${category}을 입력해주세요`
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
  @import url('/public/css/admin/feed/comment.css');
  </style>