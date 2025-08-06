const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const {
  KAKAO_CLIENT_ID,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  REDIRECT_URI,
  CONTENT_TYPE,
  NAVER_STATE_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

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
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: `${REDIRECT_URI}?platform=kakao`,
        code: code,
      },
      {
        headers: {
          "Content-Type": CONTENT_TYPE,
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
      `https://nid.naver.com/oauth2.0/token?client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&grant_type=authorization_code&state=${NAVER_STATE_KEY}&code=${code}`
    )
    .then((naverRes) => res.send(naverRes.data.access_token));
});

app.post("/google/login", async (req, res) => {
  const code = req.body.authCode;

  const redirect_uri = `${REDIRECT_URI}?platform=google`;

  try {
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const access_token = tokenRes.data.access_token;
    res.send(access_token);
  } catch (err) {
    console.error("Google 로그인 실패:", err?.response?.data || err.message);
    res.status(500).send("구글 로그인 실패");
  }
});

app.post("/kakao/userinfo", (req, res) => {
  // console.log(req.body);
  const { accessToken } = req.body;
  axios
    .get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": CONTENT_TYPE,
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

app.post("/google/userinfo", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.send(userRes.data);
  } catch (err) {
    console.error("Google 유저 정보 오류:", err?.response?.data || err.message);
    res.status(500).send("유저 정보 불러오기 실패");
  }
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
      `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&access_token=${access_token}&service_provider=NAVER`
    )
    .then(res.send("로그아웃 되었습니다"));
});

app.delete("/google/logout", async (req, res) => {
  const { access_token } = req.body;

  try {
    await axios.post(
      "https://oauth2.googleapis.com/revoke",
      new URLSearchParams({ token: access_token }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.send("구글 로그아웃 성공");
  } catch (err) {
    console.error("Google revoke 실패:", err?.response?.data || err.message);
    res.status(500).send("구글 로그아웃 실패");
  }
});

