import express, { Router } from "express";
import { router } from "./src/routes";
import passport from "passport";
import { estrategiaLocal } from "./src/libs/passport-local";
import cors from "cors";
import { EstrategiaJWT } from "./src/libs/passport-jwt";

const app = express();
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // Permitir apenas esse domínio
    credentials: true, // Se precisar enviar cookies ou autenticação
  })
);
app.listen(4000, () => {
  console.log("Servidor Rodando em http://localhost:3000/ ...");
});
app.use(express.json());
passport.use(EstrategiaJWT);
passport.use(estrategiaLocal);
app.use(passport.initialize());

app.use(router);
