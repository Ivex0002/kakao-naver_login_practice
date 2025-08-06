import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {  useUserStore } from "../store/loginStore";

export function Callback() {
  const navi = useNavigate();
  const { setUser, set_access_token, serverUrl } = useUserStore();
    // const { platform } = usePlatformStore();
  // 지연시간 때문에 스토어가 작동을 안함

  useEffect(() => {
    const url = new URL(window.location.href);
    const authCode = url.searchParams.get("code");
    const platform = url.searchParams.get("platform");
    

    if (authCode) {
      axios
        .post(`${serverUrl}/${platform}/login`, { authCode })
        .then((res) => {
          const accessToken = res.data;
          set_access_token(accessToken);
          return axios.post(`${serverUrl}/${platform}/userinfo`, {
            accessToken,
          });
        })
        .then((res) => {
          setUser(res.data);
          navi("/");
        })
        .catch((err) => {
          console.error("로그인 에러:", err);
        });
    }
  }, []);

  return <div>로그인 중입니다...</div>;
}
