<template>
  <div class="main-wrap">
    <section class="product__container">
      <!-- BOARD HEADER -->
      <div class="product__header">
        <div class="product__category">
          <a href="/admin/content/exhibition/list.html">
            <strong>전시회</strong>
            <i class='bx bx-chevron-right'></i>
          </a>
        </div>
        <div class="product__title">
          <div class="product__title-text">우연히 웨스 앤더슨 2</div>
        </div>
        <div class="product__registration">
          <div class="product__registration-writer-info">
            <span class="name">관리자1</span>
            <div class="product__registration-date">
              <span>2024.10.10 14:30</span>
            </div>
          </div>
        </div>
      </div>
      <!-- END PRODUCT HEADER -->
      <!-- PRODUCT CONTENT -->
      <div class="product__content">
        <div class="product__content-summary">
          <div class="product__content-poster">
            <!-- <img src="/images/exhibition.gif" alt="웨스앤더슨 포스터" /> -->
            <img :src="`http://localhost:8080/api/v1/uploads/exhibition/${exhibition.saveImageName}`" />
          </div>
          <ul class="product__content-info">
            <li class="product__content-info-item">
              <div class="infoLabel">장소</div>
              <div class="infoDesc">그라운드시소 센트럴</div>
            </li>
            <li class="product__content-info-item">
              <div class="infoLabel">공연기간</div>
              <div class="infoDesc">
                <span name="startDate">2024.10.18</span>
                <span>~</span>
                <span name="endDate">2025.04.13</span>
              </div>
            </li>
            <li class="product__content-info-item">
              <div class="infoLabel">관람시간</div>
              <div class="infoDesc" name="runningTime">50분</div>
            </li>
            <li class="product__content-info-item">
              <div class="infoLabel">관람연령</div>
              <div class="infoDesc" name="ageRestriction">전체관람가</div>
            </li>
            <li class="product__content-info-item">
              <div class="infoLabel">가격</div>
              <div class="infoDesc">
                <ul class="infoPriceList">
                  <li class="infoPriceItem">
                    <span class="seat" name="seat">입장권</span>
                    <span class="price" name="price">18,000원</span>
                  </li>
                </ul>
              </div>
            </li>
            <li class="product__content-info-item">
              <div class="infoLabel">예매처</div>
              <div class="infoDesc ticketGroup">
                <span class="ticketName" name="name">
                  <a href="https://tickets.interpark.com/goods/24013174" target="_blank" name="link">인터파크</a>
                </span>
                <span class="ticketName" name="name">
                  <a href="https://booking.naver.com/booking/5/bizes/1225096" target="_blank" name="link">네이버</a>
                </span>
              </div>
            </li>
          </ul>
        </div>
        <!-- END PRODUCT SUMMARY -->

        <!-- PRODUCT CONTENT DETAIL -->
        <div class="product__content-detail">
          <p>
            관람시간 정보
            매일 10:00~19:00 <br />
            입장 마감: 18:00 <br />
            휴관 안내: 12/2(월), 1/6(월), 2/3(월) *공휴일 정상 운영
            <br />
            <br />
            <br />
            공지사항
            ＊본 티켓은 별도 배송 되지 않으며, 현장 매표소에서 예매자 성함 및 연락처 확인 후 입장하실 수 있습니다. <br />
            ＊취소 및 환불 규정은 2025년 4월 12일 17시까지 가능하며, 이후 취소 및 환불은 불가합니다. <br />
            <br />
            <br />
            <br />
            상세정보
            <img src="/images/exhibition_detail.jpg" alt="웨스앤더슨 상세" />
          </p>
        </div>
        <div class="product__content-detail-info">
          상세 정보
          <div class="product__content-detail-info-map">
            <span class="address">서울특별시 중구 남대문로5가 831 그랜드센트럴 3F 그라운드시소 센트럴</span>
          </div>
          <div class="product__content-detail-links">
            <div class="instagram" name="snsLink">
              <a href="https://www.instagram.com/groundseesaw/" target="_blank">인스타그램
                <span>https://www.instagram.com/groundseesaw/</span></a>
            </div>
            <div class="web" name="webLink">
              <a href="https://groundseesaw.co.kr/" target="_blank">공식 홈페이지
                <span>https://groundseesaw.co.kr/</span>
              </a>
            </div>
          </div>
          <div class="product__content-buttons">
            <button type="button" class="service">서비스 홈페이지로 이동</button>
            <RouterLink to="/admin/contents/exhibition">
              <button type="button" class="list">목록으로 이동</button>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>

</script>

<style lang="css" scoped>
@import url('/public/css/admin/contents/exhibition/detail.css');
</style>