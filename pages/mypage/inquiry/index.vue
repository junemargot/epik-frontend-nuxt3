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
          <button class="personal-inqury-btn"><a href="#"></a>
            1:1 문의 접수
          </button>
        </div>

        <div>
          <form>
            <fieldset class="gap-mt_2">
              <label>
                <select class="form">
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

          <form class="gap-mt_2">
            <select class="grey-long_btn">
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
          <li class="inquryList__list">
            <img class="inquryList__icon" src="/public/images/mypage/q.png">
            <span class="inquryList__list-arrange ">
              <span class="agree_text_bold">문의1번</span>
              <span class="small_text">2015.03.03</span>
            </span>
          </li>

          <li class="inquryList__list">
            <img class="inquryList__icon" src="/public/images/mypage/q.png">
            <span class="inquryList__list-arrange ">
              <span class="agree_text_bold">문의2번</span>
              <span class="small_text">2015.03.03</span>
            </span>
          </li>
        </ul>
      </div>

    </section>
  </main>
</template>

<script>
</script>

<style>
@import url('/public/css/mypage/inqury.css');
</style>