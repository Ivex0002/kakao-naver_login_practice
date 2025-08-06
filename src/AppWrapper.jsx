import { useEffect, useState } from "react";
import { usePlatformStore } from "./store/loginStore";
import App from "./App";

export function AppWrapper() {
  const [hydrated, setHydrated] = useState(false);
  const { set_platform } = usePlatformStore();

  useEffect(() => {
    const saved = localStorage.getItem("platform_store");

    try {
      if (saved) {
        const parsed = JSON.parse(saved); 
        const restored = parsed?.state?.platform;

        if (restored) {
          set_platform(restored);
        }
      }
    } catch (err) {
      console.warn("platform_store 파싱 실패", err);
    }

    setHydrated(true);
  }, []);

  if (!hydrated) return <div>AppWrapper 로딩중...</div>;

  return <App />;
}
