import fastifyCors from "@fastify/cors";
import dotenv from "dotenv";
import fastify, { type FastifyInstance } from "fastify";
// import {serializerCompiler} from"fastify-type-provider-zod";
// import {validatorCompiler} from "fastify-type-provider-zod";

dotenv.config();
const port = Number(process.env.PORT) || 3000;
const app: FastifyInstance = fastify({ requestTimeout: 6000 });

// app.setValidatorCompiler(validatorCompiler);
// app.setSerializerCompiler(serializerCompiler);
app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || "0.0.0.0",
    });
    app.log.info(`Server listenig on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.on("SIGINT", async () => {
      try {
        await app.close();
        process.exit(0);
      } catch (err) {
        process.exit(1);
      }
    });
  }
};

start();
