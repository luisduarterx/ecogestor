import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
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
  console.log("Servidor Rodando em http://localhost:4000/ ...");
});

passport.use(EstrategiaJWT);
passport.use(estrategiaLocal);
app.use(passport.initialize());

// Middleware para processar JSON
app.use(express.json());

// Middleware para processar dados urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(router);
