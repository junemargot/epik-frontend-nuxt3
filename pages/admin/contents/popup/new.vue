<template>
  <div class="wrap">
    <div class="contents-wrap">
      <form action="#" method="POST" id="regForm" enctype="multipart/form-data">
        <section class="product-registration">
          <h1>컨텐츠 등록 - 팝업</h1>
          <div class="input__item">
            <div class="input__title">제목</div>
            <input type="text" v-model="title" ref="titleInput" name="title" placeholder="제목을 입력해주세요"
              autocomplete="off" />
          </div>
          <div class="input__item">
            <div class="input__title">주소</div>
            <input type="text" v-model="address" name="address" placeholder="주소를 입력해주세요" autocomplete="off" />
          </div>
          <div class="input__item">
            <div class="input__title">상세 주소</div>
            <input type="text" v-model="addressDetail" name="addressDetail" placeholder="상세주소를 입력해주세요"
              autocomplete="off" />
          </div>
          <div class="input__item split">
            <div class="input__title">팝업시작일</div>
            <input type="text" v-model="startDate" id="startDateInput" name="startDate" placeholder="시작일을 입력해주세요"
              autocomplete="off" readonly />
            <div class="input__title">팝업종료일</div>
            <input type="text" v-model="endDate" id="endDateInput" name="endDate" placeholder="종료일을 입력해주세요"
              autocomplete="off" readonly />
          </div>
          <div class="input__item">
            <div class="input__title">영업시간</div>
            <input type="text" v-model="operationTime" name="operationTime" placeholder="영업시간을 입력해주세요"
              autocomplete="off" />
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
            <input @keypress.enter.prevent="addTag" type="text" v-model="tag" name="tag" id="tagInput"
              placeholder="태그를 입력하고 엔터를 눌러주세요" autocomplete="off" />
          </div>
          <div class="tags-container" id="tagsContainer">
            <div v-for="(tagItem, index) in tags" :key="index" class="tag-item">{{ tagItem }}
              <button @click="removeTag(tagItem)" type="button" class="remove-tag">&times;</button>
            </div>
          </div>
          <div class="input__item">
            <div class="input__title">카테고리</div>
            <select v-for="(category, index) in categoryOptions" :key="index" v-model="selectedCategory[index]"
              :style="{ color: getColor(selectedCategory[index]) }" name="category" class="input-select">
              <option value="">선택</option>
              <option v-for="(item, idx) in category.items" :key="idx" :value="item.value">{{ item.label }}</option>
            </select>
          </div>
          <div class="input__item">
            <div class="input__title">지역</div>
            <select v-for="(region, index) in regionOptions" :key="index" v-model="selectedRegion[index]"
              :style="{ color: getColor(selectedRegion[index]) }" name="region">
              <option value="">선택</option>
              <option v-for="(item, idx) in region.items" :key="idx" :value="item.value">{{ item.label }}</option>
            </select>
          </div>

          <!-- 에디터를 적용할 요소 (컨테이너)-->
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

          <div class="btn-bottom">
            <button type="button" class="btn cancel" @click="cancelHandler">취소</button>
            <button type="submit" class="btn submit" @click.prevent="submitHandler">등록</button>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useFetch, useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const router = useRouter();
const title = ref('');
const titleInput = ref(null);
const address = ref('');
const addressDetail = ref('');
const startDate = ref('');
const endDate = ref('');
const operationTime = ref('');
const snsLink = ref('');
const webLink = ref('');
const editor = ref(null);
const images = ref([]);
const fileNames = ref([]);

onMounted(() => {
  // TOAST EDITOR RESET
  editor.value = new toastui.Editor({
    el: document.querySelector('#contsEditor'),
    previewStyle: 'vertical',
    initialEditType: 'wysiwyg',
    height: '700px',
    placeholder: '내용을 입력해주세요',
    hideModeSwitch: true,
    hooks: {
      async addImageBlobHook(blob, callback) {
        try {
          console.log(blob);

          const formData = new FormData();
          formData.append('fileName', blob);
          formData.append('domain', "popup");

          const response = await fetch(`${apiBase}/editor-image/upload-temp`, {
            method: "POST",
            body: formData,
          });

          const fileName = await response.text();
          console.log(fileName)

          callback(`http://localhost:8081/api/v1/uploads/temp/popup/${fileName}`);
        } catch (error) {
          console.log("업로드 실패 : ", error);
        }
      }
    } // hooks end
  }); // new toastui.Editor end

  // 제목 입력 요소에 포커스 추가
  setTimeout(() => {
    titleInput.value.focus();
  }, 1);
});

// 태그
const tag = ref('');
const tags = ref([]); // 여기에 입력한 tag값이 담기게 됨.******

// 태그 추가 함수 -> 중복 텍스트도 입력 가능하게 구현 
const addTag = () => {
  const tagText = tag.value.trim();

  if (tagText && !tags.value.includes(tagText)) {
    tags.value.push(tagText);
    tag.value = ''; // 입력 필드 초기화
    console.log('입력된 태그들::', tags.value);
  }
};

// 태그 삭제 함수
const removeTag = (tagText) => {
  const tagIndex = tags.value.indexOf(tagText);

  if (tagIndex > -1) {
    tags.value.splice(tagIndex, 1);
  }
};


const categoryOptions = ref([
  {
    items: [
      { value: 1, label: '영화 / 드라마 / 애니' },
      { value: 2, label: '패션' },
      { value: 3, label: '뷰티 / 코스메틱' },
      { value: 4, label: '굿즈 / 문구' },
      { value: 5, label: '푸드' },
    ]
  }
]);

const regionOptions = ref([
  {
    items: [
      { value: 1, label: '더현대 서울' },
      { value: 2, label: '성수' },
      { value: 3, label: '마포 / 서대문 / 홍대' },
      { value: 4, label: '강남/송파' },
      { value: 5, label: '그 외 지역' },
    ]
  }
]);


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
  });

  // input 요소에 초기값 설정
  $('#startDateInput').val(startDate.value);
  $('#endDateInput').val(endDate.value);

  // clear 기능
  $('#startDateInput, #endDateInput').on('cancel.daterangepicker', function () {
    $(this).val('');
  });
});

// select 옵션
const selectedCategory = ref(Array(categoryOptions.value.length).fill(''));
const selectedRegion = ref(Array(regionOptions.value.length).fill(''));

const getColor = (value) => {
  return value === '' ? 'var(--color-grey-6)' : 'var(--black)';
};


// 이미지 업로드 핸들러
const fileList = ref([]);
const imgUploadHandler = (event) => {
  const files = event.target.files;
  images.value = []; // 기존 이미지 초기화
  fileList.value.push(...event.target.files); // fileList에 사진을 차례대로 담고

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


/// 취소 핸들러
const cancelHandler = () => {
  const titleValue = title.value.trim();
  const addressValue = address.value.trim();
  const addressDetailValue = addressDetail.value.trim();
  const snsLinkValue = snsLink.value.trim();
  const webLinkValue = webLink.value.trim();
  const operationTimeValue = operationTime.value.trim();
  const hasImages = images.value.length > 0;
  const hasTags = tags.value.length > 0;
  if (editor.value) {
    const editorContent = editor.value.getHTML().trim();
    const isEditorEmpty = editorContent === '<p><br></p>' || editorContent === '';
  }

  // 필드들이 모두 비어있는지 여부 확인
  const isDataEmpty = !titleValue &&
    !addressValue &&
    !addressDetail &&
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

// 제출 처리 함수
const submitHandler = async () => {

  // //const fileNames = ref([]); // 파일명 모아서 넘기기
  // // 에디터에 담긴 img 태그 src를 뽑아내기
  // const editorContent = editor.value.getHTML();

  // // img 태그들을 추출하는 정규 표현식
  // const imgTags = editorContent.match(/<img[^>]*src="([^"]+)"/g);

  // // img 태그에서 src 속성만 추출
  // const imagePaths = imgTags.map(tag => {
  //   const match = tag.match(/src="([^"]+)"/);
  //   return match ? match[1] : '';
  // });



  // // src에서 도메인 이후의 경로만 추출
  // const pathsWithoutDomain = imagePaths.map(src => {
  //   return src.replace('http://localhost:8081/api/v1/uploads/temp/popup/', '');
  // });


  // fileNames.value = pathsWithoutDomain;
  // console.log(pathsWithoutDomain);

  const formDatas = new FormData();
  formDatas.append('title', title.value); // 제목
  formDatas.append('address', address.value); // 주소
  formDatas.append('addressDetail', addressDetail.value);
  formDatas.append('startDate', startDate.value); // 시작일
  formDatas.append('endDate', endDate.value); // 종료일
  formDatas.append('operationTime', operationTime.value); // 영업시간
  formDatas.append('snsLink', snsLink.value); // sns
  formDatas.append('webLink', webLink.value); // 홈페이지
  // 카테고리
  formDatas.append('popupCategory', selectedCategory.value);
  // 지역
  formDatas.append('popupRegion', selectedRegion.value);
  //태그
  tags.value.forEach((tag) => {
    formDatas.append('tags', tag)
  });
  // 에디터
  formDatas.append('content', editor.value ? editor.value.getHTML() : '');

  // 에디터로 업로드한 파일명 
  // fileNames.value.forEach((fileName) => {
  //   // 파일 이름을 'fileNames'라는 이름으로 폼데이터에 추가
  //   formDatas.append('fileNames', fileName);
  // });

  // 파일첨부한 파일 객체
  fileList.value.forEach((file) => {
    // 파일을 'files'라는 이름으로 폼데이터에 추가
    formDatas.append('files', file);
  });


  // API 요청
  try {
    const { data, error, status } = await useFetch(`${apiBase}/admin/popup`, {
      method: 'POST',
      body: formDatas,
    });

    console.log('Response Status:', status.value);
    console.log('넘어온 데이터: ', data.value);

    if (status.value === 'success') {
      console.log('등록 성공');
      router.push({
        path: '/admin/contents/popup/' + data.value.id
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

<style lang="css">
/* @import "@/assets/css/admin/contents/popup/new.css"; */
@import url('/public/css/admin/contents/popup/new.css');
</style>
