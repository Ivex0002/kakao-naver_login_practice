import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  serverUrl: "http://localhost:3000/",
  kakaoClientId: "6cac4506cae0a4135b2b5cdf245fe70f",
  naverClientId: "kUfKYluf6SbhWOIcUZc7",
  redirectUri: "http://localhost:5173/callback",
  contentType: "application/x-www-form-urlencoded;charset=utf-8",
  naverClientSecret: "yEvWNEuhgQ",
  naverStateKey: "hello_naver",

  user: null,
  setUser: (userData) => {
    set({ user: userData });
  },
  clearUser: () => {
    set({ user: null });
  },

  access_token: null,
  set_access_token: (token) => {
    set({ access_token: token });
  },
  clear_access_token: () => {
    set({ access_token: null });
  },

  platform: "",
  set_platform: (platform) => {
    set({ platform: platform });
  },
  clear_platform: () => {
    set({ platform: "" });
  },
}));
