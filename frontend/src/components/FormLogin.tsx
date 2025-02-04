import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
type Props = {
  onSwitch: () => void;
};
export const FormLogin = ({ onSwitch }: Props) => {
  const [inputEmail, setEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const createSession = (token: string) => {
    console.log(token);
    localStorage.setItem("token", token);
    console.log("token criado e registrado");
    router.push("/app/home");
  };

  const router = useRouter();
  const handleClick = async () => {
    let credenciais = {
      email: inputEmail.toLowerCase(),
      senha: inputPassword,
    };
    console.log(credenciais);
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credenciais),
      });

      if (res.ok) {
        const json = await res.json();
        console.log(json);

        if (json.error) {
          return console.log(json.error);
        } else {
          return createSession(json.token);
        }
      } else {
        alert("ERRO");
      }
    } catch (error) {
      alert("isso ta aparecendo porque");
    }
  };

  return (
    <div className="formLogin">
      <div className="logo">
        <img src="/images/logo.png" />
      </div>
      <div className="form">
        <input
          type="text"
          placeholder="Digite seu Email"
          value={inputEmail}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={inputPassword}
          onChange={(e) => {
            setInputPassword(e.target.value);
          }}
        />

        <button className="btn-green" onClick={handleClick}>
          Acessar
        </button>

        <p>
          Esqueceu a senha?
          <span onClick={onSwitch}>Recuperar aqui!</span>
        </p>
      </div>
    </div>
  );
};
