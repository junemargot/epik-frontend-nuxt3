<script setup></script>
<template>
  <!-- 공지사항 상세페이지 전체 영역 -->
  <div class="notice-detail__wrap">
    <!-- 공지사항 제목 영역 -->
    <div class="notice-detail__title-wrap">
      <h1 class="notice-detail__title">에픽 홈페이지 오픈 알림</h1>
      <div class="notice-detail__info">
        <span>관리자</span>
        <span>|</span>
        <span>2024.09.23</span>
      </div>
    </div> <!-- end notice-detail__wrap-->

    <!-- 공지사항 내용 영역 -->
    <div class="notice-detail__content">
      <p>
        안녕하세요.에픽입니다.<br>
        에픽 홈페이지가 오픈하여 여러분에게 처음 선보이게 되었습니다.<br>
        <br>
        에픽은 팝업스토어에 대한 소식과 정보를 한 곳에서 알 수 있는 사이트이며 다양한 활동과 이벤트를 통해 팝업스토어를 200% 즐기실 수 있는 즐거운 문화 공간입니다.<br>
        더 즐거운 팝업스토어 플레이를 위해 좋은 서비스를 보여드리겠습니다. 많은 이용과 응원 부탁드립니다.<br>
      </p>
    </div>

    <!-- 목록 버튼-->
    <div class="notice-detail__button">
      <button>목록</button>
    </div>
  </div><!--end 공지사항 전체 영역 -->
</template>

<style scoped>
.notice-detail__wrap {
  width: 858px;
  /* background-color: blanchedalmond; */
  margin: 0 auto;
}

/* 타이틀 영역 */
.notice-detail__title-wrap {
  padding-bottom: 25px;
  border-bottom: 1px solid #858585;
}

.notice-detail__title {
  font-family: 'pretendard-semibold';
  font-size: 26px;
  margin-top: 38px;
}

.notice-detail__info {
  margin-top: 10px;
  color: #858585;
  font-family: 'pretendard-regular';
  font-size: 15px;
}

/* 상세 내용 */
.notice-detail__content {
  padding-top: 20px;
  padding-left: 10px;
  font-family: 'pretendard-regular';
  line-height: 22px;
  padding-bottom: 40px;
  border-bottom: 1px solid #858585;
  height: 300px;
}

/* 버튼 */
.notice-detail__button {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-bottom: 30px;
}

.notice-detail__button button {
  margin-top: 10px;
  display: block;
  width: 150px;
  height: 42px;
  border: none;
  background-color: #b7b7b7;
  color: rgb(255, 255, 255);
  text-align: center;
  font-family: 'pretendard-medium';
  border-radius: 8px;
}
</style>