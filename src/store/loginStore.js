import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useUserStore = create((set) => ({
  serverUrl: "http://localhost:3000",

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
}));

export const usePlatformStore = create(
  persist(
    (set) => ({
      platform: "",
      set_platform: (value) => {
        set({ platform: value });
      },
      clear_platform: () => {
        set({ platform: "" });
      },
    }),
    {
      name: "platform_store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
// export const usePlatformStore = create(
//   persist(
//     (set) => ({
//       platform: "",
//       set_platform: (value) => {
//         set({ platform: value });
//       },
//       clear_platform: () => {
//         set({ platform: "" });
//       },
//     }),
//     {
//       name: "platform_store",
//       storage: localStorage,
//       문자열 처리 안됨....
//       [object Object]이렇게 뜸....
//     }
//   )
// );
