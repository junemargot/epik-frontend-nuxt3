<template>
  <div class="main-wrap">
    <section class="product__container" v-if="exhibition">
      <div class="product__header">
        <div class="product__category">
          <RouterLink href="/admin/content/exhibition">
            <strong>전시회</strong>
            <i class='bx bx-chevron-right'></i>
          </RouterLink>
        </div>
        <div class="product__title">
          <div class="product__title-text">{{ exhibition.title }}</div>
        </div>
        <div class="product__registration">
          <div class="product__registration-writer-info">
            <span class="name">{{ exhibition.writer }}</span>
            <div class="product__registration-date">
              <span>{{ formatDate(exhibition.writeDate) }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- END PRODUCT HEADER -->
      <!-- PRODUCT CONTENT -->
      <div class="product__content">
        <div class="product__content-summary">
          <div class="product__content-poster">
            <img :src="`http://localhost:8081/api/v1/uploads/images/exhibition/${exhibition.saveImageName}`" />
          </div>
          <ul class="product__content-info">
            <li class="product__content-info-item">
              <div class="infoLabel">장소</div>
              <div class="infoDesc">{{ exhibition.venue }}</div>
            </li>
            <li class="product__content-info-item">
              <div class="infoLabel">공연기간</div>
              <div class="infoDesc">
                <span name="startDate">{{ formatDate(exhibition.startDate) }}</span>
                <span>~</span>
                <span name="endDate">{{ formatDate(exhibition.endDate) }}</span>
              </div>
            </li>
            <li class="product__content-info-item">
              <div class="infoLabel">관람시간</div>
              <div class="infoDesc" name="runningTime">{{ exhibition.runningTime }}</div>
            </li>
            <li class="product__content-info-item">
              <div class="infoLabel">관람연령</div>
              <div class="infoDesc" name="ageRestriction">{{ exhibition.ageRestriction }}</div>
            </li>
            <li class="product__content-info-item">
              <div class="infoLabel">가격</div>
              <div class="infoDesc">
                <ul class="infoPriceList">
                  <li class="infoPriceItem" v-for="(price) in exhibition.ticketPrices" :key="price.id">
                    <span class="seat" name="seat">{{ price.seat }}</span>
                    <span class="price" name="price">{{ price.price }}</span>
                  </li>
                </ul>
              </div>
            </li>
            <li class="product__content-info-item">
              <div class="info__title">예매처</div>
              <div class="info__desc ticketGroup">
                <span class="ticketName" name="name" v-for="office in exhibition.ticketOffices" :key="office.id">
                  <a :href="office.link" target="_blank" name="link">{{ office.name }}</a>
                </span>
              </div>
            </li>
          </ul>
        </div>
        <!-- END PRODUCT SUMMARY -->

        <!-- PRODUCT CONTENT DETAIL -->
        <div class="product__content-detail">
          <h2>전시 정보</h2>
          <div v-html="exhibition.content"></div>
        </div>
        <div class="product__content-detail-info">
          <h2>상세 정보</h2>
          <div class="product__content-detail-info-map">
            <span class="address">{{ exhibition.address }}</span>
          </div>
          <!-- 하단 버튼 -->
          <div class="product__content-buttons">
            <button type="button" class="service">서비스 홈페이지로 이동</button>
            <RouterLink to="/admin/contents/exhibition">
              <button type="button" class="list">목록으로 이동</button>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
    <div v-else>전시회 데이터 로딩중</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const exhibitionId = route.params.id;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const exhibition = ref(null);
const error = ref(null);

watchEffect(async () => {
  const { data } = await useFetch(`/admin/exhibition/${exhibitionId}`, {
    baseURL: apiBase,
    key: `exhibition-${exhibitionId}`,
  });

  if(data.value) {
    exhibition.value = data.value;
  }
});

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '.').replace(/\.$/, '');
};

onMounted(async () => {
  // await fetchExhibitionDetail();
})
</script>

<style lang="css" scoped>
@import url('/public/css/admin/contents/exhibition/detail.css');

/* :deep 선택자를 사용하여 v-html 내부 요소에 스타일 적용 */
:deep(.product__content-detail img) {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin-bottom: 30px;
}
</style>