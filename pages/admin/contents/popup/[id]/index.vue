<template>
  <div class="main-wrap">
    <section class="product__container" v-if="popup">
      <!-- PRODUCT HEADER -->
      <div class="product__header">
        <div class="product__category">
          <RouterLink to="/admin/contents/popup">
            <strong>팝업</strong>
            <i class='bx bx-chevron-right'></i>
          </RouterLink>
        </div>
        <div class="product__title">
          <h3 class="product__title-text">{{ popup.title }}</h3>
          <div class="product__title-address">{{ popup.address }}</div>
          <!-- <div class="product__title-date">24.09.03 ~ 24.11.14</div> -->
          <div class="product__title-date">
            <span name="startDate">{{ formatDate(popup.startDate) }}</span>
            <span>~</span>
            <span name="endDate">{{ formatDate(popup.endDate) }}</span>
          </div>
        </div>
        <!--태그-->
        <div class="product__tag">
          <!-- <button>뷰티</button>
          <button>잠실</button>
          <button>한정이벤트</button> -->
          <button v-for="(tag, index) in popup.tags" :key="index">{{ tag }}</button>
        </div>
        <div class="product__registration">
          <div class="product__registration-writer-info">
            <span class="name">{{ popup.writer }}</span>
            <div class="product__registration-date">
              <span>{{ popup.writeDate }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- END PRODUCT HEADER -->
      <div class="product__content">
        <div class="product__content-images">
          <!-- 이미지 -->
          <!-- <img src="http://localhost:8081/api/v1/uploads/images/popup/1aafb5399df54c078d1025d30e3eac7c.jpg" alt="센녹1" />
          <img src="/images/sen_2.jpeg" alt="센녹2" />
          <img src="/images/sen_3.jpeg" alt="센녹3" />
          <img src="/images/sen_4.jpeg" alt="센녹4" /> -->
          <img v-for="(imageName, index) in popup.saveImageNames" :key="index"
            :src="`http://localhost:8081/api/v1/uploads/images/popup/${imageName}`" :alt="'포스터이미지 ' + (index + 1)" />
        </div>
        <div class="product__content-detail">
          <!-- <p name="content">
          </p> -->
          <div v-html="popup.content"></div>
        </div>
        <div class="product__content-detail-info">
          <h2>상세 정보</h2>
          <div class="product__content-detail-info-map" name="address">
            <span class="address">{{ popup.addressDetail }}</span>
          </div>
          <div class="product__content-detail-info-time" name="operationTime">
            <span>{{ popup.operationTime }}</span>
          </div>
          <div class="product__content-detail-links">
            <div class="instagram" name="snsLink">
              <a href="https://www.instagram.com/sennok_bathhouse?igsh=bmxwYWsyNjhoM2tk" target="_blank">인스타그램
                <span>{{ popup.snsLink }}</span></a>
            </div>
            <div class="web" name="webLink">
              <a href="https://sennok.co.kr/" target="_blank">공식 홈페이지
                <span>{{ popup.webLink }}</span>
              </a>
            </div>
          </div>
          <!-- 하단 버튼 -->
          <div class="product__content-buttons">
            <button type="button" class="service">서비스 페이지로 이동</button>
            <RouterLink to="/admin/contents/popup">
              <button type="button" class="list">목록으로 이동</button>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const popupId = route.params.id;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상태 관리 위한 ref 선언
const popup = ref(null);
const error = ref(null);

// 데이터 가져오기
watchEffect(async () => {
  try {
    const { data } = await useFetch(`/admin/popup/${popupId}`, {
      baseURL: apiBase,
      key: `popup-${popupId}`,
    });


    if (data.value) {
      console.log(useRuntimeConfig().public.apiBase);
      console.log('data::', data.value);
      console.log('popup::', popup.value);
      popup.value = data.value;
    } else {
      error.value = "데이터를 불러올 수 없습니다.";
    }
  } catch (err) {
    console.error(err);
    error.value = "서버와의 통신에 실패했습니다.";
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
});

</script>

<style lang="css" scoped>
@import url('/public/css/admin/contents/popup/detail.css');
</style>