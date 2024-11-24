<template>
  <div class="wrap">
    <div class="contents-wrap">
      <section class="product-registration">
        <h1>컨텐츠 등록 - 전시회</h1>
        <div class="input__item">
          <div class="input__title">제목</div>
          <input type="text" v-model="title" ref="titleInput" name="title" placeholder="제목을 입력해주세요" />
        </div>
        <div class="input__item">
          <div class="input__title">장소</div>
          <input type="text" v-model="venue" name="venue" placeholder="장소를 입력해주세요" />
        </div>
        <div class="input__item">
          <div class="input__title">주소</div>
          <input type="text" v-model="address" name="address" placeholder="주소를 입력해주세요" />
        </div>
        <div class="input__item split">
          <div class="input__title">전시시작일</div>
          <input type="text" v-model="startDate" id="startDateInput" name="startDate" placeholder="시작일을 입력해주세요"
            autocomplete="off" readonly />
          <div class="input__title">전시종료일</div>
          <input type="text" v-model="endDate" id="endDateInput" name="endDate" placeholder="종료일을 입력해주세요"
            autocomplete="off" readonly />
        </div>
        <div class="input__item split">
          <div class="input__title">관람시간</div>
          <input type="text" v-model="runningTime" name="runningTime" id="runningTime" placeholder="관람시간을 입력해주세요"
            autocomplete="off" />
          <div class="input__title">관람연령</div>
          <input type="text" v-model="ageRestriction" name="ageRestriction" placeholder="관람연령을 입력해주세요"
            autocomplete="off" />
        </div>
        <div class="input__item split">
          <div class="input__title">운영시간</div>
          <input type="text" v-model="operationTime" name="operationTime" id="operationTime" placeholder="운영시간을 입력해주세요"
            autocomplete="off" />
          <div class="input__title">연락처</div>
          <input type="text" v-model="contacts" name="contacts" placeholder="연락처를 입력해주세요" autocomplete="off" />
        </div>
        <div class="input__item split" id="ticket-container" v-for="(ticket, index) in ticketFields" :key="index">
          <div class="input__title">티켓명</div>
          <input type="text" v-model="ticket.seat" id="seat" name="seat" class="ticket-input"
            placeholder="티켓/좌석명을 입력해주세요" autocomplete="off" />
          <div class="input__divider"></div>
          <div class="input__title">가격</div>
          <input type="text" v-model="ticket.price" name="price" class="price-input" placeholder="가격을 입력해주세요"
            autocomplete="off" />
          <button type="button" class="btn price-more" :class="index === 0 ? 'price-more' : 'price-remove'"
            @click="index === 0 ? addTicket() : removeTicket(index)">
            <i :class="index === 0 ? 'bx bx-plus' : 'bx bx-minus'"></i>
          </button>
        </div>
        <div class="input__item split" id="reservation-container" v-for="(link, index) in links" :key="index">
          <div class="input__title">예매처</div>
          <input type="text" v-model="link.name" name="name" id="name" class="reserve-input" placeholder="예매처를 입력해주세요"
            autocomplete="off" />
          <div class="input__title">예매처링크</div>
          <input type="text" v-model="link.link" name="link" id="link" class="link-input" placeholder="예매처링크를 입력해주세요"
            autocomplete="off" />
          <button type="button" class="btn reserve-more" :class="index === 0 ? 'reserve-more' : 'reserve-remove'"
            @click="index === 0 ? addLink() : removeLink(index)">
            <i :class="index === 0 ? 'bx bx-plus' : 'bx bx-minus'"></i>
          </button>
        </div>
        <div class="input__item">
          <div class="input__title">SNS</div>
          <input type="text" v-model="snsLink" name="snsLink" placeholder="SNS를 입력해주세요" />
        </div>
        <div class="input__item">
          <div class="input__title">홈페이지</div>
          <input type="text" v-model="webLink" name="webLink" placeholder="홈페이지를 입력해주세요" />
        </div>

        <!-- 에디터를 적용할 요소 (컨테이너) -->
        <div id="contsEditor" name="content"></div>

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

        <!-- 취소와 저장 버튼 -->
        <div class="btn-bottom">
          <button type="button" class="btn cancel" @click="cancelHandler">취소</button>
          <button type="submit" class="btn submit" @click.prevent="submitHandler">등록</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useFetch, useRuntimeConfig } from '#imports';

// 고정된 경로 가져와서 사용하기 위해
const config = useRuntimeConfig(); // 추가
const apiBase = config.public.apiBase;

const router = useRouter();
const config = useRuntimeConfig(); // 추가
const apiBase = config.public.apiBase; // 추가

const title = ref('');
const titleInput = ref(null);
const venue = ref('');
const address = ref('');
const startDate = ref('');
const endDate = ref('');
const runningTime = ref('');
const ageRestriction = ref('');
const operationTime = ref('');
const contacts = ref('');
const snsLink = ref('');
const webLink = ref('');
const editor = ref(null);
const images = ref([]);
const fileNames = ref([]); // *** 에디터에 추가된 이미지 파일명을 담을 배열 ref객체

onMounted(() => {
  // TOAST EDITOR RESET
  editor.value = new toastui.Editor({
    el: document.querySelector('#contsEditor'),
    previewStyle: 'vertical',
    initialEditType: 'wysiwyg',
    height: '700px',
    placeholder: '내용을 입력해주세요',
    hideModeSwitch: true,
    hooks: { // 에디터 파일추가시 실행되게하기위한 hook설정
      async addImageBlobHook(blob, callback) {
        try {
          console.log(blob);
          // 이미지를 post요청을 보내기위한 FormData 객체 
          /*
          FormData 객체란?
          HTML 폼 데이터(키-값 쌍)을 쉽게 생성하고 조작할 수 있도록
          브라우저에서 제공하는 내장API
          주로 파일 업로드나 폼 데이터 전송을 위한 HTTP 요청(특히 POST 요청)에서
          사용됨.
          */
          const formData = new FormData();
          // formaData에 key(image)-value(blob) 쌍을 추가
          formData.append('fileName', blob);
          formData.append('domain', "exhibition");

          // post 요청
          const response = await fetch(`${apiBase}/editor-image/upload-temp`, {
            method: "POST", // HTTP 요청 메서드 지정
            body: formData, // 위에 만든 formData를 body에 추가
          });

          // 컨트롤러에서 전달받은 디스크에 저장된 파일명
          const fileName = await response.text();
          console.log(fileName)

          // 에디터에 이미지 추가 요청
          callback(`http://localhost:8081/api/v1/uploads/temp/exhibition/${fileName}`);
        } catch (error) {
          console.log("업로드 실패 : ", error);
        }
      }
    } // hooks end




  });

  // 제목 입력 요소에 포커스 추가
  setTimeout(() => {
    titleInput.value.focus();
  }, 1);
});


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
  $('#startDateInput, #endDateInput').on('cancel.daterangepicker', function () {
    $(this).val('');  // input을 clear
    if ($(this).attr('id') === 'startDateInput') {
      startDate.value = ''; // Vue 변수도 clear
    } else {
      endDate.value = ''; // Vue 변수도 clear
    }
  });
});

// 이미지 업로드 핸들러
const fileList = ref([]); // ***
const imgUploadHandler = (event) => {
  const files = event.target.files;
  images.value = []; // 기존 이미지 초기화
  fileList.value.push(...event.target.files); // *** fileList배열에 첨부 파일 객체 담기

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


// 티켓/좌석 동적 input 요소 추가
const ticketFields = ref([{ seat: '', price: '' }]); // 티켓 필드를 담는 배열

// 티켓 추가 함수
const addTicket = () => {
  ticketFields.value.push({ seat: '', price: '' }); // 새로운 티켓 필드 추가
};

// 티켓 제거 함수
const removeTicket = (index) => {
  if (index > 0) {
    ticketFields.value.splice(index, 1);
  }
};

// 예매처 동적 input 요소 추가
const links = ref([{ name: '', link: '' }]); // 예매처 필드 담는 배열

// 예매처 추가 함수
const addLink = () => {
  links.value.push({ name: '', link: '' }); // 새로운 예매처 필드 추가
}

const removeLink = (index) => {
  if (index > 0) {
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
  const operationTimeValue = operationTime.value.trim();
  const contactsValue = contacts.value.trim();
  const snsLinkValue = snsLink.value.trim();
  const webLinkValue = webLink.value.trim();
  const hasImages = images.value.length > 0;
  if (editor.value) {
    const editorContent = editor.value.getHTML().trim();
    const isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';
  }

  // 티켓과 예매처 필드 비어있는지 확인
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
    !operationTimeValue &&
    !contactsValue &&
    !snsLinkValue &&
    !webLinkValue &&
    !hasImages;
  console.log('전체 데이터 비어 있음 여부:', isDataEmpty); // 최종 상태 확인용 로그


  // editor.value가 null이 아니면 내용 확인
  let isEditorEmpty = true;
  if (editor.value) {
    const editorContent = editor.value.getHTML().trim();
    isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';
  }

  // 취소 확인 창
  if (!isDataEmpty || !isEditorEmpty || !areTicketsEmpty || !areLinksEmpty) {
    const userConfirmed = window.confirm("작성 중인 글쓰기를 종료하시겠습니까?");
    if (userConfirmed) {
      router.push('/admin/contents/exhibition');
    }
  } else {
    router.push('/admin/contents/exhibition');
  }
};

// *** 제출 처리 함수
const submitHandler = async () => {

  //const fileNames = ref([]); // 파일명 모아서 넘기기
  // 에디터에 담긴 img 태그 src를 뽑아내기
  const editorContent = editor.value.getHTML();

  // img 태그들을 추출하는 정규 표현식
  const imgTags = editorContent.match(/<img[^>]*src="([^"]+)"/g);

  // img 태그에서 src 속성만 추출
  const imagePaths = imgTags.map(tag => {
    const match = tag.match(/src="([^"]+)"/);
    return match ? match[1] : '';
  });

  // src에서 도메인 이후의 경로만 추출
  const pathsWithoutDomain = imagePaths.map(src => {
    return src.replace('http://localhost:8081/api/v1/uploads/temp/exhibition/', '');
  });

  fileNames.value = pathsWithoutDomain;
  console.log(pathsWithoutDomain);

  // 데이터 전송을위한 FormData 만들어 값 담기.
  const formDatas = new FormData();
  formDatas.append('title', title.value);
  formDatas.append('venue', venue.value);
  formDatas.append('address', address.value);
  formDatas.append('startDate', startDate.value);
  formDatas.append('endDate', endDate.value);
  formDatas.append('runningTime', runningTime.value);
  formDatas.append('ageRestriction', ageRestriction.value);
  formDatas.append('runningTime', runningTime.value);
  formDatas.append('operationTime', operationTime.value);
  formDatas.append('contacts', contacts.value);
  formDatas.append('ticketFields', ticketFields.value);
  formDatas.append('links', links.value);
  formDatas.append('content', editor.value ? editor.value.getHTML() : '');

  // ticketFields를 MusicalTicketPriceDto로 매핑
  ticketFields.value.forEach((ticket, index) => {
    formDatas.append(`ticketPrices[${index}].seat`, ticket.seat); // 좌석명
    formDatas.append(`ticketPrices[${index}].price`, ticket.price); // 가격
  });

  // links를 MusicalTicketOfficeDto로 매핑
  links.value.forEach((link, index) => {
    formDatas.append(`ticketOffices[${index}].name`, link.name); // 판매처 이름
    formDatas.append(`ticketOffices[${index}].link`, link.link);   // 판매처 URL
  });



  // 에디터로 업로드한 파일명 
  fileNames.value.forEach((fileName) => {
    // 파일 이름을 'fileNames'라는 이름으로 폼데이터에 추가
    formDatas.append('fileNames', fileName);
  });

  // 파일첨부한 파일 객체
  fileList.value.forEach((file) => {
    // 파일을 'files'라는 이름으로 폼데이터에 추가
    formDatas.append('files', file);
  });

  try {
    // API 요청
    // const response = await useFetch(`${apiBase}/admin/musical`, {
    const { data, error, status } = await useFetch(`${apiBase}/admin/exhibition`, {
      method: 'POST',
      body: formDatas,
    });

    // 응답 상태 코드 확인
    console.log('Response Status:', status.value);
    console.log('넘어온 데이터: ', data.value);

    if (status.value === 'success') {
      console.log('등록 성공');
      router.push({
        path: '/admin/contents/exhibition/' + data.value.id
      });
    } else {
      console.log('등록실패 : ', error.value);
    }

  } catch (error) {
    console.error('등록 오류:', error);
    alert('서버와의 연결 오류입니다.');
  }
};

</script>

<style lang="css" scoped>
@import url('/public/css/admin/contents/exhibition/new.css');
</style>