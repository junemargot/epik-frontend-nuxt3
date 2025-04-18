import { jwtDecode } from "jwt-decode";
import { useAuthStore } from '~/stores/auth.js';

export default () => {
  const id = useState("id", () => null);
  const username = useState("username", () => null);
  const email = useState("email", () => null);
  const role = useState("role", () => null);
  const nickname = useState("nickname", () => null);
  const token = useState("token", () => null);

  // 인증 정보 설정
  const setAuthentication = (loginInfo) => {
    // 상태 업데이트
    id.value = loginInfo.id;
    username.value = loginInfo.username;
    email.value = loginInfo.email;
    role.value = loginInfo.role;
    nickname.value = loginInfo.nickname;
    token.value = loginInfo.token;

    // localStorage에 저장
    if(process.client) {
      localStorage.setItem("id", loginInfo.id);
      localStorage.setItem("username", loginInfo.username);
      localStorage.setItem("email", loginInfo.email);
      localStorage.setItem("role", JSON.stringify(loginInfo.role));
      localStorage.setItem("nickname", loginInfo.nickname || "");
      localStorage.setItem("token", loginInfo.token); // 다른 곳에서 사용하는 키와 동기화

      // Pinia 스토어 업데이트
      const authStore = useAuthStore();
      if(authStore) {
        authStore.login(loginInfo.token);
      }
    }
  };

  // 로그아웃 시 상태 초기화
  const logout = () => {
    id.value = null;
    username.value = null;
    email.value = null;
    nickname.value = null;
    role.value = null;
    token.value = null;
    
    // localStorage 정리
    if(process.client) {
      localStorage.removeItem("id");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("nickname");
      localStorage.removeItem("token");
      localStorage.removeItem("access_token"); // 다른 곳에서 사용하는 키도 제거

      if(authStore) {
        authStore.logout();
      }
    }
  };

  // 토큰 기반 인증 상태 확인
  const checkAuthentication = (tokenValue) => {
    if(!tokenValue && process.client) {
      tokenValue = localStorage.getItem("access_token");
    }

    if(tokenValue) {
      try {
        // JWT 디코딩
        const userInfo = jwtDecode(tokenValue);

        // 토큰 만료 확인
        const currentTime = Date.now() / 1000;
        if (userInfo.exp && userInfo.exp > currentTime) {
          // 역할 정보 처리
          let userRoles;
          if (Array.isArray(userInfo.role)) {
            userRoles = userInfo.role.map(r => typeof r === 'object' ? r.authority : r);
          } else if (typeof userInfo.role === 'object' && userInfo.role.authority) {
            userRoles = [userInfo.role.authority];
          } else {
            userRoles = [userInfo.role];
          }

          setAuthentication({
            id: userInfo.id,
            username: userInfo.username,
            email: userInfo.email,
            role: userRoles,
            nickname: userInfo.nickname,
            token: tokenValue
          });
          return true;
        } else {
          logout();
          return false;
        }
      } catch (error) {
        console.error("토큰 검증 오류: ", error);
        logout();
        return false;
      }
    }
    return false;
  };

  // Pinia 스토어 참조
  let authStore;
  if(process.client) {
    authStore = useAuthStore();
  }

  // localStorage에서 사용자 정보 로드
  const loadUserFromStorage = () => {
    if (process.client) {
      const storedToken = localStorage.getItem("access_token");
      if (!storedToken) return;
      
      // 토큰이 있으면 토큰 기반으로 사용자 정보 로드
      checkAuthentication(storedToken);

      // id.value = localStorage.getItem("id");
      // username.value = localStorage.getItem("username");
      // email.value = localStorage.getItem("email");
      
      // try {
      //   role.value = JSON.parse(localStorage.getItem("role"));
      // } catch(error) {
      //   role.value = null;
      //   console.error("역할 정보 파싱 오류: ", error);
      // }

      // nickname.value = localStorage.getItem("nickname");
      // token.value = localStorage.getItem("token") || localStorage.getItem("access_token");
    }
  };

  // 클라이언트 사이드에서 자동으로 사용자 정보 로드
  if(process.client) {
    loadUserFromStorage();
  }

  // 비회원 확인
  const isAnonymous = () => {
    return username.value === null;
  };

  // 특정 역할 확인
  const hasRole = (roleToCheck) => {
    if(!role.value) return false;

    // role.value가 배열인 경우
    if (Array.isArray(role.value)) {
      return role.value.some(r => {
        if (typeof r === 'object' && r.authority) {
          return r.authority === roleToCheck;
        }
        return r === roleToCheck;
      });
    }

    // role.value가 문자열인 경우
    return role.value === roleToCheck;
  };

  return {
    // id,
    // username,
    // email,
    // role,
    // nickname,
    // token,
    // isAnonymous,
    // setAuthentication,
    // hasRole,
    // logout,
    // loadUserFromStorage,
    id,
    username,
    email,
    role,
    nickname,
    token,
    isAnonymous,
    setAuthentication,
    hasRole,
    logout,
    loadUserFromStorage,
    checkAuthentication
  };
}