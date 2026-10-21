import fastifyCors from "@fastify/cors";
import dotenv from "dotenv";
import fastify from "fastify";

import { userRouter } from "@router/userRouter";
import { paroquiasRouter } from "@router/paroquiaRouter";
import { centrosRouter } from "@router/centroRouter";
import { actividadeRouter } from "@router/actividadeRouter";

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Multipart from "@fastify/multipart";

import { prisma, createAdminIfNotExist } from "./database/prisma";

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(Multipart, {
  attachFieldsToBody: true,
  limits: {
    fileSize: 4.5 * 1024 * 1024,
  },
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API MEJ",
      description: "API para gestão de membros do MEJ",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(userRouter, {
  prefix: "/user",
});

app.register(paroquiasRouter, {
  prefix: "/paroquias",
});

app.register(centrosRouter, {
  prefix: "/centros",
});

app.register(actividadeRouter, {
  prefix: "/actividade",
});

const start = async () => {
  try {
    console.log("[1] A conectar ao MySQL...");
    await prisma.$connect();

    console.log("[2] A verificar o administrador...");
    await createAdminIfNotExist();

    console.log("[3] A iniciar o Fastify...");

    await app.listen({
      port,
      host: process.env.HOST || "0.0.0.0",
    });

    console.log(`[4] Servidor disponível em http://localhost:${port}`);
    console.log(`[5] Swagger disponível em http://localhost:${port}/docs`);
  } catch (error) {
    console.error("[ERRO] Falha ao iniciar o servidor:", error);

    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
};

let encerrando = false;

const shutdown = async () => {
  if (encerrando) return;

  encerrando = true;

  try {
    await app.close();
  } catch (error) {
    app.log.error(error, "Erro ao encerrar o servidor Fastify.");
  } finally {
    await prisma.$disconnect().catch((error) => {
      app.log.error(error, "Erro ao encerrar a conexão Prisma.");
    });

    process.exit(0);
  }
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

start();
