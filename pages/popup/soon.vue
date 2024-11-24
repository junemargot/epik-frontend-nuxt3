<script setup></script>
<template>
  <div class="wrap">
    <!-- 오픈 예정 팝업 section -->
    <section class="upcoming-popup__wrap">
      <!-- 제목 -->
      <div class="upcoming-popup__title">
        <h1>오픈예정 POPUP</h1>
      </div>
      <!-- 검색창 -->
      <div class="search-bar">
        <form>
          <button type="submit" class="search-bar__submintbutton">
            <i class='bx bx-search search-bar__searchicon icon'></i>
          </button>
          <div class="search-bar__input-wrap search-bar__input-wrap--medium">
            <input type="text" placeholder="검색어를 입력해주세요.">
            <button type="reset" class="search-bar__clear">
              <i class='bx bx-x icon'></i>
            </button>
          </div>
        </form>
      </div>

      <!-- 필터링 버튼 -->
      <div class="upcoming-popup__sort">
        <select>
          <option>최신순</option>
          <option>오래된순</option>
        </select>
      </div>

      <!-- 결과 영역 -->
      <div class="upcoming-popup__items">

        <div class="upcoming-popup__boder-line">
          <div class="upcoming-popup__item">
            <div class="upcoming-popup__item-inner">
              <img src="/images/줄라이팝업.jpg">
              <div class="upcoming-popup__content">
                <div class="upcoming-popup__content-header">
                  <div class="upcoming-popup__info">
                    <span class="upcoming-popup__category">팝업스토어</span>
                    <h4>줄라이 팝업스토어1</h4>
                    <span class="upcoming-popup__address">서울특별시 강남구</span>
                  </div>
                  <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                </div>
                <div class="upcoming-popup__data">
                  <span>24.08.15 - 08.28</span>
                </div>
              </div> <!-- upcoming-popup__content -->
            </div> <!-- upcoming-popup__item-inner -->
          </div> <!-- upcoming-popup__item -->

          <div class="upcoming-popup__item">
            <div class="upcoming-popup__item-inner">
              <img src="/images/줄라이팝업.jpg">
              <div class="upcoming-popup__content">
                <div class="upcoming-popup__content-header">
                  <div class="upcoming-popup__info">
                    <span class="upcoming-popup__category">팝업스토어</span>
                    <h4>줄라이 팝업스토어2</h4>
                    <span class="upcoming-popup__address">서울특별시 강남구</span>
                  </div>
                  <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                </div>
                <div class="upcoming-popup__data">
                  <span>24.08.15 - 08.28</span>
                </div>
              </div> <!-- upcoming-popup__content -->
            </div> <!-- upcoming-popup__item-inner -->
          </div> <!-- upcoming-popup__item -->
        </div>

        <div class="upcoming-popup__boder-line">
          <div class="upcoming-popup__item">
            <div class="upcoming-popup__item-inner">
              <img src="/images/줄라이팝업.jpg">
              <div class="upcoming-popup__content">
                <div class="upcoming-popup__content-header">
                  <div class="upcoming-popup__info">
                    <span class="upcoming-popup__category">팝업스토어</span>
                    <h4>줄라이 팝업스토어3</h4>
                    <span class="upcoming-popup__address">서울특별시 강남구</span>
                  </div>
                  <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                </div>
                <div class="upcoming-popup__data">
                  <span>24.08.15 - 08.28</span>
                </div>
              </div> <!-- upcoming-popup__content -->
            </div> <!-- upcoming-popup__item-inner -->
          </div> <!-- upcoming-popup__item -->


          <div class="upcoming-popup__item">
            <div class="upcoming-popup__item-inner">
              <img src="/images/줄라이팝업.jpg">
              <div class="upcoming-popup__content">
                <div class="upcoming-popup__content-header">
                  <div class="upcoming-popup__info">
                    <span class="upcoming-popup__category">팝업스토어</span>
                    <h4>줄라이 팝업스토어4</h4>
                    <span class="upcoming-popup__address">서울특별시 강남구</span>
                  </div>
                  <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                </div>
                <div class="upcoming-popup__data">
                  <span>24.08.15 - 08.28</span>
                </div>
              </div> <!-- upcoming-popup__content -->
            </div> <!-- upcoming-popup__item-inner -->
          </div> <!-- upcoming-popup__item -->
        </div>


        <div class="upcoming-popup__boder-line">
          <div class="upcoming-popup__item">
            <div class="upcoming-popup__item-inner">
              <img src="/images/줄라이팝업.jpg">
              <div class="upcoming-popup__content">
                <div class="upcoming-popup__content-header">
                  <div class="upcoming-popup__info">
                    <span class="upcoming-popup__category">팝업스토어</span>
                    <h4>줄라이 팝업스토어1</h4>
                    <span class="upcoming-popup__address">서울특별시 강남구</span>
                  </div>
                  <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                </div>
                <div class="upcoming-popup__data">
                  <span>24.08.15 - 08.28</span>
                </div>
              </div> <!-- upcoming-popup__content -->
            </div> <!-- upcoming-popup__item-inner -->
          </div> <!-- upcoming-popup__item -->

          <div class="upcoming-popup__item">
            <div class="upcoming-popup__item-inner">
              <img src="/images/줄라이팝업.jpg">
              <div class="upcoming-popup__content">
                <div class="upcoming-popup__content-header">
                  <div class="upcoming-popup__info">
                    <span class="upcoming-popup__category">팝업스토어</span>
                    <h4>줄라이 팝업스토어2</h4>
                    <span class="upcoming-popup__address">서울특별시 강남구</span>
                  </div>
                  <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                </div>
                <div class="upcoming-popup__data">
                  <span>24.08.15 - 08.28</span>
                </div>
              </div> <!-- upcoming-popup__content -->
            </div> <!-- upcoming-popup__item-inner -->
          </div> <!-- upcoming-popup__item -->
        </div>
      </div> <!-- upcoming-popup__items -->


      <!-- 페이지 네이션 -->
      <div class="pagination">
        <a href="#" class="pagination__prev"><i class="fa-solid fa-angle-left"></i></a>

        <ul class="pagination__list">
        </ul>
        <a href="#" class="pagination__next"><i class="fa-solid fa-angle-right"></i></a>
      </div>

    </section>
  </div>
</template>
<style scoped>
.wrap {
  width: 960px;
  margin: 0 auto;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--color-grey-6);
}

.search-bar__submintbutton {
  position: absolute;
  top: 11px;
  left: 10px;
  border: none;
  background-color: var(--white);
}

.search-bar__submintbutton>.icon {
  font-size: 18px;
  color: var(--color-grey-6);
}

.search-bar__input-wrap {
  width: 870px;
  background-color: var(--white);
  padding: 10px;
  border: 1px solid var(--color-grey-4);
  border-radius: var(--border-5);
  margin-bottom: 10px;
}

.search-bar__input-wrap>input {
  border: none;
  width: 800px;
  margin-left: 35px;
  font-size: 15px;
}

.search-bar__input-wrap>input::placeholder {
  color: rgba(0, 0, 0, 0.3);
  font-size: 14px;
}

.search-bar__clear {
  position: absolute;
  width: 25px;
  height: 25px;
  top: 10px;
  right: 20px;
  border: none;
  background-color: var(--white);
  display: none;
}

.search-bar__clear>.icon {
  position: absolute;
  top: 0px;
  right: 5px;
  font-size: 25px;
  color: var(--color-grey-6);
}

/* input:placeholder-shown */
.search-bar__input-wrap input:not(:placeholder-shown)+.search-bar__clear {
  display: block;
}

input:focus::placeholder {
  color: transparent;
}

.upcoming-popup__wrap {
  padding: 25px 42px;
}

.upcoming-popup__title {
  margin-top: 25px;
  margin-bottom: 20px;
  font-family: 'pretendard-semibold';
  font-size: 26px;
}

/* 필터링 */
.upcoming-popup__sort {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 5px;
}

.upcoming-popup__sort select {
  border-radius: 10px;
  width: 96px;
  height: 26px;
  padding: 0 8px;
}

/* 콘텐츠 영역 */

.upcoming-popup__items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  width: 874px;
  /* border-bottom: 1px solid var(--color-grey-6); */
}

.upcoming-popup__boder-line {
  display: flex;
  border-bottom: 1px solid var(--color-grey-6);
}

.upcoming-popup__item {
  padding: 9px;
  width: 410px;
  border: 1px solid transparent;
  /* 미리 보더를 정의 */
  border-radius: var(--border-3);
  margin-top: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  /* 패딩과 보더를 요소 크기에 포함 */
  transition: border-color 0.3s ease;
  /* 보더 색상만 변경하도록 애니메이션 */
}

/* 컨텐츠 사이 띄우기 */
.upcoming-popup__item:first-child,
.upcoming-popup__item:nth-child(3),
.upcoming-popup__item:nth-child(5) {
  margin-right: 10px;
}

.upcoming-popup__item:hover {
  border-color: var(--accent-1);
  /* 호버 시 보더 색상만 변경 */
}

.upcoming-popup__item-inner {
  display: flex;
}

.upcoming-popup__item-inner img {
  width: 145px;
  height: 145px;
  border-radius: var(--border-2);
}

.upcoming-popup__content {
  width: 100%;
  margin-top: 5px;
  margin-left: 16px;
  margin-right: 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

.upcoming-popup__content-header {
  display: flex;
  justify-content: space-between;
}

.upcoming-popup__content-header i {
  font-size: 20px;
}

.upcoming-popup__category {
  font-family: 'pretendard-regular';
  font-size: 10px;
  display: block;
  margin-bottom: 7px;
}

.upcoming-popup__info h4 {
  font-family: 'pretendard-bold';
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
}

.upcoming-popup__address {
  font-family: 'pretendard-medium';
  font-size: 14px;
  color: var(--color-grey-7);
}


.upcoming-popup__data {
  display: flex;
  justify-content: flex-end;
  font-family: 'pretendard-regular';
  font-size: 13px;
  color: var(--color-grey-7);
}

.fa-solid.fa-bookmark {
  color: var(--accent-1);
}
</style>