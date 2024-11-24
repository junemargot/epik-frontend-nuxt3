import { useFetch } from "#app";
import { useRuntimeConfig } from "#app";

export const useNoticeFetch = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase; // runtimeConfig.public에서 api를 가져옴 `${config.public.apiBase}`

  // 공지사항 목록 
  // const fetchNotices = async (page = 1, size = 15) => {
  //   const { data, error } = await useFetch('/admin/notice', {
  //     baseURL: apiBase || 'http://localhost:8081/api/v1',
  //     params: {
  //       p: page, // 페이지 번호
  //       size: size  // 페이지에 담기는 데이터 개수 (1페이지에 15개 항목 출력)
  //     },
  //   });

  // 22 
  const fetchNotices = async () => {
    const { data, error } = await useFetch('/admin/notice', {
      baseURL: apiBase || 'http://localhost/8081/api/v1',
    });
    
    if (error.value) {
      console.error("공지사항을 불러오는 중 오류 발생:", error.value)
      // return { notices: [], totalCount: 0, totalPages: 0, pages: [] }
      return { notices: [] };
    }
  
    if (!data.value || !data.value.noticeList) {
      console.error("응답 데이터가 올바르지 않습니다.")
      // return { notices: [], totalCount: 0, totalPages: 0, pages: [] }
      return { notices: [] };
    }
    
    // 내림차순 정렬 후 반환
    return {
      notices: data.value.noticeList.sort((a, b) => new Date(b.writeDate) - new Date(a.writeDate)),
    };
  };

  // 공지사항 상세
  const fetchNoticeById = async (id) => {
    try {
      const { data, error, status: isFetching } = await useFetch(`/admin/notice/${id}`, {
        baseURL: apiBase || 'http://localhost:8081/api/v1', // 기본 API URL 설정
      });

      if(isFetching === "PENDING") {
        console.log("공지사항 상세 로딩중");
      }

      if(error.value) {
        console.error("공지사항을 불러오는데 실패했습니다.", error.value);
        return null; // 오류 발생하면 null
      }

      return data.value || null; // 데이터가 없으면 null 반환
    
    } catch(error) {
      console.error("공지사항 상세 fetch 에러", error);
      return null;
    } //byid
  };

  // 공지사항 삭제
  const fetchNoticeDelete = async(id) => {
    try {
      const { error } = await useFetch(`/admin/notice/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase || 'http://localhost:8081/api/v1',
      });

      if(error.value) {
        console.error("공지사항 삭제 실패:", error.value);
        throw new Error("공지사항 삭제에 실패했습니다.");
      }

      return true; // 삭제 성공
    } catch(error) {
      console.error("공지사항 삭제 중 오류 발생", error);
      throw error;
    }
  }; // delete

  // 공지사항 수정
  const fetchNoticeUpdate = async (id, patchData) => {
    try {
      const { data, error } = await useFetch(`/admin/notice/${id}`, {
        method: 'PATCH',
        body: patchData,
        baseURL: apiBase || 'http://localhost:8081/api/v1',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if(error.value) {
        throw new Error(error.value.message || '알 수 없는 오류 발생');
      }

      console.log('서버 응답 데이터: ', data.value);

      if(data.value && data.value.id) {
        return data.value;
      } else {
        throw new Error('서버 응답 데이터가 올바르지 않습니다.');
      }
    } catch(error) {
      console.error('공지사항 수정 중 오류 발생: ', error);
      throw error;
    }
  }; // update

  return { 
    fetchNotices,
    fetchNoticeById,
    fetchNoticeDelete,
    fetchNoticeUpdate,
  }
};
