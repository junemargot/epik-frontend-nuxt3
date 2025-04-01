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
            <input type="text" v-model="address" name="address" placeholder="장소를 입력해주세요" autocomplete="off" />
          </div>
          <div class="input__item">
              <div class="input__title">주소</div>
              <input type="text" v-model="addressDetail" name="addressDetail" placeholder="주소를 입력해주세요" autocomplete="off" />
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
            <button type="submit" class="btn submit" @click="submitHandler" :disabled="isLoading">
              {{ isLoading ? '처리 중...' : '수정' }}
            </button>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Editor } from '@toast-ui/editor';
import { useRouter, useRoute } from 'vue-router';
import { useRuntimeConfig } from 'nuxt/app';
import { markRaw } from 'vue';

const router = useRouter();
const route = useRoute();
const popupId = route.params.id;
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// 상태 변수 초기화
const title = ref('');
// const venue = ref('');
const address = ref('');
const addressDetail = ref('');
const startDate = ref('');
const endDate = ref('');
const operationTime = ref('');
const snsLink = ref('');
const webLink = ref('');
const editor = ref(null);
const images = ref([]);
const tag = ref('');
const tags = ref([]);
const isLoading = ref(false);


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
      { value: 'gangnam', label: '강남 / 송파' },
      { value: 'others', label: '그 외 지역' },
    ]
  }
]);

const selectedCategory = ref(Array(categoryOptions.value.length).fill('media'));
const selectedRegion = ref(Array(regionOptions.value.length).fill('hyundai'));

// 팝업 데이터 가져오기
const fetchPopupData = async () => {
  try {
    isLoading.value = true;
    const { data } = await useFetch(`${apiBase}/admin/popup/${popupId}`, {
      method: 'GET'
    });

    if(data.value) {
      // console.log('팝업 데이터 로드: ', data.value);
      console.log('팝업 데이터 로드 전체: ', JSON.stringify(data.value, null, 2));

      // 각 필드 개별 확인
      console.log('address 필드: ', data.value.address);
      console.log('addressDetail 필드: ', data.value.addressDetail);
      console.log('operaitionTime 필드: ', data.value.operationTime);
      console.log('snsLink 필드: ', data.value.snsLink);
      console.log('webLink 필드:', data.value.webLink);
      console.log('popupImages 필드: ', data.value.saveImageNames);

      // 데이터 매핑 - setTimeout으로 지연 처리
      setTimeout(() => {
        title.value = data.value.title || '';
        // venue.value = data.value.venue || '';
        address.value = data.value.address || '';
        addressDetail.value = data.value.addressDetail || '';
        startDate.value = data.value.startDate || '';
        endDate.value = data.value.endDate || '';
        operationTime.value = data.value.operationTime || '';
        snsLink.value = data.value.snsLink || '';
        webLink.value = data.value.webLink || '';

        // 태그 설정
        if(data.value.tags && Array.isArray(data.value.tags)) {
          tags.value = data.value.tags;
        }

        // 카테고리 및 지역 설정
        if(data.value.popupCategory) {
          selectedCategory.value = Array(categoryOptions.value.length).fill(data.value.popupCategory);
        }

        if(data.value.popupRegion) {
          selectedRegion.value = Array(regionOptions.value.length).fill(data.value.popupRegion);
        }

        // 이미지 설정
        if(data.value.saveImageNames && Array.isArray(data.value.saveImageNames)) {
          console.log('이미지 매핑 전:', data.value.saveImageNames);
          images.value = data.value.saveImageNames.map(img => {
            const imgPath = `${apiBase}/uploads/images/popup/${img}`;
            console.log('생성된 이미지 경로:', imgPath);
            return imgPath;
          });
          console.log('매핑된 이미지:', images.value);
        }

        // 날짜 입력 필드 업데이트
        updateDateInputs()
      }, 100);

      // 에디터 내용 설정
      nextTick(() => {
        if(editor.value && data.value.content) {
          try {
            // 직접 상태 업데이트 방식으로 변경
            editor.value.setMarkdown(data.value.content);
            // editor.value.setHTML(data.value.content);
          } catch(e) {
            console.error('데이터 내용 설정 오류', e);
          }
        }
      });
    }

  } catch(error) {
    console.error('팝업 데이터 로드 오류: ', error);

  } finally {
    isLoading.value = false;
  }
};

// 날짜 입력 필드 업데이트
const updateDateInputs = () => {
  const $ = window.jQuery;
  if(startDate.value) {
    $('#startDateInput').val(startDate.value);
  }

  if(endDate.value) {
    $('#endDateInput').val(endDate.value);
  }
};

const getColor = (value) => {
  return value === '' ? 'var(--color-grey-6)' : 'var(--black)';
};


onMounted(() => {
  editor.value = markRaw(new Editor({
    el: document.querySelector('#contsEditor'),
    previewStyle: 'vertical',
    initialEditType: 'wysiwyg',
    height: '700px',
    placeholder: '내용을 입력해주세요',
    hideModeSwitch: true
  }));

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

  // 데이터 가져오기 - 에디터 초기화 후에 실행
  // const data = fetchData();
  fetchPopupData();

  // 에디터에 컨텐츠 로드
  // editor.setHTML(data.content);
});


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
const fileList = ref([]);
const imgUploadHandler = (event) => {
  const files = event.target.files;
  images.value = []; // 기존 이미지 초기화

  // 기존 이미지는 유지하고 새 이미지만 추가
  Array.from(files).forEach((file) => {
    fileList.value.push(file);

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


// 폼 제출 핸들러
const submitHandler = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('venue', venue.value);
    formData.append('address', address.value);
    formData.append('startDate', startDate.value);
    formData.append('endDate', endDate.value);
    formData.append('operationTime', operationTime.value);
    formData.append('snsLink', snsLink.value);
    formData.append('webLink', webLink.value);
    
    // 카테고리
    formData.append('popupCategory', selectedCategory.value[0]);
    
    // 지역
    formData.append('popupRegion', selectedRegion.value[0]);
    
    // 태그
    tags.value.forEach(tag => {
      formData.append('tags', tag);
    });
    
    // 에디터 내용
    formData.append('content', editor.value ? editor.value.getHTML() : '');
    
    // 새로 추가된 파일
    fileList.value.forEach(file => {
      formData.append('files', file);
    });
    
    const { data, error } = await useFetch(`${apiBase}/admin/popup/${popupId}`, {
      method: 'PUT',
      body: formData
    });
    
    if (data.value) {
      alert('팝업이 성공적으로 수정되었습니다.');
      router.push(`/admin/contents/popup/${popupId}`);
    } else {
      console.error('수정 실패:', error.value);
      alert('팝업 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('수정 오류:', error);
    alert('서버와의 연결 오류입니다.');
  } finally {
    isLoading.value = false;
  }
};

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

</script>

<style lang="css" scoped>
@import url('/public/css/admin/contents/popup/edit.css');

</style>