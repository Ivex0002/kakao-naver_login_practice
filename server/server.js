const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { useUserStore } = require("../src/store/loginStore");

const {
  kakaoClientId,
  naverClientId,
  naverClientSecret,
  redirectUri,
  contentType,
  naverStateKey,
} = useUserStore.getState();

const app = express();

app.use(
  cors({
    origin: [`http://localhost:5173`],
    methods: ["OPTIONS", "POST", "DELETE"],
  })
);

app.use(express.json());

app.listen(3000, () => console.log(`server open`));

// 카카오, 네이버가 서로 주소와 헤더 설정이 달라서 분기처리하기보단 어느 플랫폼이냐에 따라 각각 메서드를 만드는게 편한듯

app.post("/kakao/login", (req, res) => {
  const code = req.body.authCode;
  axios
    .post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: kakaoClientId,
        redirect_uri: redirectUri,
        code: code,
      },
      {
        headers: {
          "Content-Type": contentType,
        },
      }
    )
    .then((kakaoRes) => res.send(kakaoRes.data.access_token));
});

app.post("/naver/login", (req, res) => {
  const code = req.body.authCode;
  //   console.log(req.body);

  axios
    .post(
      `https://nid.naver.com/oauth2.0/token?client_id=${naverClientId}&client_secret=${naverClientSecret}&grant_type=authorization_code&state=${naverStateKey}&code=${code}`
    )
    .then((naverRes) => res.send(naverRes.data.access_token));
});

app.post("/kakao/userinfo", (req, res) => {
  // console.log(req.body);
  const { accessToken } = req.body;
  axios
    .get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": contentType,
      },
    })
    .then((kakaoRes) => res.send(kakaoRes.data.properties));
});
app.post("/naver/userinfo", (req, res) => {
  //   console.log("네이버 유저 정보",req.body);
  const { accessToken } = req.body;
  axios
    .get("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((naverRes) => res.send(naverRes.data.response));
});

app.delete("/kakao/logout", (req, res) => {
  const { access_token } = req.body;
  //   console.log("access_token:", access_token);
  axios
    .post(
      "https://kapi.kakao.com/v1/user/logout",
      {},
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    )
    .then(res.send("로그아웃 되었습니다"));
});
app.delete("/naver/logout", (req, res) => {
  const { access_token } = req.body;
  //   console.log("access_token:", access_token);
  axios
    .post(
      `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${naverClientId}&client_secret=${naverClientSecret}&access_token=${access_token}&service_provider=NAVER`
    )
    .then(res.send("로그아웃 되었습니다"));
});
