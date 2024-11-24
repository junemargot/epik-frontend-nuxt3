<template>
<div class="wrap">
  <div class="contents-wrap">
    <section class="product-registration">
      <h1>컨텐츠 수정 - 뮤지컬</h1>
      <div class="input__item">
          <div class="input__title">제목</div>
          <input type="text" v-model="title" name="title" placeholder="제목을 입력해주세요" autocomplete="off" />
      </div>
      <div class="input__item">
        <div class="input__title">장소</div>
        <input type="text" v-model="venue" name="venue" placeholder="공연장명을 입력해주세요" autocomplete="off" />
      </div>
      <div class="input__item">
          <div class="input__title">주소</div>
          <input type="text" v-model="address" name="address" placeholder="주소를 입력해주세요" autocomplete="off" />
      </div>
      <div class="input__item split">
        <div class="input__title">공연시작일</div>
        <input type="text" v-model="startDate" id="startDateInput" name="startDate" placeholder="시작일을 입력해주세요" autocomplete="off" readonly />
        <div class="input__title">공연종료일</div>
        <input type="text" v-model="endDate" id="endDateInput" name="endDate" placeholder="종료일을 입력해주세요" autocomplete="off" readonly />
      </div>
      <div class="input__item split">
        <div class="input__title">공연시간</div>
        <input type="text" v-model="runningTime" name="runningTime" id="runningTime" placeholder="공연시간을 입력해주세요" autocomplete="off" />
        <div class="input__title">관람연령</div>
        <input type="text" v-model="ageRestriction" name="ageRestriction" placeholder="관람연령을 입력해주세요" autocomplete="off" />
      </div>
      <div class="input__item split" id="ticket-container" v-for="(ticket, index) in ticketFields" :key="index">
        <div class="input__title">좌석명</div>
        <input type="text" v-model="ticket.name" id="seat" name="seat" class="ticket-input" placeholder="티켓/좌석명을 입력해주세요" autocomplete="off" />
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
        <button type="button" class="btn cancel" @click="cancelHandler">취소</button>
        <button type="submit" class="btn submit">수정</button>
      </div>
    </section>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { Editor } from '@toast-ui/editor';
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref('뮤지컬 <랭보>');
const venue = ref('예스24스테이지 1관');
const address = ref('서울시 종로구 대학로 12길 21');
const startDate = ref('2024-09-17');
const endDate = ref('2024-12-08');
const runningTime = ref('120분');
const ageRestriction = ref('만 13세 이상');
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
      <h2>공연시간 정보</h2>
      예매가능시간: 관람 4시간 전까지 <br />
      <br />
      평일 오후 8시 / 토요일 오후 3시 <br />
      <br />
      <br />
      <h2>공연상세 / 출연진정보</h2>
      <img src="/images/musical_detail.jpg" alt="랭보 상세" />
      <h2>할인정보</h2>
      <img src="/images/musical_detail_2.jpg" alt="랭보 상세2" />
      <h2>공연정보</h2>
      <img src="/images/musical_detail_3.jpg" alt="랭보 상세3" />
      <h2>캐스팅 일정</h2>
      <img src="/images/musical_detail_4.jpg" alt="랭보 상세4" />
      <h2>상세 정보</h2>
      <span class="address">서울시 종로구 대학로 12길 21</span>
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
  // { name: '', price: '' }, // 첫 번째 입력창은 빈 상태
  { name: 'R석', price: '77,000원' }, 
  { name: 'S석', price: '55,000원' }
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
  { name: '예스24', url: 'http://ticket.yes24.com/New/Perf/Detail/Detail.aspx?IdPerf=50568&site_pid=cp067udH2o' },
  { name: '인터파크', url: 'https://tickets.interpark.com/goods/24011238' }
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

// 취소 핸들러
const cancelHandler = () => {
  const titleValue = title.value.trim();
  const venueValue = venue.value.trim();
  const addressValue = address.value.trim();
  const startDateValue = startDate.value.trim();
  const endDateValue = endDate.value.trim();
  const runningTimeValue = runningTime.value.trim();
  const ageRestrictionValue = ageRestriction.value.trim();
  const hasImages = images.value.length > 0;

  let editorContent = '';
  if(editor.value) {
    editorContent = editor.value.getHTML().trim();
    console.log('에디터 내용:', editorContent); // 에디터 내용 확인용 로그
  }
  const isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';

  // 티켓명과 가격도 비어 있는지 확인
  const areTicketsEmpty = ticketFields.value.every(ticket => !ticket.name.trim() && !ticket.price.trim());
  const areLinksEmpty = links.value.every(link => !link.name.trim() && !link.url.trim());

  // 필드들이 모두 비어있는지 여부 확인
  const isDataEmpty = !titleValue &&
                      !venueValue &&
                      !addressValue &&
                      !startDateValue &&
                      !endDateValue &&
                      !runningTimeValue &&
                      !ageRestrictionValue &&
                      !hasImages;
    console.log('전체 데이터 비어 있음 여부:', isDataEmpty); // 최종 상태 확인용 로그

  // editor.value가 null이 아니면 내용 확인
  // let isEditorEmpty = true;
  // if (editor.value) {
  //   const editorContent = editor.value.getHTML().trim();
  //   isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';
  // }

  // 취소 확인 창
  if (!isDataEmpty || !isEditorEmpty || !areTicketsEmpty || !areLinksEmpty) {
    const userConfirmed = window.confirm("수정 중인 글쓰기를 종료하시겠습니까?");
    if (userConfirmed) {
      router.push('/admin/contents/musical');
    }
  } else {
    router.push('/admin/contents/musical');
  }
};

</script>

<style lang="css" scoped>
@import url('/public/css/admin/contents/musical/edit.css');
</style>