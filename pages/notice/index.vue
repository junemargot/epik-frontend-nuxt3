<template>
  <!-- 공지사항 전체 영역 -->
  <div class="notice__wrap">
    <!-- 공지사항 제목 자리 -->
    <div class="notice__title">
      <h2>공지사항</h2>
    </div>
    <!-- 공지사항 항목 -->
    <table class="notice__table">
      <thead class="notice__table-head">
        <tr class="notice__table-head-row">
          <th class="notice__table-number">번호</th>
          <th class="notice__table-title">제목</th>
          <th class="notice__table-author">작성자</th>
          <th class="notice__table-date">작성일</th>
        </tr>
      </thead>
      <!-- 공지사항 내용 -->
      <tbody class="notice__table-body">
        <tr class="notice__table-row">
          <td>20</td>
          <td class="notice__table-title"><a>[안내] 소비자 분쟁해결 기준</a></td>
          <td>관리자</td>
          <td>2024-09-15</td>
        </tr>
        <tr class="notice__table-row">
          <td>19</td>
          <td class="notice__table-title"><a>[이벤트] 09/10(화) 라이브 방송 당첨자 안내</a></td>
          <td>관리자</td>
          <td> 2024-09-15</td>
        </tr>
        <tr class="notice__table-row">
          <td>18</td>
          <td class="notice__table-title"><a>[이벤트] 240909 에스티로더 팝업 구매 인증 이벤트 당첨자 안내</a></td>
          <td>관리자</td>
          <td>2024-09-15</td>
        </tr>
        <tr class="notice__table-row">
          <td>17</td>
          <td class="notice__table-title"><a>[안내] 2024 추석 연휴 고객센터 운영 안내</a></td>
          <td>관리자</td>
          <td>2024-09-10</td>
        </tr>
        <tr class="notice__table-row">
          <td>16</td>
          <td class="notice__table-title"><a>[안내] 팝업스토어 후기 이벤트</a></td>
          <td>관리자</td>
          <td>2024-09-10</td>
        </tr>
        <tr class="notice__table-row">
          <td>15</td>
          <td class="notice__table-title"><a>[안내] 팝업스토어 어워즈 오픈</a></td>
          <td>관리자</td>
          <td>2024-09-10</td>
        </tr>
        <tr class="notice__table-row">
          <td>14</td>
          <td class="notice__table-title"><a>[안내] 2024년 8월 후기 이벤트 당첨자 발표</a></td>
          <td>관리자</td>
          <td>2024-09-10</td>
        </tr>
        <tr class="notice__table-row">
          <td>13</td>
          <td class="notice__table-title"><a>[안내] 2024년 7월 후기 이벤트 당첨자 발표</a></td>
          <td>관리자</td>
          <td>2024-08-10</td>
        </tr>
        <tr class="notice__table-row">
          <td>12</td>
          <td class="notice__table-title"><a>[안내] 에픽 홈페이지 리뉴얼 알림</a></td>
          <td>관리자</td>
          <td>2024-08-08</td>
        </tr>
        <tr class="notice__table-row">
          <td>11</td>
          <td class="notice__table-title"><a>[안내] 6월 팝업 스토어 후기 이벤트</a></td>
          <td>관리자</td>
          <td>2024-06-01</td>
        </tr>
        <tr class="notice__table-row">
          <td>10</td>
          <td class="notice__table-title"><a>[안내] 5월 팝업스토어 후기 이벤트 공지</a></td>
          <td>관리자</td>
          <td>2024-05-01</td>
        </tr>
        <tr class="notice__table-row">
          <td>9</td>
          <td class="notice__table-title"><a>[안내] 에픽 홈페이지 점검 시간 안내</a></td>
          <td>관리자</td>
          <td>2024-05-01</td>
        </tr>
        <tr class="notice__table-row">
          <td>8</td>
          <td class="notice__table-title"><a>[안내] 에픽 팝업스토어 후기 이벤트 '찐후기를 부탁해!'</a></td>
          <td>관리자</td>
          <td>2024-04-20</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <a href="#" class="pagination__prev"><i class="fa-solid fa-angle-left"></i></a>
      <ul class="pagination__list">
      </ul>
      <a href="#" class="pagination__next"><i class="fa-solid fa-angle-right"></i></a>
    </div>

  </div><!--end 공지사항 전체 영역 -->
</template>

<script setup>

</script>

<style scoped>
.notice__wrap {
  width: 858px;
  /* background-color: blanchedalmond; */
  margin: 0 auto;
}

/* 공지사항 제목 영역 */
.notice__title {
  margin-top: 38px;
}

.notice__title h2 {
  font-family: 'pretendard-semibold';
  font-size: 26px;
}

/* 공지사항 항목 영역*/
.notice__table {
  width: 100%;
  table-layout: fixed;
  margin-top: 20px;
  font-family: 'pretendard-regular';
  font-size: 15px;
}

.notice__table-head-row {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.notice__table-head-row th,
.notice__table-row td {
  padding: 15px;
}

.notice__table-row td {
  text-align: center;
  border-bottom: 1px solid #cfcfcf;
}

.notice__table-row .notice__table-title {
  text-align: left;
}

.notice__table-number {
  width: 5%;
}

.notice__table-title {

  width: 55%;
}

.notice__table-author {
  width: 20%;
}

.notice__table-date {
  width: 20%;
}
</style>