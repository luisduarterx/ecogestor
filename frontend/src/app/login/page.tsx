"use client";

import { FormChangePassword } from "@/components/FormChangePassword";
import { FormLogin } from "@/components/FormLogin";
import { useAuthContext } from "@/context/userContext";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  const [showLogin, setShowLogin] = useState(true);

  if (user) {
    return router.push("/app/home");
  }

  return loading ? (
    "loading"
  ) : (
    <div className="initialLogin">
      <div className="container-login">
        <div className="leftBanner"></div>
        <div className="boxRigth">
          {showLogin ? (
            <FormLogin onSwitch={() => setShowLogin(false)} />
          ) : (
            <FormChangePassword onSwitch={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
