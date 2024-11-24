<template>
  <div class="contents-wrap">
    <section class="product-registration">
      <h1>컨텐츠 수정 - 전시회</h1>
      <div class="input__item">
          <div class="input__title">제목</div>
          <input type="text" name="title" value="우연히 웨스 앤더슨2" placeholder="제목을 입력해주세요" />
      </div>
      <div class="input__item">
        <div class="input__title">장소</div>
        <input type="text" name="venue" value="그라운드시소 센트럴" placeholder="장소를 입력해주세요" />
      </div>
      <div class="input__item">
        <div class="input__title">주소</div>
        <input type="text" name="address" value="서울특별시 중구 남대문로 5가 831 그랜드센트럴 3F 그라운드시소 센트럴" placeholder="주소를 입력해주세요" />
      </div>
      <div class="input__item split">
        <div class="input__title">전시시작일</div>
        <input type="text" id="startDateInput" name="daterange" value="2024-10-18" placeholder="시작일을 입력해주세요" autocomplete="off" readonly />
        <div class="input__title">전시종료일</div>
        <input type="text" id="endDateInput" name="daterange" value="2025-04-13" placeholder="종료일을 입력해주세요" autocomplete="off" readonly />
      </div>
      <div class="input__item split">
        <div class="input__title">관람시간</div>
        <input type="text" name="runningTime" id="runningTime" value="50분" placeholder="관람시간을 입력해주세요" autocomplete="off" />
        <div class="input__title">관람연령</div>
        <input type="text" name="ageRestriction" value="전체관람가" placeholder="관람연령을 입력해주세요" autocomplete="off" />
      </div>
      <div class="input__item split">
        <div class="input__title">운영시간</div>
        <input type="text" name="operationTime" id="operationTime" value="10:00-19:00" placeholder="운영시간을 입력해주세요" autocomplete="off" />
        <div class="input__title">연락처</div>
        <input type="text" name="contacts" value="1522-1796" placeholder="연락처를 입력해주세요" autocomplete="off" />
      </div>
      <div class="input__item split" id="ticket-container" v-for="(ticket, index) in ticketFields" :key="index">
        <div class="input__title">티켓명</div>
        <input type="text" v-model="ticket.name" id="seat" name="seat" class="ticket-input" placeholder="티켓/좌석명을 입력해주세요" autocomplete="off" />
        <div class="input__divider"></div>
        <div class="input__title">가격</div>
        <input type="text" v-model="ticket.price" name="price" class="price-input" placeholder="가격을 입력해주세요" autocomplete="off" />
        <button type="button" class="btn price-more" :class="index === 0 ? 'price-more' : 'price-remove'" @click="index === 0 ? addTicket() : removeTicket(index)">
          <i :class="index === 0 ? 'bx bx-plus' : 'bx bx-minus'"></i>
        </button>
      </div>
      <div class="input__item split" id="reservation-container" v-for="(link, index) in links" :key="index">
        <div class="input__title">예매처</div>
        <input type="text" v-model="link.name" name="name" id="name" class="reserve-input" placeholder="예매처를 입력해주세요" autocomplete="off" />
        <div class="input__title">예매처링크</div>
        <input type="text" v-model="link.url" name="link" id="link" class="link-input" placeholder="예매처링크를 입력해주세요" autocomplete="off" />
        <button type="button" class="btn reserve-more" :class="index === 0 ? 'reserve-more' : 'reserve-remove'" @click="index === 0 ? addLink() : removeLink(index)">
          <i :class="index === 0 ? 'bx bx-plus' : 'bx bx-minus'"></i>
        </button>
      </div>
      <div class="input__item">
        <div class="input__title">SNS</div>
        <input type="text" name="snsLink" value="https://www.instagram.com/groundseesaw/" placeholder="SNS를 입력해주세요" />
      </div>
      <div class="input__item">
        <div class="input__title">홈페이지</div>
        <input type="text" name="webLink" value="https://groundseesaw.co.kr/" placeholder="홈페이지를 입력해주세요" />
      </div>
      
      <!-- 에디터를 적용할 요소 (컨테이너) -->
      <div id="contsEditor" name="content"></div>

      <!-- 이미지 업로드 및 미리보기 -->
      <div class="input__item">
          <div class="input__title">이미지첨부</div>
          <label class="imgUpload" for="imgInput">선택</label>
          <input type="file" name="img" id="imgInput" multiple @change="imgUploadHandler" />
        </div>
        <div id="image-preview" :class="{ 'with-border': images.length > 0 }">
          <div v-for="(image, index) in images" :key="index" class="image-preview-item">
            <img :src="image" alt="Image Preview" />
            <button class="remove-image" @click="removeImage(index)">&times;</button>
          </div>
        </div>
        <div class="btn-bottom">
          <button type="button" class="btn cancel">취소</button>
          <button type="submit" class="btn submit">수정</button>
        </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Editor } from '@toast-ui/editor';
import { useRouter } from 'vue-router';

const router = useRouter();
const editor = ref(null);



// daterangepicker 초기화
onMounted(() => {
  const $ = window.jQuery;

  // 시작일 선택
  $('#startDateInput').daterangepicker({
    singleDatePicker: true,
    autoUpdateInput: false,
    locale: {
      format: 'YYYY-MM-DD',
      cancelLabel: 'Clear'
    }
  }, (start) => {
    startDate.value = start.format('YYYY-MM-DD');
    $('#startDateInput').val(startDate.value); // 초기 설정 한번만 지정
  });

  // 종료일 선택
  $('#endDateInput').daterangepicker({
    singleDatePicker: true,
    autoUpdateInput: false,
    locale: {
      format: 'YYYY-MM-DD',
      cancelLabel: 'Clear'
    }
  }, (end) => {
    endDate.value = end.format('YYYY-MM-DD');
    $('#endDateInput').val(endDate.value); // 초기 설정을 한번만 지정
  });

  // clear 기능
  $('#startDateInput, #endDateInput').on('cancel.daterangepicker', function() {
    $(this).val('');  // input을 clear
    if ($(this).attr('id') === 'startDateInput') {
      startDate.value = ''; // Vue 변수도 clear
    } else {
      endDate.value = ''; // Vue 변수도 clear
    }
  });
});

// ToastUI Editor
const fetchData = () => {
  return {
    content: `
      <h2>관람시간 정보</h2>
      매일 10:00~19:00 <br />
      입장 마감: 18:00 <br />
      휴관 안내: 12/2(월), 1/6(월), 2/3(월) *공휴일 정상 운영
      <br />
      <br />
      <br />
      <h2>공지사항</h2>
      ＊본 티켓은 별도 배송 되지 않으며, 현장 매표소에서 예매자 성함 및 연락처 확인 후 입장하실 수 있습니다. <br />
      ＊취소 및 환불 규정은 2025년 4월 12일 17시까지 가능하며, 이후 취소 및 환불은 불가합니다. <br />
      <br />
      <br />
      <br />
      <h2>상세정보</h2>
      <img src="/images/exhibition_detail.jpg" alt="웨스앤더슨 상세" />
      <h2>상세 정보</h2>
      <span class="address">서울특별시 중구 남대문로5가 831 그랜드센트럴 3F 그라운드시소 센트럴</span>
    `
  };
};

onMounted(() => {
  const editor = new Editor({
    el: document.querySelector('#contsEditor'),
    previewStyle: 'vertical',
    initialEditType: 'wysiwyg',
    height: '700px',
    placeholder: '내용을 입력해주세요',
    hideModeSwitch: true
  });

  // 데이터 가져오기
  const data = fetchData();
  // title.value = data.title;

  // 에디터에 컨텐츠 로드
  editor.setHTML(data.content);
});


// 이미지 업로드 핸들러
const images = ref([]);
const imgUploadHandler = (event) => {
  const files = event.target.files;
  images.value = []; // 기존 이미지 초기화

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.push(e.target.result); // 미리보기 이미지 추가
    };
    reader.readAsDataURL(file);
  });
};

// 이미지 삭제 핸들러
const removeImage = (index) => {
  images.value.splice(index, 1); // 선택 인덱스의 이미지 삭제
};


// 티켓 동적 input 요소 추가
const ticketFields = ref([
  { name: '입장권', price: '18,000원' }
]); 

// 티켓 추가 함수
const addTicket = () => {
  ticketFields.value.push({ name: '', price: '' }); // 새로운 티켓 필드 추가
};

// 티켓 제거 함수
const removeTicket = (index) => {
  if(index > 0) {
    ticketFields.value.splice(index, 1);
  }
};

const links = ref([
  // { name: '', url: '' },
  { name: '인터파크', url: 'https://tickets.interpark.com/goods/24013174' },
  { name: '네이버', url: 'https://booking.naver.com/booking/5/bizes/1225096' }
])

// 예매처 추가 함수
const addLink = () => {
  links.value.push({name: '', url: ''}); // 새로운 예매처 필드 추가
}

const removeLink = (index) => {
  if(index > 0) {
    links.value.splice(index, 1);
  }
}


</script>

<style lang="css" scoped>
@import url('/public/css/admin/contents/exhibition/edit.css');
</style>