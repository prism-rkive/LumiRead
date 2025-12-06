import api from "./api";

const checkAuth = async () => {
  if (localStorage.getItem("currentUser") !== null) {
    const obj = localStorage.getItem("currentUser");
    const jwt = JSON.parse(obj);
    try {
      const res = await api.post(
        "/api/user/isAuthed",
        {},
        {
          headers: { Authorization: `Bearer ${jwt.token}` },
        }
      );
      if (res.data.auth_status) {
        return { loading: false, signedIn: true, token: jwt.token };
      } else {
        localStorage.removeItem("currentUser");
        return { loading: false, signedIn: false };
      }
    } catch (e) {
      localStorage.removeItem("currentUser");
      return { loading: false, signedIn: false };
    }
  } else {
    return { loading: false, signedIn: false };
  }
};

export default checkAuth;