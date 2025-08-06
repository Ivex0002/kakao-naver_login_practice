import { useEffect, useState } from "react";
import "./App.css";
import { useUserStore } from "./store/loginStore";
import axios from "axios";

function App() {
  const {
    user,
    access_token,
    clear_access_token,
    redirectUri,
    kakaoClientId,
    naverClientId,
    naverStateKey,
    serverUrl,
    platform,
    clear_platform,
  } = useUserStore();

  const [userInfo, setUserInfo] = useState({
    // 빈 객체 써도 되지만 자료구조 명시용으로 작성함
    nickname: null,
    thumbnail_image: null,
  });

  useEffect(() => {
    async function getUser() {
      if (!user) return;
      setUserInfo({
        // 카카오 : nickname, thumbnail_image
        // 네이버 : name, profile_image(썸넬이미지 없)
        nickname: user.nickname ?? user.name,
        thumbnail_image: user.thumbnail_image ?? user.profile_image,
      });
    }
    getUser();
  }, [user]);

  const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectUri}&response_type=code`;

  const naverUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&response_type=code&redirect_uri=${redirectUri}&state=${naverStateKey}`;

  // console.log(kakaoUrl);

  const handleLoginKakao = () => {
    location.href = kakaoUrl;
  };

  const handleLoginNaver = () => {
    location.href = naverUrl;
  };

  const handleLogout = () => {
    axios
      .delete(`${serverUrl}${platform}/logout`, {
        data: { access_token },
      })
      .then((res) => {
        console.log(res.data);
        setUserInfo({
          profile_image: null,
          nickname: null,
          thumbnail_image: null,
        });
      });
    clear_access_token();
    clear_platform();
  };

  return (
    <>
      <h1>OAuth2.0 실습</h1>
      <div className="login_buttons">
        <button onClick={() => handleLoginKakao()}>카카오</button>
        <button onClick={() => handleLoginNaver()}>네이버</button>
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
