<template>
  <main class="mypage-wrap">
    <section class="inqury-answer__wrap small-wrap">
      <div class="inqury-answer__info">
        <h1 class="inqury-answer__title intro-title">
          1:1 문의 상세
        </h1>
      </div>

      <form>
        <fieldset>
          <label>
            <div class="gap-mt_3">내용</div>
            <div class="gap-mt_1">
              <input class="form" type="text" placeholder="문의있어요">
            </div>
          </label>
        </fieldset>


        <fieldset>
          <label>
            <div class="gap-mt_1">
              <textarea id="inqury-answer__content" class="mid_big_form" type="text" placeholder="문의내용 문의내용 뮨의내용."
                maxlength="500"></textarea>
              <!-- <span class="inqury-answer__content-count">0/500</span> -->
            </div>
          </label>
        </fieldset>

        <fieldset>
          <label>
            <div class="gap-mt_2">답변</div>
            <div class="gap-mt_1">
              <textarea id="inqury-answer__answer" class="middle_form" type="text" placeholder="답변 답변 답변"
                maxlength="500"></textarea>
              <!-- <span class="inqury-answer__content-count">0/500</span> -->
            </div>
          </label>
        </fieldset>
      </form>

      <div class="inqury-answer__menu gap-mt_2">
        <button class="small_btn_grey">목록</button>
      </div>

    </section>
  </main>
</template>

<script>
</script>

<style>
@import url('/public/css/mypage/inqury.css');
</style>