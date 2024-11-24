<template>
  <main class="mypage-wrap">
    <section class="inquryList__wrap small-wrap">
      <div class="inquryList__intro">
        <h1 class="inquryList__title intro-title">
          문의 내역
        </h1>
      </div>

      <div>
        <div class="inquryList__personal">
          <a href="http://localhost:3000/mypage/inquiry/write"> <button class="personal-inqury-btn">1:1 문의 접수</button></a>
        </div>

        <div>
          <form>
            <fieldset class="gap-mt_2">
              <label>
                <select class="form select_form1">
                  <option>1개월</option>
                  <option>3개월</option>
                  <option>6개월</option>
                  <option>9개월</option>
                  <option>12개월</option>
                </select>
              </label>
            </fieldset>

            <fieldset class="inquryList__date gap-mt_2">
              <label>
                <input class="select_short" type="date" max="2024-12-25" min="2024-09-18">
              </label>

              <span> ~ </span>

              <label>
                <input class="select_short" type="date" max="2024-12-25" min="2024-09-18">
              </label>
            </fieldset>
          </form>

          <div class="gap-bt_1 gap-mt_2">
            <button class="long_btn red_btn">
              조회
            </button>
          </div>

          <form class="gap-mt_2 ">
            <select class="grey-long_btn select_form2">
              <option>전체</option>
              <option>준비 중 </option>
              <option>처리 중</option>
              <option>처리 완료</option>
            </select>
          </form>

        </div>
      </div>


      <hr class="hr_2">

      <div>
        <ul class="">
          <a href="http://localhost:3000/mypage/inquiry/%7Bid%7D/answer">
          <li class="inquryList__list">
            <img class="inquryList__icon" src="/public/images/mypage/q.png">
            <span class="inquryList__list-arrange ">
              <span class="agree_text_bold">닉네임 관련 문의 있습니다</span>
              <span class="small_text">2024.10.03</span>
            </span>
          </li>
        </a>

        </ul>
      </div>

    </section>
  </main>
</template>

<script>
</script>

<style>
@import url('/public/css/mypage/inqury.css');

.personal-inqury-btn:hover
{
  background-color: var(--accent-1) ;
  color: white;
}

.long_btn:hover
{
  background-color: var(--white) ;
  color: var(--accent-1);
  font-weight: bold;
}


.select_form1 {
  padding-top: 4px; /* 글자가 폼 안에서 위로 올라가도록 padding-top을 조정 */
  line-height: 1.4;  /* line-height로 텍스트 간격도 조정 가능 */
  padding-left: 5px;

  padding-right: 10px; /* 화살표가 너무 오른쪽에 위치하지 않도록 조정 */
  appearance: none; /* 기본 화살표 제거 */
  -webkit-appearance: none; /* Safari에서 기본 화살표 제거 */
  -moz-appearance: none; /* Firefox에서 기본 화살표 제거 */
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="0,0 100,0 50,50" fill="gray"/></svg>') no-repeat scroll right 10px center; /* 커스텀 화살표 */
  background-size: 10px; /* 화살표 크기 */
  background-position-x: 95%;; /* 화살표 위치를 오른쪽에서 10px로 조정 */

  color: black; /* 텍스트 색상 변경 */
}


.select_form2 {
  padding: 10px; /* padding 추가하여 버튼 크기 조정 */
  padding-left: 10px;
 
  background-color: #f7f7f7; /* 배경색 */
  color: black; /* 텍스트 색상 검정색 */
  font-size: 12px;
  font-weight: lighter;

  appearance: none; /* 기본 화살표 제거 */
  -webkit-appearance: none; /* Safari에서 기본 화살표 제거 */
  -moz-appearance: none; /* Firefox에서 기본 화살표 제거 */
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="0,0 100,0 50,50" fill="gray"/></svg>') no-repeat scroll right 10px center; /* 커스텀 화살표 */
  background-size: 10px; /* 화살표 크기 */
  background-position-x: 95%; /* 화살표 위치를 오른쪽에서 10px로 조정 */

}





</style>