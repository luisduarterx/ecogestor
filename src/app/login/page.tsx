"use client";

import { FormChangePassword } from "@/components/FormChangePassword";
import { FormLogin } from "@/components/FormLogin";
import { useState } from "react";

export default function Page() {
  const [showLogin, setShowLogin] = useState(true);
  return (
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
