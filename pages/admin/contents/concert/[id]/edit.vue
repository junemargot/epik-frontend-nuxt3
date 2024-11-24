<template>  
  <div class="wrap">
    <div class="contents-wrap">
      <form action="#" method="POST" id="regForm" enctype="multipart/form-data">
      <section class="product-registration">
        <h1>컨텐츠 수정 - 콘서트</h1>
        <div class="input__item">
          <div class="input__title">제목</div>
          <input type="text" v-model="title" name="title" placeholder="공연명을 입력해주세요" autocomplete="off" />
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
        <div class="input__item">
          <div class="input__title">공연시간</div>
          <input type="text" v-model="runningTime" name="runningTime" placeholder="공연시간을 입력해주세요" autocomplete="off" />
        </div>
        <div class="input__item">
          <div class="input__title">관람연령</div>
          <input type="text" v-model="ageRestriction" name="ageRestriction" placeholder="관람연령을 입력해주세요" autocomplete="off" />
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
      </form>
    </div>
    <!-- END CONTENTS WRAP -->
  </div>
  <!-- END WRAP -->
</template>

<script setup>
import { ref } from 'vue';
import { Editor } from '@toast-ui/editor';
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref('OneRepulic The Artificial Paradise Tour in Korea');
const venue = ref('인스파이어 아레나');
const address = ref('인천광역시 중구 공항문화로 127(운서동) 인천 인스파이어 아레나');
const startDate = ref('2024-09-03');
const endDate = ref('');
const runningTime = ref('120분');
const ageRestriction = ref('만 7세 이상');
const ticketName = ref('');
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
      예매가능시간: 전일17시(월~토 관람 시)까지/전일 11시(일요일 관람 시)까지 <br />
      <br />
      2024년 1월 18일 (토) 오후 7시 <br />
      <br />
      <h2>공지사항</h2>
      [휠체어석 예매 안내] <br />
      - 휠체어석 구매는 2024년 9월 10일(화) 오후 12시부터 인터파크 티켓 고객센터(1544-1555)를 통한 전화예매만 가능합니다. <br />
      (*고객센터 운영시간 오전 9시~오후 6시) <br />
      - 공연 당일 장애인 등록증(또는 복지카드)과 본인 신분증(실물)확인 후 티켓 수령이 이루어지며, 미 지참 시 예매자 및 동반 1인도 입장이 불가합니다. <br />
      - 휠체어석 예매티켓은 현장수령만 가능하며 구매자 본인 티켓 수령을 원칙으로 하고 있습니다. (대리 수령 및 양도 불가) <br />
      <br />
      ※ 본 공연은 예매 대기 서비스를 지원하지 않습니다. <br />
      ※ 본 공연은 원활한 예매 환경 제공을 위하여 아티스트 선예매 전 기간과 일반예매 오픈 당일 동일좌석 재예매 서비스 이용이 일시적으로 제한됩니다. <br />
      서비스 제한 시간: 9/9(월) , 9/10(수) 오후 12시~ 오후 12시 30분 <br />
      ※ 매크로 프로그램 등 비정상적인 방법·경로를 통한 부정예매는 예매시스템 관리 및 유지보수 등 업무에 방해와 위험을 초래하므로 어떠한 경우에도 금지합니다. <br />
      부정예매로 추정되는 예매건 및 해당 예매자에 대하여는 사전 고지 없이 예매취소 및 예매자 접근 차단 등 제재가 이루어질 수 있음을 유의하여 주시기 바랍니다. <br />
      ※ 원활한 예매 환경 제공을 위하여 추가 티켓 오픈 당일 인터파크페이, I-point, NOL포인트 서비스 이용이 일시적으로 제한됩니다. <br />
      서비스 제한 시간: 9/9(월) 오전 11시 30분 ~ 오후 12시 30분, 9/10(수) 오전 11시 30분 ~ 오후 12시 30분 <br />
      <br />
      <h2>공연상세 / 출연진정보</h2>
      <img src="/images/concert_detail.jpg" alt="원리퍼블릭 상세" />
      <br/>
      <br/>
      <h2>상세 정보</h2>
      인천광역시 중구 공항문화로 127(운서동) 인천 인스파이어 아레나
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
  { name: '스탠딩석', price: '110,000원' }, 
  { name: '지정석R', price: '110,000원' }, 
  { name: '지정석S', price: '99,000원' }
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

// 취소 핸들러
const cancelHandler = () => {
  const titleValue = title.value.trim();
  const venueValue = venue.value.trim();
  const addressValue = address.value.trim();
  const startDateValue = startDate.value.trim();
  const endDateValue = endDate.value.trim();
  const runningTimeValue = runningTime.value.trim();
  const ageRestrictionValue = ageRestriction.value.trim();
  const ticketNameValue = ticketName.value.trim();
  const hasImages = images.value.length > 0;

  if(editor.value) {
    const editorContent = editor.value.trim();
    const isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';

    console.log('에디터 내용:', editorContent); // 에디터 내용 확인용 로그
  }

  // 티켓명과 가격도 비어 있는지 확인
  const areTicketsEmpty = ticketFields.value.every(ticket => !ticket.name.trim() && !ticket.price.trim());

  console.log('티켓 상태:', ticketFields.value.map(ticket => ({
    name: ticket.name.trim(),
    price: ticket.price.trim()
  }))); // 각 티켓 상태 확인용 로그

  // 필드들이 모두 비어있는지 여부 확인
  const isDataEmpty = !titleValue &&
                      !venueValue &&
                      !addressValue &&
                      !startDateValue &&
                      !endDateValue &&
                      !runningTimeValue &&
                      !ageRestrictionValue &&
                      !ticketNameValue &&
                      !hasImages;
    console.log('전체 데이터 비어 있음 여부:', isDataEmpty); // 최종 상태 확인용 로그

  // editor.value가 null이 아니면 내용 확인
  let isEditorEmpty = true;
  if (editor.value) {
    const editorContent = editor.value.getHTML().trim();
    isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';
  }

  // 취소 확인 창
  if (!isDataEmpty || !isEditorEmpty || !areTicketsEmpty) {
    const userConfirmed = window.confirm("수정 중인 글쓰기를 종료하시겠습니까?");
    if (userConfirmed) {
      router.push('/admin/contents/concert');
    }
  } else {
    router.push('/admin/contents/concert');
  }
};


</script>

<style lang="css" scoped>
@import url("/public/css/admin/contents/concert/edit.css");
</style>
