<script setup>
</script>
<template>
  <div class="wrap">
    <section class="main">
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

      <div class="search-results">

        <div class="filter-buttons">
          <ul class="filter-buttons__list">
            <li class="filter-buttons__item">
              <button>통합검색<span>(35)</span></button>
            </li>
            <li class="filter-buttons__item">
              <button>팝업<span>(18)</span></button>
            </li>
            <li class="filter-buttons__item">
              <button>콘서트<span>(5)</span></button>
            </li>
            <li class="filter-buttons__item">
              <button>뮤지컬<span>(12)</span></button>
            </li>
            <li class="filter-buttons__item">
              <button>전시회<span>(0)</span></button>
            </li>
          </ul>
        </div> <!-- filter-buttons -->

        <div class="search-results__items">

          <div class="boder-line">
            <div class="search-results__item">
              <div class="search-results__item-inner">
                <img src="/images/줄라이팝업.jpg">
                <div class="badge">진행중</div>
                <div class="search-results__content">
                  <div class="search-results__content-header">
                    <div class="search-results__info">
                      <span class="search-results__category">팝업스토어</span>
                      <h4>줄라이 팝업스토어1</h4>
                      <span class="search-results__address">서울특별시 강남구</span>
                    </div>
                    <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                  </div>
                  <div class="search-results__data">
                    <span>24.08.15 - 08.28</span>
                  </div>
                </div> <!-- search-results__content -->
              </div> <!-- search-results__item-inner -->
            </div> <!-- search-results__item -->

            <div class="search-results__item">
              <div class="search-results__item-inner">
                <img src="/images/줄라이팝업.jpg">
                <div class="badge">진행중</div>
                <div class="search-results__content">
                  <div class="search-results__content-header">
                    <div class="search-results__info">
                      <span class="search-results__category">팝업스토어</span>
                      <h4>줄라이 팝업스토어2</h4>
                      <span class="search-results__address">서울특별시 강남구</span>
                    </div>
                    <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                  </div>
                  <div class="search-results__data">
                    <span>24.08.15 - 08.28</span>
                  </div>
                </div> <!-- search-results__content -->
              </div> <!-- search-results__item-inner -->
            </div> <!-- search-results__item -->
          </div>

          <div class="boder-line">
            <div class="search-results__item">
              <div class="search-results__item-inner">
                <img src="/images/줄라이팝업.jpg">
                <div class="badge">진행중</div>
                <div class="search-results__content">
                  <div class="search-results__content-header">
                    <div class="search-results__info">
                      <span class="search-results__category">팝업스토어</span>
                      <h4>줄라이 팝업스토어3</h4>
                      <span class="search-results__address">서울특별시 강남구</span>
                    </div>
                    <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                  </div>
                  <div class="search-results__data">
                    <span>24.08.15 - 08.28</span>
                  </div>
                </div> <!-- search-results__content -->
              </div> <!-- search-results__item-inner -->
            </div> <!-- search-results__item -->


            <div class="search-results__item">
              <div class="search-results__item-inner">
                <img src="/images/줄라이팝업.jpg">
                <div class="badge">진행중</div>
                <div class="search-results__content">
                  <div class="search-results__content-header">
                    <div class="search-results__info">
                      <span class="search-results__category">팝업스토어</span>
                      <h4>줄라이 팝업스토어4</h4>
                      <span class="search-results__address">서울특별시 강남구</span>
                    </div>
                    <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                  </div>
                  <div class="search-results__data">
                    <span>24.08.15 - 08.28</span>
                  </div>
                </div> <!-- search-results__content -->
              </div> <!-- search-results__item-inner -->
            </div> <!-- search-results__item -->
          </div>


          <!-- 삭제 -->
          <div class="boder-line">
            <div class="search-results__item">
              <div class="search-results__item-inner">
                <img src="/images/줄라이팝업.jpg">
                <div class="badge">진행중</div>
                <div class="search-results__content">
                  <div class="search-results__content-header">
                    <div class="search-results__info">
                      <span class="search-results__category">팝업스토어</span>
                      <h4>줄라이 팝업스토어1</h4>
                      <span class="search-results__address">서울특별시 강남구</span>
                    </div>
                    <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                  </div>
                  <div class="search-results__data">
                    <span>24.08.15 - 08.28</span>
                  </div>
                </div> <!-- search-results__content -->
              </div> <!-- search-results__item-inner -->
            </div> <!-- search-results__item -->

            <div class="search-results__item">
              <div class="search-results__item-inner">
                <img src="/images/줄라이팝업.jpg">
                <div class="badge">진행중</div>
                <div class="search-results__content">
                  <div class="search-results__content-header">
                    <div class="search-results__info">
                      <span class="search-results__category">팝업스토어</span>
                      <h4>줄라이 팝업스토어2</h4>
                      <span class="search-results__address">서울특별시 강남구</span>
                    </div>
                    <i class="fa-regular fa-bookmark bookmarkcheck"></i>
                  </div>
                  <div class="search-results__data">
                    <span>24.08.15 - 08.28</span>
                  </div>
                </div> <!-- search-results__content -->
              </div> <!-- search-results__item-inner -->
            </div> <!-- search-results__item -->
          </div>
        </div> <!-- search-results__items -->
      </div> <!-- search-results -->

      <!-- pagination -->

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


.main {
  padding: 25px 42px;
}

.search-bar__input-wrap--medium {
  width: 853px;
}

.filter-buttons {
  margin-top: 30px;
  border: 1px solid var(--color-grey-6);
  border-top-left-radius: var(--border-2);
  border-top-right-radius: var(--border-2);
}

.filter-buttons__list {
  display: flex;
  text-align: center;
}

.filter-buttons__item {
  width: 33%;
  padding: 15px;
}

.filter-buttons__item button,
.filter-buttons__item span {
  font-family: 'pretendard-regular';
}

.filter-buttons__item:not(:nth-child(1)) {
  border-left: 1px solid var(--color-grey-6);
}

.filter-buttons__item span {
  font-size: 15px;
}

.filter-buttons__item button {
  border: none;
  font-size: 15px;
}

/* 검색 결과 */

.search-results__items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  width: 874px;
  border-left: 1px solid var(--color-grey-6);
  border-right: 1px solid var(--color-grey-6);
  border-bottom: 1px solid var(--color-grey-6);
}

.boder-line {
  display: flex;
  border-bottom: 1px solid var(--color-grey-6);
}

.boder-line:last-child {
  border: none;
}


.search-results__item {
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
.search-results__item:first-child,
.search-results__item:nth-child(3),
.search-results__item:nth-child(5) {
  margin-right: 10px;
}

.search-results__item:hover {
  border-color: var(--accent-1);
  /* 호버 시 보더 색상만 변경 */
}

.search-results__item-inner {
  display: flex;
  position: relative;
}

.search-results__item-inner img {
  width: 145px;
  height: 145px;
  border-radius: var(--border-2);
}

.badge {
  position: absolute;
  top: 7px;
  left: 8px;
  border: 1px solid var(--color-grey-8);
  border-radius: var(--border-2);
  background-color: var(--color-grey-2);
  width: 41px;
  height: 18px;
  font-size: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'pretendard-semibold';
}

.search-results__content {
  width: 100%;
  margin-top: 5px;
  margin-left: 16px;
  margin-right: 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

.search-results__content-header {
  display: flex;
  justify-content: space-between;
}

.search-results__content-header i {
  font-size: 20px;
}

.search-results__category {
  font-family: 'pretendard-regular';
  font-size: 10px;
  display: block;
  margin-bottom: 7px;
}

.search-results__info h4 {
  font-family: 'pretendard-bold';
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
}

.search-results__address {
  font-family: 'pretendard-medium';
  font-size: 14px;
  color: var(--color-grey-7);
}


.search-results__data {
  display: flex;
  justify-content: flex-end;
  font-family: 'pretendard-regular';
  font-size: 13px;
  color: var(--color-grey-7);
}

.fa-solid.fa-bookmark {
  color: var(--accent-1);
}

/* pagination */

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.pagination__list {
  display: flex;
  margin: 0px 10px;
}

.pagination__list li {
  list-style: none;
  margin: 0px 3px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid var(--color-grey-6);
  border-radius: var(--border-2);
}

.pagination__list li a {
  font-size: 14px;
  text-decoration: none;
  color: var(--black);
  display: block;
  transition: 0.2s;
}

.pagination__list li .active_page {
  background-color: var(--color-grey-9);
  color: var(--white);
  border-radius: 8px;
}

.pagination__list li a:hover,
.pagination__list a:hover {
  background-color: var(--color-grey-9);
  color: var(--white);
  border-radius: var(--border-2);
}

/* --- prev,next -------*/

.pagination__prev,
.pagination__next {
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid var(--color-grey-6);
  border-radius: 6px;
}

.pagination-icon {
  width: 20px;
  height: 20px;
  line-height: 40px;
  font-size: 14px;
}
</style>