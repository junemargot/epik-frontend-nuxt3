import { jwtDecode } from "jwt-decode";

export default () => {
  const id = useState("id", () => null);
  const username = useState("username", () => null);
  const email = useState("email", () => null);
  const role = useState("role", () => null);
  const nickname = useState("nickname", () => null);
  const token = useState("token", () => null);

  // localStorage에서 사용자 정보 로드
  const loadUserFromStorage = () => {
    if (!import.meta.env.SSR) {
      const storedUsername = localStorage.getItem("username");
      if (!storedUsername) return;

      id.value = localStorage.getItem("id");
      username.value = localStorage.getItem("username");
      email.value = localStorage.getItem("email");
      // role.value = JSON.parse(localStorage.getItem("role")); //[ROLE_ADMIN]
      // nickname.value = localStorage.getItem("nickname");
      // token.value = localStorage.getItem("token");
      
      try {
        role.value = JSON.parse(localStorage.getItem("role"));
      } catch(error) {
        role.value = null;
        console.error("역할 정보 파싱 오류: ", error);
      }

      nickname.value = localStorage.getItem("nickname");
      token.value = localStorage.getItem("token") || localStorage.getItem("access_token");
    }
  };

  // 클라이언트 사이드에서 자동으로 사용자 정보 로드
  if(!import.meta.env.SSR && process.client) {
    loadUserFromStorage();
  }

  // 비회원 확인
  const isAnonymous = () => {
    return username.value === null;
  };

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
    if(!import.meta.env.SSR) {
      localStorage.setItem("id", loginInfo.id);
      localStorage.setItem("username", loginInfo.username);
      localStorage.setItem("email", loginInfo.email);
      localStorage.setItem("role", JSON.stringify(loginInfo.role));
      localStorage.setItem("nickname", loginInfo.nickname || "");
      localStorage.setItem("token", loginInfo.token); // 다른 곳에서 사용하는 키와 동기화
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
    if (!import.meta.env.SSR) {
      localStorage.removeItem("id");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("nickname");
      localStorage.removeItem("token");
      localStorage.removeItem("access_token"); // 다른 곳에서 사용하는 키도 제거
    }
  };

  // 특정 역할 확인
  // const hasRole = (role) => role.value.includes(role);
  const hasRole = (roleToCheck) => {
    if(!role.value) return false;

    // role.value가 배열인 경우
    if(Array.isArray(role.value)) {
      return role.value.includes(roleToCheck);
    }

    // role.value가 문자열인 경우
    return role.value === roleToCheck;
  };

  // 토큰 기반 인증 상태 확인
  const checkAuthentication = (tokenValue) => {
    if(!tokenValue && !import.meta.env.SSR) {
      tokenValue = localStorage.getItem("access_token");
    }

    if(tokenValue) {
      try {
        // JWT 디코딩
        const userInfo = jwtDecode(tokenValue);

        // 토큰 만료 확인
        const currentTime = Date.now() / 1000;
        if(userInfo.exp && userInfo.exp > currentTime) {
          setAuthentication({
            id: userInfo.id,
            username: userInfo.username,
            email: userInfo.email,
            role: Array.isArray(userInfo.role)
              ? userInfo.role.map(r => typeof r === 'object' ? r.authority : r)
              : [userInfo.role],
            nickname: userInfo.nickname,
            token: tokenValue
          });
          return true;
        } else {
          logout();
          return false;
        }
      } catch(error) {
        console.error("토큰 검증 오류: ", error);
      }
    }
    return false;
  }

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