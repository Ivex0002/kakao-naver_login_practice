import { useEffect, useState } from "react";
import "./App.css";
import { usePlatformStore, useUserStore } from "./store/loginStore";
import axios from "axios";

function App() {
  const { user, access_token, clear_access_token, serverUrl } = useUserStore();

  const {
    VITE_KAKAO_CLIENT_ID: KAKAO_CLIENT_ID,
    VITE_NAVER_CLIENT_ID: NAVER_CLIENT_ID,
    VITE_REDIRECT_URI: REDIRECT_URI,
    VITE_NAVER_STATE_KEY: NAVER_STATE_KEY,
    VITE_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  } = import.meta.env;

  const { platform, set_platform, clear_platform } = usePlatformStore();

  useEffect(() => {
    console.log("platform:", platform);
  }, [platform]);

  const [userInfo, setUserInfo] = useState({
    // 빈 객체 써도 되지만 자료구조 명시용으로 작성함
    nickname: null,
    thumbnail_image: null,
  });

  useEffect(() => {
    async function getUser() {
      if (!user) return;
      console.log(user);
      
      setUserInfo({
        // 카카오 : nickname, thumbnail_image
        // 네이버 : name, profile_image(썸넬이미지 없)
        // 구글 : name, picture
        nickname: user.nickname ?? user.name ,
        thumbnail_image: user.thumbnail_image ?? user.profile_image ?? user.picture,
      });
    }
    getUser();
  }, [user]);

  const handleLogin = (value) => {
    set_platform(value);
    const redirectUriWithPlatform = `${REDIRECT_URI}?platform=${value}`;
    const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${redirectUriWithPlatform}&response_type=code`;
    const naverUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&response_type=code&redirect_uri=${redirectUriWithPlatform}&state=${NAVER_STATE_KEY}`;
    const googleParams = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUriWithPlatform,
      response_type: "code",
      scope: "openid email profile",
      // state: generateRandomStrir(16),
    });
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${googleParams.toString()}`;

    switch (value) {
      case "kakao":
        window.location.href = kakaoUrl;
        break;
      case "naver":
        window.location.href = naverUrl;
        break;
      case "google":
        window.location.href = googleUrl;
        break;
      default:
        console.error("알 수 없는 플랫폼:", value);
    }
  };

  const handleLogout = () => {
    if (!platform) {
      console.error("platform 정보가 없습니다");
      return;
    }
    axios
      .delete(`${serverUrl}/${platform}/logout`, {
        data: { access_token },
      })
      .then((res) => {
        console.log(res.data);
        setUserInfo({
          profile_image: null,
          nickname: null,
          thumbnail_image: null,
        });

        clear_access_token();
        clear_platform();
      });
  };

  return (
    <>
      <h1>OAuth2.0 실습</h1>
      <div className="login_buttons">
        <button onClick={() => handleLogin("kakao")}>카카오</button>
        <button onClick={() => handleLogin("naver")}>네이버</button>
        <button onClick={() => handleLogin("google")}>구글</button>
      </div>
      <div className="user_info">
        {/* <img src={userInfo.profile_image} alt="유저 프로필 사진" /> */}
        {/* 프로필 이미지 비율 1:1 아니어서 뺌 */}
        <img
          src={userInfo.thumbnail_image ?? "/vite.svg"}
          alt="유저 썸네일 사진"
        />
        <div className="user_name">{userInfo.nickname}</div>
        <button className="logout" onClick={() => handleLogout()}>
          로그아웃
        </button>
      </div>
    </>
  );
}

export default App;
