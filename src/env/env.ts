import { z } from "zod";

const schema = z.object({
  PORT: z.string().default("3000"),
  LOCALHOST: z.string().default("http://localhost:3000"),
});

const _env = schema.safeParse(process.env);

if (!_env.success) {
  console.error(`Invalid environment variables: ${_env.error.format()}`);
  throw new Error("Invalid environment variables.");
}

export const env = _env;
