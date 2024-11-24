export default () => {
  const id = useState("id", () => null);
  const username = useState("username", () => null);
  const email = useState("email", () => null);
  const role = useState("role", () => null);
  const nickname = useState("nickname", () => null);
  const token = useState("token", () => null);

  const isAnonymous = () => {
    return username.value === null;
  }; //비회원 처리

  const setAuthentication = (loginInfo)=>{
      id.value = loginInfo.id;
      username.value = loginInfo.username;
      email.value = loginInfo.email;
      role.value = loginInfo.role;
      nickname.value = loginInfo.nickname;
      token.value = loginInfo.token;
  }

  const loadUserFromStorage = () => {
    if (!import.meta.env.SSR) {
      if (!localStorage.getItem("username")) return;

      id.value = localStorage.getItem("id");
      username.value = localStorage.getItem("username");
      email.value = localStorage.getItem("email");
      role.value = JSON.parse(localStorage.getItem("role")); //[ROLE_ADMIN]
      nickname.value = localStorage.getItem("nickname");
      token.value = localStorage.getItem("token");
    }
  };

  const logout = () => {
    id.value = null;
    username.value = null;
    email.value = null;
    nickname.value = null;
    role.value = [];
    
  };

  const hasRole = (role) => role.value.includes(role);

  return {
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
  };
  }
