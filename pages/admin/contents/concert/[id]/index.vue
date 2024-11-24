<template>
  <div class="main-wrap">
    <section class="product__container" v-if="concert">
      <div class="product__header">
        <div class="product__category">
          <RouterLink href="/admin/content/concert">
            <strong>콘서트</strong>
            <i class='bx bx-chevron-right'></i>
          </RouterLink>
        </div>
        <div class="product__title">
          <div class="product__title-text">{{ concert.title }}</div>
        </div>
        <div class="product__registration">
          <div class="product__registration-writer-info">
            <span class="name">{{ concert.writer }}</span>
            <div class="product__registration-date">
              <span>{{ formatDate(concert.writeDate) }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- END PRODUCT HEADER -->
      <!-- PRODUCT CONTENT -->
      <div class="product__content">
        <div class="product__content-summary">
          <div class="product__content-poster">
            <img :src="`http://localhost:8081/api/v1/uploads/images/concert/${concert.saveImageName}`" />
          </div>
          <ul class="product__content-info">
            <li class="product__content-info-item">
              <div class="info__title">장소</div>
              <div class="info__desc">{{ concert.venue }}</div>
            </li>
            <li class="product__content-info-item">
              <div class="info__title">공연기간</div>
              <div class="info__desc">
                <span name="startDate">{{ formatDate(concert.startDate) }}</span>
                <span>~</span>
                <span name="endDate">{{ formatDate(concert.endDate) }}</span>
              </div>
            </li>
            <li class="product__content-info-item">
              <div class="info__title">공연시간</div>
              <div class="info__desc" name="runningTime">{{ concert.runningTime }}</div>
            </li>
            <li class="product__content-info-item">
              <div class="info__title">관람연령</div>
              <div class="info__desc" name="ageRestriction">{{ concert.ageRestriction }}</div>
            </li>
            <li class="product__content-info-item">
              <div class="info__title">가격</div>
              <div class="info__desc">
                <ul class="infoPriceList">
                  <li class="infoPriceItem" v-for="(price) in concert.ticketPrices" :key="price.id">
                    <span class="seat" name="seat">{{ price.seat }}</span>
                    <span class="price" name="price">{{ price.price }}</span>
                  </li>
                </ul>
              </div>
            </li>
            <li class="product__content-info-item">
              <div class="info__title">예매처</div>
              <div class="info__desc ticketGroup">
                <span class="ticketName" name="name" v-for="office in concert.ticketOffices" :key="office.id">
                  <a :href="office.link" target="_blank" name="link">{{ office.name }}</a>
                </span>
              </div>
            </li>
          </ul>
        </div>
        <!-- END PRODUCT SUMMARY -->

        <!-- PRODUCT CONTENT DETAIL -->
        <div class="product__content-detail">
          <h2>공연 정보</h2>
          <div v-html="concert.content"></div>
        </div>
        <div class="product__content-detail-info">
          <h2>상세 정보</h2>
          <div class="product__content-detail-info-map">
            <span class="address" name="address">{{ concert.address }}</span>
          </div>
          <!-- 하단 버튼 -->
          <div class="product__content-buttons">
            <button type="button" class="service">서비스 홈페이지로 이동</button>
            <RouterLink to="/admin/contents/concert">
              <button type="button" class="list">목록으로 이동</button>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
    <div v-else>콘서트 데이터 로딩중</div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const concertId = route.params.id;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상태 관리 위한 ref 선언
const concert = ref(null);
const error = ref(null);

// 데이터 가져오기
watchEffect(async () => {
  const { data } = await useFetch(`/admin/concert/${concertId}`, {
    baseURL: apiBase,
    key: `concert-${concertId}`,
  });

  if (data.value) {
    concert.value = data.value;
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
  await fetchConcertDetail();
});


// const concertTitle = ref("OneRepublic The Artificial Paradise Tour in Korea");
// const writerName = ref("관리자1");
// const registrationDate = ref("2024.10.10. 14:30");
// const concertPoster = ref("/images/concert_thumb.gif");
// const concertInfo = ref([
//   { title: '장소', desc: '인스파이어 아레나'},
// ]);
// const startDate = ref("2025.01.18");
// const endDate = ref("2025.01.25");
// const runningTime = ref("120분");
// const ageRestriction = ref("만 7세 이상")
// const prices = ref([
//   { seat: "스탠딩석", amount: "110,000원" },
//   { seat: "지정석R", amount: "110,000원" },
//   { seat: "지정석S", amount: "99,000원" },
// ]);
// const ticketingPlatforms = ref([
//   { name: "인터파크", link: "https://tickets.interpark.com/goods/24012940" },
//   { name: "티켓링크", link: "https://www.ticketlink.co.kr/product/52025" },
// ]);
// const concertDetail = ref(`
//   <h2>공연시간 정보</h2>
//   예매가능시간: 전일17시(월~토 관람 시)까지/전일 11시(일요일 관람 시)까지 <br />
//   <br />
//   2024년 1월 18일 (토) 오후 7시 <br />
//   <br />
//   <h2>공지사항</h2>
//   [휠체어석 예매 안내] <br />
//   - 휠체어석 구매는 2024년 9월 10일(화) 오후 12시부터 인터파크 티켓 고객센터(1544-1555)를 통한 전화예매만 가능합니다. <br />
//   (*고객센터 운영시간 오전 9시~오후 6시) <br />
//   - 공연 당일 장애인 등록증(또는 복지카드)과 본인 신분증(실물)확인 후 티켓 수령이 이루어지며, 미 지참 시 예매자 및 동반 1인도 입장이 불가합니다. <br />
//   - 휠체어석 예매티켓은 현장수령만 가능하며 구매자 본인 티켓 수령을 원칙으로 하고 있습니다. (대리 수령 및 양도 불가) <br />
//   <br />
//   ※ 본 공연은 예매 대기 서비스를 지원하지 않습니다. <br />
//   ※ 본 공연은 원활한 예매 환경 제공을 위하여 아티스트 선예매 전 기간과 일반예매 오픈 당일 동일좌석 재예매 서비스 이용이 일시적으로 제한됩니다. <br />
//   서비스 제한 시간: 9/9(월) , 9/10(수) 오후 12시~ 오후 12시 30분 <br />
//   ※ 매크로 프로그램 등 비정상적인 방법·경로를 통한 부정예매는 예매시스템 관리 및 유지보수 등 업무에 방해와 위험을 초래하므로 어떠한 경우에도 금지합니다. <br />
//   부정예매로 추정되는 예매건 및 해당 예매자에 대하여는 사전 고지 없이 예매취소 및 예매자 접근 차단 등 제재가 이루어질 수 있음을 유의하여 주시기 바랍니다. <br />
//   ※ 원활한 예매 환경 제공을 위하여 추가 티켓 오픈 당일 인터파크페이, I-point, NOL포인트 서비스 이용이 일시적으로 제한됩니다. <br />
//   서비스 제한 시간: 9/9(월) 오전 11시 30분 ~ 오후 12시 30분, 9/10(수) 오전 11시 30분 ~ 오후 12시 30분 <br />
//   <br />
//   <h2>공연상세 / 출연진정보</h2>
//   <img src="/images/concert_detail.jpg" alt="원리퍼블릭 상세" />
// `);
// const address = ref("주소 : 인천광역시 중구 공항문화로 127(운서동) 인천 인스파이어 아레나");
</script>

<style lang="css" scoped>
@import url("/public/css/admin/contents/concert/detail.css");
</style>