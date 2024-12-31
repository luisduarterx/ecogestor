import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Props = {
  onSwitch: () => void;
};
export const FormLogin = ({ onSwitch }: Props) => {
  const [inputEmail, setEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const router = useRouter();
  const handleClick = () => {
    router.push("/home");
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
