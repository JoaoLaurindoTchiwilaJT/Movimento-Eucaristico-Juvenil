import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { Criptografia } from "../util/criptografia";

const requiredEnv = [
  "DATABASE_HOST",
  "DATABASE_PORT",
  "DATABASE_USER",
  "DATABASE_NAME",
  "email_mej",
  "SECRETE_PASS",
] as const;

function validarVariaveisAmbiente() {
  const missing = requiredEnv.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente em falta: ${missing.join(", ")}`);
  }

  const port = Number(process.env.DATABASE_PORT);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("DATABASE_PORT inválida.");
  }
}


validarVariaveisAmbiente();

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD ?? "",
  database: process.env.DATABASE_NAME!,
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });

export async function createAdminIfNotExist(): Promise<void> {
  const criptografia = new Criptografia();

  const email = process.env.email_mej!.trim();
  const senhaOriginal = process.env.SECRETE_PASS!;

  try {
    // Verifica se já existe um administrador com este email.
    const adminExistente = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (adminExistente) {
      console.log("O administrador já existe:", email);
      return;
    }

    // Evita criar outro administrador se já existir um.
    const outroAdmin = await prisma.user.findFirst({
      where: {
        role: "Admin",
      },
    });

    if (outroAdmin) {
      console.log("Já existe um administrador registado. Nenhum foi criado.");
      return;
    }

    const senhaHash = await criptografia.criptografar(senhaOriginal);

    await prisma.user.create({
      data: {
        nomeMembro: "Admin",
        email,
        senha: senhaHash,
        role: "Admin",
        numeroMembro: "0001",
        contacto: 123456789,
        nivel: "MEJ",
        promessado: "Sim",
      },
    });

    console.log("Administrador criado com sucesso!");
  } catch (error) {
    console.error("Erro ao verificar ou criar o administrador:", error);

    throw error;
  }
}
