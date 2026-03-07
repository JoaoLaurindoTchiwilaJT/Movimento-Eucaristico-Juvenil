import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { Criptografia } from "../util/criptografia";

const criptografar = new Criptografia();

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function createAdminIfNotExist() {
  try {
    const adminExist = await prisma.user.findMany({
      where: { role: "Admin" },
    });
console.log(adminExist);
    const senhas = await criptografar.criptografar("Sagrado_Coração_De_Jesus");
    if (adminExist) {
      await prisma.user.create({
        data: {
          nomeMembro: "Admin",
          email: "admin@example.com",
          senha: senhas,
          role: "Admin",
          numeroMembro: "0001",
          contacto: 123456789,
          nivel: "MEJ",
        },
      });
      console.log("Admin criado com sucesso!");
    }
  } catch (error) {
    console.error("Error to create Admin:", error);
  }
}

async function testarConexao() {
  try {
    await prisma.$connect();
    await createAdminIfNotExist();
    console.log("Conexão com o banco de dados bem-sucedida");

    // Chama a função para cadastrar o admin se necessário
    
  } catch (error) {
    console.error("Falha na conexão com o banco de dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testarConexao();

export { prisma };
