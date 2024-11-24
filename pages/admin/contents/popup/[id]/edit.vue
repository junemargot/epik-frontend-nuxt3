<template>
  <div class="wrap">
    <div class="contents-wrap">
      <form action="#" method="POST" id="regForm" enctype="multipart/form-data">
        <section class="product-registration">
          <h1>컨텐츠 수정 - 팝업</h1>
          <div class="input__item">
              <div class="input__title">제목</div>
              <input type="text" v-model="title" name="title" placeholder="제목을 입력해주세요" autocomplete="off" />
          </div>
          <div class="input__item">
            <div class="input__title">장소</div>
            <input type="text" v-model="venue" name="venue" placeholder="장소를 입력해주세요" autocomplete="off" />
          </div>
          <div class="input__item">
              <div class="input__title">주소</div>
              <input type="text" v-model="address" name="address" placeholder="주소를 입력해주세요" autocomplete="off" />
          </div>
          <div class="input__item split">
            <div class="input__title">팝업시작일</div>
            <input type="text" v-model="startDate" id="startDateInput" name="startDate" placeholder="시작일을 입력해주세요" autocomplete="off" />
            <div class="input__title">팝업종료일</div>
            <input type="text" v-model="endDate" id="endDateInput" name="endDate" placeholder="종료일을 입력해주세요" autocomplete="off" />
          </div>
          <div class="input__item">
            <div class="input__title">영업시간</div>
            <input type="text" v-model="operationTime" name="operationTime" placeholder="영업시간을 입력해주세요" autocomplete="off" />
          </div>
          <div class="input__item">
            <div class="input__title">SNS</div>
            <input type="text" v-model="snsLink" name="snsLink" placeholder="SNS를 입력해주세요" autocomplete="off" />
          </div>
          <div class="input__item">
            <div class="input__title">홈페이지</div>
            <input type="text" v-model="webLink" name="webLink" placeholder="홈페이지를 입력해주세요" autocomplete="off" />
          </div>
          <div class="input__item hashtag-input">
            <div class="input__title">태그</div>
            <input @keypress.enter.prevent="addTag" type="text" v-model="tag" name="tag" id="tagInput" placeholder="태그를 입력하고 엔터를 눌러주세요" autocomplete="off" />
          </div>
          <div class="tags-container" id="tagsContainer">
            <div v-for="(tagItem, index) in tags" :key="index" class="tag-item">{{ tagItem  }}
              <button @click="removeTag(tagItem)" type="button" class="remove-tag">&times;</button>
            </div>
          </div>
          <div class="input__item">
            <div class="input__title">카테고리</div>
            <select v-for="(category, index) in categoryOptions" :key="index" v-model="selectedCategory[index]" :style="{ color: getColor(selectedCategory[index]) }" name="category" class="input-select">
              <option value="">선택</option>
              <option v-for="(item, idx) in category.items" :key="idx" :value="item.value">{{ item.label }}</option>
            </select>
          </div>
          <div class="input__item">
            <div class="input__title">지역</div>
            <select v-for="(region, index) in regionOptions" :key="index" v-model="selectedRegion[index]" :style="{ color: getColor(selectedRegion[index]) }" name="region">
              <option value="">선택</option>
              <option v-for="(item, idx) in region.items" :key="idx" :value="item.value">{{ item.label }}</option>
            </select>
          </div>
      
          <!-- 에디터를 적용할 요소 (컨테이너)-->
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
            <button type="submit" class="btn submit">등록</button>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Editor } from '@toast-ui/editor';
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref('SENNOK BATH HOUSE POPUP STORE');
const venue = ref('서울 송파구 올림픽로 300 롯데월드몰 1층');
const address = ref('서울 송파구 올림픽로 300 롯데월드몰');
const startDate = ref('2024-09-03');
const endDate = ref('2024-11-14');
const operationTime = ref('매일 10:30-22:00');
const snsLink = ref('https://www.instagram.com/sennok_bathhouse');
const webLink = ref('https://sennok.co.kr/');
const editor = ref(null);

const categoryOptions = ref([
  { 
    items: [
      { value: 'media', label: '영화 / 드라마 / 애니' },
      { value: 'fashion', label: '패션' },
      { value: 'beauty', label: '뷰티 / 코스메틱' },
      { value: 'goods', label: '굿즈 / 문구' },
      { value: 'food', label: '푸드' },
    ]
  }
]);

const regionOptions = ref([
  { 
    items: [
      { value: 'hyundai', label: '더현대 서울' },
      { value: 'seongsu', label: '성수' },
      { value: 'mapo', label: '마포 / 서대문 / 홍대' },
      { value: 'gangnam', label: '강남/송파' },
      { value: 'others', label: '그 외 지역' },
    ]
  }
]);

const selectedCategory = ref(Array(categoryOptions.value.length).fill('media'));
const selectedRegion = ref(Array(regionOptions.value.length).fill('hyundai'));

const getColor = (value) => {
  return value === '' ? 'var(--color-grey-6)' : 'var(--black)';
};




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
      센녹 SENNOK POPUP STORE <br />
      <br />
      잠실 롯데월드몰에서 센녹을 만나보세요! <br />
      9월 3일 센녹 팝업스토어가 오픈됩니다. 다양한 구매혜택부터 선착순 이벤트까지! <br />
      오직 잠실 롯데월드몰에서만 받을 수 있는 센녹 특별 제작 키링까지 만나볼 수 있는 기회! <br />
      <br />
      💙 SENNOK BATH HOUSE POPUP STORE <br />
      - 팝업 운영 기간 : 24.09.03(Tue) - 24.11.14(Thu) <br />
      - 운영 시간 : AM 10:30 - PM 10:00 <br />
      - 위치 : 잠실 롯데월드몰 1F, 블루보틀 매장 맞은 편 <br />
      <br />
      💙 EVENT PERIOD <br />
      - 구매 혜택 & 이벤트 기간 : 24.09.03(Tue) - 24.09.08(Sun) <br />
      - 선착순 증정 이벤트 : 24.09.04(Wed) PM 6:00 <br />
      <br />
      💙 롯데월드 몰 특별 구매혜택! <br />
      오직 팝업 현장에서만 만나볼 수 있는 센녹 특별 구매 혜택! <br />
      - 방문 고객 전원 : 샤쉐 2종 증정 <br />
      - 7만원 이상 구매 고객 풋 풋크림 50ml 증정 <br />
      - 15만원 이상 구매 고객 삐약이 괄사 증정 <br />
      - 한정 수량으로 소진 시 종료될 수 있습니다. <br />
      - 사은품은 교환 & 환불이 불가합니다. <br />
      - 롯데월드몰 팝업 한정 이벤트입니다. <br />
      <br />
      💙 전품목 UP TO 10% OFF <br />
      센녹 BEST 제품부터 NEW 제품까지 특별한 금액으로 만나보세요. <br />
      <br />
      💙 핸드크림 구매 시 키링 증정 EVENT! <br />
      - 센녹 핸드크림 구매하고 나만의 귀여운 키링을 만들어보세요🍀 <br />
      <br />
      💙 9월 4일 단 하루, 오후 6시! 선착순 Event! <br />
      - 센녹 카톡 플친을 추가해주시면 센녹 핸드크림 50ml + 키링을 선물로 드립니다🥁 <br />
      - 1인 1개로 수량 한정됩니다. <br />
      - 센녹 카톡 플친 추가 시 제공됩니다. <br />
      - 한정 수량 소진 시 종료됩니다. <br />
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


// 취소 핸들러
const cancelHandler = () => {
  const titleValue = title.value.trim();
  const venueValue = venue.value.trim();
  const addressValue = address.value.trim();
  const snsLinkValue = snsLink.value.trim();
  const webLinkValue = webLink.value.trim();
  const operationTimeValue = operationTime.value.trim();
  const hasImages = images.value.length > 0;
  const hasTags = tags.value.length > 0;
  if(editor.value) {
    const editorContent = editor.value.getHTML().trim();
    const isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';
  }

  // 필드들이 모두 비어있는지 여부 확인
  const isDataEmpty = !titleValue &&
                      !venueValue &&
                      !addressValue &&
                      !snsLinkValue &&
                      !webLinkValue &&
                      !operationTimeValue &&
                      !hasImages &&
                      !hasTags &&
                      !selectedCategory.value.some(c => c) &&
                      !selectedRegion.value.some(r => r);

  // editor.value가 null이 아니면 내용 확인
  let isEditorEmpty = true;
  if (editor.value) {
    const editorContent = editor.value.getHTML().trim();
    isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';
  }

  // 취소 확인 창
  if (!isDataEmpty || !isEditorEmpty) {
    const userConfirmed = window.confirm("수정 중인 글쓰기를 종료하시겠습니까?");
    if (userConfirmed) {
      router.push('/admin/contents/popup');
    }
  } else {
    router.push('/admin/contents/popup');
  }
};


// 태그
const tag = ref('');
const tags = ref(['뷰티', '한정이벤트', '잠실']);

// 태그 추가 함수 -> 중복 텍스트도 입력 가능하게 구현 
const addTag = () => {
  const tagText = tag.value.trim();
  
  if(tagText && !tags.value.includes(tagText)) {
    tags.value.push(tagText);
    tag.value = ''; // 입력 필드 초기화
  }
};

// 태그 삭제 함수
const removeTag = (tagText) => {
  const tagIndex = tags.value.indexOf(tagText);

  if(tagIndex > -1) {
    tags.value.splice(tagIndex, 1);
  }
};


// 이미지 업로드 핸들러
const images = ref([
  '/images/sen_1.jpeg',
  '/images/sen_2.jpeg'
]);
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


</script>

<style lang="css" scoped>
@import url('/public/css/admin/contents/popup/edit.css');

</style>