import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/loginStore";

export function Callback() {
  const navi = useNavigate();
  const { setUser, set_access_token, serverUrl, set_platform } = useUserStore();

  useEffect(() => {
    const url = new URL(window.location.href);
    const authCode = url.searchParams.get("code");
    const naverStatekey = url.searchParams.get("state");

    if (authCode) {
      if (naverStatekey) {
        axios.post(`${serverUrl}naver/login`, { authCode }).then((res) => {
          //   console.log('naver:', res.data)
          const accessToken = res.data;
          set_access_token(accessToken);
          axios
            .post(`${serverUrl}naver/userinfo`, { accessToken })
            .then((res) => {
              setUser(res.data);
              set_platform("naver");
            })
            .then(navi("/"));
        });
      } else {
        axios
          .post(`${serverUrl}kakao/login`, { authCode })
          .then((res) => {
            // console.log("로그인 성공", res.data);
            const accessToken = res.data;
            set_access_token(accessToken);
            axios
              .post(`${serverUrl}kakao/userinfo`, { accessToken })
              .then((res) => {
                setUser(res.data);
                set_platform("kakao");
              })
              .then(navi("/"));
          })
          .catch((err) => {
            console.error("로그인 실패", err);
          });
      }
    }
  }, []);

  return <div>로그인 중입니다...</div>;
}
