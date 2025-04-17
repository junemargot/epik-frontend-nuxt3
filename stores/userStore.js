/**
 * 사용자 인증 정보를 관리하는 스토어
 * 로그인 상태, 사용자 정보, 토큰 등을 전역적으로 관리
 */
export const useUserDetails = defineStore('userDetails', {
  state: () => ({
    // 인증 여부
    isAuthenticated: false,
    
    // 사용자 기본 정보
    id: null,
    username: null,
    email: null,
    nickname: null,
    
    // 권한 정보
    role: [],
    
    // 토큰 정보
    token: null
  }),
  
  actions: {
    /**
     * 사용자 인증 정보 설정
     * 
     * @param authData 인증 데이터 객체 (id, username, email, role, nickname, token)
     */
    setAuthentication(authData) {
      this.isAuthenticated = true;
      this.id = authData.id;
      this.username = authData.username;
      this.email = authData.email;
      this.role = authData.role || [];
      this.nickname = authData.nickname;
      this.token = authData.token;
    },
    
    /**
     * 로그아웃 처리 (인증 정보 초기화)
     */
    clearAuthentication() {
      this.isAuthenticated = false;
      this.id = null;
      this.username = null;
      this.email = null;
      this.role = [];
      this.nickname = null;
      this.token = null;
      
      // 로컬 스토리지 토큰 제거
      localStorage.removeItem('access_token');
    },
    
    /**
     * 관리자 권한 확인
     * 
     * @returns {boolean} 관리자 여부
     */
    isAdmin() {
      return this.role.includes('ROLE_ADMIN');
    }
  }
});