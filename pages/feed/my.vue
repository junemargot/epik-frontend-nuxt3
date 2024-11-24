<script setup>
const isMyDropdownOpen = ref(false);

const toggleMyDropdown = () => {
  isMyDropdownOpen.value = !isMyDropdownOpen.value;
}
</script>
<template>
  <section class="feed">
    <div class="feed__header"> <!-- 맨 첫 줄-->
      <h1 class="feed__title">feed</h1>
      <!-- 검색창 -->
      <!-- <div class="feed__search"> -->
      <form class="feed__form">
        <input class="feed__input" id="feed-search" type="text" placeholder="검색어를 입력해주세요">
        <label for="feed-search">
          <i class="fa-solid fa-magnifying-glass"></i>
        </label>
        <input type="submit" value="submit" style="display: none;">
      </form>
      <!-- </div> -->
    </div>

    <div class="feed__menu"> <!--메뉴버튼 줄-->
      <div class="feed__menu-column">
        <span>all</span>
        <span>my</span>
      </div>

      <div class="feed__menu-column">
        <span>pop-up</span>
        <span>concert</span>
        <span>musical</span>
        <span>exhibition</span>
      </div>
    </div>

    <!-- 새로운 영역 시작 -->
    <div class="my-feed__wrap">
      <!-- 프로필 -->
      <div class="my-feed__user-profile">
        <img class="my-feed__user-image" src="/images/동글이.jpg" alt="img">
        <div class="my-feed__info">
          <span class="my-feed__user-name">jeonguii</span>
          <p class="my-feed__description">클덕 1년차<br>베토벤과 브람스 그리고 후기낭만주의를 좋아합니다.</p>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="my-feed__buttons">
        <a class="my-feed__profile-edit">프로필 편집</a>
        <div class="my-feed__dropdown">
          <button class="my-feed__options" @click="toggleMyDropdown">
            <i class='bx bx-dots-horizontal-rounded'></i>
          </button>
          <ul class="dropdown-list myfeed-dropdown-list" v-if="isMyDropdownOpen">
            <li>
              <a>피드 작성</a>
            </li>
            <li>
              <a>좋아요한 피드</a>
            </li>
          </ul>
        </div>

      </div>

      <!-- 사진 영역 -->
      <div class="my-feed__container">
        <div class="my-feed__item">
          <a><img src="/images/item(1).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(2).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(3).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(4).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(1).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(2).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(3).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(4).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(1).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(2).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(3).jpg" alt=""></a>
        </div>

        <div class="my-feed__item">
          <a><img src="/images/item(4).jpg" alt=""></a>
        </div>
      </div>

      <!-- 빈 피드일 경우 표시 -->
      <!-- 피드 길이가 0인 경우 표시되게 수정 필요 -->
      <div class="my-feed__empty">
        <div class="my-feed__empty-icon">
          <i class='bx bx-camera my-feed__icon-location'></i>
        </div>
        <span>게시물 없음</span>
      </div>

    </div> <!-- my-feed__wrap end -->


  </section><!-- section end -->
</template>

<style scoped>
@import url('public/css/feed/index.css');
@import url('public/css/feed/my.css');
</style>