import z from "zod";

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(4),
  telefone: z.string(),
  rankID: z.number().default(1),
});
