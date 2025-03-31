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
            <button type="button" class="btn_cancel" @click="cancelHandler">취소</button>
            <button type="submit" class="btn_submit" @click.prevent="submitHandler">등록</button>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useFetch, useRuntimeConfig } from '#imports';
import { useDateRangePicker } from '~/composables/useDateRangePicker';

// 환경 변수 설정
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 라우터 및 상태 변수 초기화
const router = useRouter();
const title = ref('');
const titleInput = ref(null);
const address = ref('');
const addressDetail = ref('');
// const startDate = ref('');
// const endDate = ref('');
const operationTime = ref('');
const snsLink = ref('');
const webLink = ref('');
const editor = ref(null);
const images = ref([]);
const fileNames = ref([]);

// DateRangePicker 관련 함수
const { startDate, endDate, initializeDateRangePicker } = useDateRangePicker();

// 컴포넌트 마운트 시 초기화 작업
onMounted(() => {
  // Toast UI 에디터 초기화
  editor.value = new toastui.Editor({
    el: document.querySelector('#contsEditor'),
    previewStyle: 'vertical',
    initialEditType: 'wysiwyg',
    height: '700px',
    placeholder: '내용을 입력해주세요',
    hideModeSwitch: true,
    hooks: {
      // 이미지 업로드 처리 훅
      async addImageBlobHook(blob, callback) {
        try {
          console.log(blob);

          // 이미지 업로드를 위한 FormData 생성
          const formData = new FormData();
          formData.append('fileName', blob);
          formData.append('domain', "popup");

          // 임시 이미지 업로드 API 호출
          const response = await fetch(`${apiBase}/editor-image/upload-temp`, {
            method: "POST",
            body: formData,
          });

          // 업로드된 파일명 받기
          const fileName = await response.text();
          console.log(fileName)

          // 콜백으로 이미지 URL 전달
          callback(`http://localhost:8081/api/v1/uploads/temp/popup/${fileName}`);
        
        } catch (error) {
          console.log("업로드 실패 : ", error);
        }
      }
    } // hooks end
  }); // new toastui.Editor end

  // 제목 입력 필드에 자동 포커스 처리
  setTimeout(() => {
    titleInput.value.focus();
  }, 1);

  initializeDateRangePicker('startDateInput', 'endDateInput');
});

// 태그 관련 기능
const tag = ref('');  // 현재 입력 중인 태그
const tags = ref([]); // 추가된 태그 배열

// 태그 추가 함수 - 중복되지 않은 태그만 추가 가능
const addTag = () => {
  const tagText = tag.value.trim();

  if (tagText && !tags.value.includes(tagText)) {
    tags.value.push(tagText);
    tag.value = ''; // 입력 필드 초기화
    console.log('입력된 태그들::', tags.value);
  }
};

// 태그 삭제 함수
// @param {string} tagText - 삭제할 태그 텍스트
const removeTag = (tagText) => {
  const tagIndex = tags.value.indexOf(tagText);

  if (tagIndex > -1) {
    tags.value.splice(tagIndex, 1);
  }
};

// 카테고리 옵션 정의
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

// 지역 옵션 정의
const regionOptions = ref([
  {
    items: [
      { value: 1, label: '더현대서울' },
      { value: 2, label: '성수' },
      { value: 3, label: '마포 / 서대문 / 홍대' },
      { value: 4, label: '강남 / 송파' },
      { value: 5, label: '그 외 지역' },
    ]
  }
]);

// 선택 옵션 상태 관리
const selectedCategory = ref(Array(categoryOptions.value.length).fill(''));
const selectedRegion = ref(Array(regionOptions.value.length).fill(''));

/**
 * 선택 옵션의 텍스트 색상 결정
 * @param {string} value - 선택된 값
 * @return {string} - css 색상 값
 */
const getColor = (value) => {
  return value === '' ? 'var(--color-grey-6)' : 'var(--black)';
};


// 이미지 업로드 핸들러
const fileList = ref([]);
const imgUploadHandler = (event) => {
  const files = event.target.files;
  images.value = []; // 기존 이미지 미리보기 초기화
  fileList.value.push(...event.target.files); // fileList에 파일 객체 추가

  // 각 파일의 미리보기 생성
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.push(e.target.result); // 미리보기 이미지 URL 추가
    };
    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 삭제 처리 함수
 * @param {number} index - 삭제할 이미지 인덱스
 */
const removeImage = (index) => {
  images.value.splice(index, 1);   // 선택 인덱스의 미리보기 이미지 삭제
  fileList.value.splice(index, 1); // 파일 객체도 삭제
};


/**
 * 취소 처리 함수
 * 입력 데이터가 있을 경우 확인 메시지 표시
 */
const cancelHandler = () => {
  // 입력된 데이터 확인
  const titleValue = title.value.trim();
  const addressValue = address.value.trim();
  const addressDetailValue = addressDetail.value.trim();
  const snsLinkValue = snsLink.value.trim();
  const webLinkValue = webLink.value.trim();
  const operationTimeValue = operationTime.value.trim();
  const hasImages = images.value.length > 0;
  const hasTags = tags.value.length > 0;

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

  // 취소 확인 창 표시 조건
  if (!isDataEmpty || !isEditorEmpty) {
    const userConfirmed = window.confirm("수정 중인 글쓰기를 종료하시겠습니까?");
    if (userConfirmed) {
      router.push('/admin/contents/popup');
    }
  } else {
    // 입력 데이터가 없으면 바로 목록으로 이동
    router.push('/admin/contents/popup');
  }
};

/**
 * 폼 제출 처리 함수
 * 데이터를 FormData로 구성하여 API 요청
 *  */
const submitHandler = async () => {
  // FormData 객체 생성 및 데이터 추가
  const formDatas = new FormData();
  formDatas.append('title', title.value);
  formDatas.append('address', address.value);
  formDatas.append('addressDetail', addressDetail.value);
  formDatas.append('startDate', startDate.value);
  formDatas.append('endDate', endDate.value);
  formDatas.append('operationTime', operationTime.value);
  formDatas.append('snsLink', snsLink.value);
  formDatas.append('webLink', webLink.value);
  
  // 카테고리 및 지역 정보 추가
  formDatas.append('popupCategory', selectedCategory.value);
  formDatas.append('popupRegion', selectedRegion.value);

  // 태그 추가
  tags.value.forEach((tag) => {
    formDatas.append('tags', tag)
  });

  // 에디터 내용 추가
  formDatas.append('content', editor.value ? editor.value.getHTML() : '');

  // 파일 객체 추가
  fileList.value.forEach((file) => {
    formDatas.append('files', file);
  });


  // API 요청 실행
  try {
    const { data, error, status } = await useFetch(`${apiBase}/admin/popup`, {
      method: 'POST',
      body: formDatas,
    });

    console.log('Response Status:', status.value);
    console.log('넘어온 데이터: ', data.value);

    if (status.value === 'success') {
      console.log('등록 성공');

        // 응답 데이터에 id 있는지 확인 후 리다이렉트
        if(data.value) {
          // 상세페이지로 이동
          router.push(`/admin/contents/popup/${data.value}`);
        } else {
        // id가 없으면 목록페이지로 이동
        router.push('/admin/contents/popup');
        } 

    } else {
      console.log('등록실패 : ', error.value);
      alert('게시물 등록에 실패했습니다.');
    }

  } catch (error) {
    console.error('등록 오류:', error);
    alert('서버와의 연결 오류입니다.');
  }
};
</script>

<style lang="css">
@import url('/public/css/admin/contents/popup/new.css');
</style>
