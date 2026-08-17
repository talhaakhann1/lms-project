"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/src/store/hook";
import { logIn, logOut } from "../store/authSlice";
import { authService } from "../services/auth.service";
// import { AppLoader } from "@/components/skeletons/App-loader";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const user = await authService.getUser();

        if (!cancelled) {
          dispatch(logIn(user));
        }
      } catch {
        if (!cancelled) {
          dispatch(logOut());
        }
      } finally {
        if (!cancelled) {
          setChecked(true);
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  
  if (!checked) {
    return null;
    
    // return <AppLoader />;
  }

  return <>{children}</>;
}

export default AuthInitializer;