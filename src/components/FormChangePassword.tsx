import { time } from "console";
import { useEffect, useState } from "react";
type Props = {
  onSwitch: () => void;
};
export const FormChangePassword = ({ onSwitch }: Props) => {
  const [inputEmail, setInputEmail] = useState("");
  const [emailSend, setEmailSend] = useState(false);
  const [timerRemand, setTimerRemand] = useState(30);

  useEffect(() => {
    if (timerRemand === 0) {
      setEmailSend(false);
      setTimerRemand(30);
    }
    if (timerRemand > 0) {
      const interval = setInterval(() => {
        setTimerRemand((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerRemand]);
  const sendEmail = () => {
    setEmailSend(true);
  };
  return (
    <div className="formLogin">
      <div className="logo">
        <img src="/images/logo.png" />
      </div>
      <div className="form">
        <p>
          Para recuperar sua senha, enviaremos um link para seu e-mail
          cadastrado.
        </p>
        <input
          type="email"
          placeholder="Digite seu email"
          value={inputEmail}
          onChange={(e) => {
            setInputEmail(e.target.value);
          }}
          required
        />
        <button
          disabled={emailSend}
          className={emailSend ? "btn-disabled" : "btn-green"}
          onClick={sendEmail}
        >
          Enviar email
        </button>
        {emailSend && <p>Enviar novamente em {timerRemand} segundos </p>}

        <p className="link" onClick={onSwitch}>
          Voltar a pagina de Login
        </p>
      </div>
    </div>
  );
};
