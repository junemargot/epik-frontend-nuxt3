<script setup>
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

    <!-- 새로운 영역(좋아요) -->
    <div class="my-feed__wrap">
      <!--  첫째 줄 -->
      <div class="my-feed__header">
        <div class="my-feed__likes">
          <i class='bx bx-heart'></i>
          <span>좋아요</span>
        </div>
        <div class="my-feed__sort">
          <select>
            <option>최신순</option>
            <option>오래된순</option>
          </select>
        </div>
      </div>

      <!-- 두번째 줄(그리드) -->
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

    </div>
  </section><!-- section end -->
</template>

<style scoped>
@import url('public/css/feed/index.css');
@import url('public/css/feed/my.css');

.my-feed__header {
  display: flex;
  justify-content: space-between;
  margin: 18px 0;
  align-items: center;
}

.my-feed__likes span {
  font-family: 'pretendard-semibold';
}

.my-feed__sort select {
  border-radius: 10px;
  width: 96px;
  height: 26px;
  padding: 0 8px;
}
</style>