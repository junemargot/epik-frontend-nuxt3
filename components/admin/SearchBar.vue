<template>
  <section class="search">
    <div class="search__bar">
      <div class="search__dropdown">
        <div id="drop-text" class="search__text" @click="toggleDropdown">
          <span id="span">{{ selectedCategory }}</span>
          <i id="icon" class='bx bx-chevron-down' :style="{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }">
          </i>
        </div>
        <ul id="drop-list" class="search__list" :class="{ show: isOpen }">
          <li class="search__item" v-for="item in categories" :key="item" @click="selectCategory(item)">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="search__box">
        <input 
          type="text" id="search-input" 
          :placeholder="inputPlaceholder" 
          v-model="searchQuery"
          @keyup.enter="performSearch"
        />
        <i class='bx bx-search' @click.prevent.stop='performSearch'></i>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { categoryMapping } from '~/utils/categoryMapping';

const props = defineProps({
  initialCategory: {
    type: String,
    default: '통합검색'
  },

  initialQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['search']);

// 검색 관련 상태
const categories = ['통합검색', '제목 + 내용', '제목', '내용', '작성자'];
const selectedCategory = ref(props.initialCategory);
const inputPlaceholder = ref('검색어를 입력해주세요');
const searchQuery = ref(props.initialQuery);
const isOpen = ref(false);

// 드롭다운 토글
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 카테고리 선택 함수
const selectCategory = (category) => {
  selectedCategory.value = category;
  updatePlaceholder(category);
  isOpen.value = false;
};

// placeholder 업데이트
const updatePlaceholder = (category) => {
  if (category === '통합검색') {
    inputPlaceholder.value = '검색어를 입력해주세요';
  } else if (category === '작성자') {
    inputPlaceholder.value = `검색할 ${category}를 입력해주세요`;
  } else {
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
  }
};

// 검색 수행
const performSearch = () => {
  console.log('검색 실행: ', {
    query: searchQuery.value,
    category: selectedCategory.value,
    categoryCode: categoryMapping[selectedCategory.value] || 'ALL'
  });
  
  emit('search', {
    query: searchQuery.value,
    category: selectedCategory.value,
    categoryCode: categoryMapping[selectedCategory.value] || 'ALL'
  });
};

// 클릭 외부 영역 처리
const handleClickOutside = (e) => {
  if (!e.target.closest('.search')) {
    isOpen.value = false;
  }
};

// 초기 값 설정
onMounted(() => {
  window.addEventListener('click', handleClickOutside);
  updatePlaceholder(selectedCategory.value);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

// props 변경 감지
watch(() => props.initialQuery, (newVal) => {
  searchQuery.value = newVal;
});

watch(() => props.initialCategory, (newVal) => {
  if (categories.includes(newVal)) {
    selectedCategory.value = newVal;
    updatePlaceholder(newVal);
  }
});

// 외부에서 접근할 수 있는 메서드 노출
defineExpose({
  performSearch
});

</script>

<style scoped>
/* SEARCH BAR */
.search {
  display: flex;
  height: 100px;
  padding: 25px 0 80px 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin-left: 230px;
}

.search .search__bar {
  display: flex;
  align-items: center;
  min-width: 700px;
  border-radius: var(--radius-2);
  border: 1px solid var(--color-grey-4);
  background-color: var(--white);
}

.search .search__dropdown {
  position: relative;
  z-index: 1;
}

.search .search__bar .search__dropdown {
  position: relative;
  width: 170px;
  border-radius: var(--radius-2);
  border-right: 1px solid var(--color-grey-4);
  background-color: var(--white);
  box-shadow: var(--shadow);
  cursor: pointer;
}

/* SEARCH BAR - 검색 카테고리 */
.search__text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  padding: 10px;
}

.search__text i {
  font-size: 18px;
}

.search__list {
  position: absolute;
  top: 46px;
  left: 0;
  width: 100%;
  border-radius: var(--radius-2);
  max-height: 0;
  overflow: hidden;
  background-color: var(--white);
  transition: max-height .5s;
}

#drop-list.show {
  max-height: 300px;
  background: var(--white);
  border: 1px solid var(--color-grey-4);
  border-radius: var(--radius-2);
}

.search__item {
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-2);
  padding: 10px 0 10px 10px;
  transition: margin-left .3s ease, color .2s ease;
}

.search__item:hover {
  margin-left: 5px;
  color: var(--accent-1);
}

/* SEARCH BAR - 검색입력창 */
.search__box {
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 10px;
  color: var(--color-grey-6);

}

.search__box input {
  padding: 10px;
  width: 100%;
  font-size: 12px;
  font-weight: 500;
  border: 0;
  outline: 0;
}

.search__box i {
  font-size: 18px;
  cursor: pointer;
}

.search__box input::placeholder {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-grey-6);
}

/* 큰 화면 -> 기본 스타일 유지, 다만 너비 조정 */
@media (max-width: 1024px) {
  .search {
    margin-left: 20px;
    padding: 20px 10px 60px 10px;
  }
  .search .search__bar {
    min-width: auto;
    width: 90%;
  }
}

/* 태블릿/모바일 작은 화면 -> 세로 배치 */
@media (max-width: 768px) {
  .search {
    flex-direction: column;
    align-items: center;
    margin-left: 0;
    padding: 20px 10px;
    height: auto;
  }
  .search .search__bar {
    width: 100%;
    margin-bottom: 15px;
  }
  .search__dropdown {
    width: 40%;
  }
  .search__text {
    font-size: 12px;
    padding: 8px;
  }
  .search__box input {
    padding: 8px;
    font-size: 12px;
  }
  .search__box i {
    font-size: 16px;
  }
}

/* 아주 작은 화면 -> 추가 축소 */
@media (max-width: 480px) {
  .search {
    padding: 10px;
  }
  .search__dropdown {
    width: 45%;
  }
  .search__text {
    font-size: 11px;
    padding: 6px;
  }
  .search__item {
    font-size: 12px;
    padding: 6px 0 6px 8px;
  }
  .search__box input {
    padding: 6px;
    font-size: 11px;
  }
  .search__box i {
    font-size: 14px;
  }
}

</style>