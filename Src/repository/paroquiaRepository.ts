import { Promessado } from "./../generated/prisma/enums";
import type { CreateParoquia, updateParoquia } from "@model/dao";
import { prisma } from "database/prisma";
import { Prisma } from "generated/prisma/client";

export class paroquiasMej {
  async createParoquias(datas: CreateParoquia) {
    try {
      const result = await prisma.paroquias.create({
        data: {
          nomeParoquia: datas.nomeParoquia,
          quota: datas.quota,
        },
      });

      await prisma.centrosParoquias.create({
        data: {
          nomeCentro: "Centro sede " + datas.nomeParoquia,
          paroquiaId: result.idParoquia,
        },
      });

      return result;
    } catch (error) {
      throw new Error("Error to create Paroquia!");
    }
  }

  async updateParoquias(datas: updateParoquia) {
    try {
      if (!datas.idParoquia) throw new Error("Id da paróquia é obrigatório!");
      const result = await prisma.paroquias.update({
        where: {
          idParoquia: datas.idParoquia,
        },
        data: {
          ...datas,
        },
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }
      throw new Error("Error to update paróquia");
    }
  }

  async findByIdParoquias(id: number) {
    try {
      const result = await prisma.paroquias.findUnique({ where: { idParoquia: id } });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to find by id Paroquias.");
    }
  }

  async findManyParoquias() {
    try {
      const result = await prisma.paroquias.findMany({
        include: {
          centros: {
            include: {
              membros: true,
            },
          },
        },
      });

      const resultado = result.map((paroquia) => {
        const dadosParoquia = {
          idParoquia: paroquia.idParoquia,
          nomeParoquia: paroquia.nomeParoquia,
          quota : paroquia.quota,
          centros: paroquia.centros,
          totalPromessados: 0,
          totalNaoPromessados: 0,
        };

        paroquia.centros.forEach((centro) => {
          centro.membros.forEach((membro) => {
            if (membro.promessado === "Sim") {
              dadosParoquia.totalPromessados++;
            } else {
              dadosParoquia.totalNaoPromessados++;
            }
          });
        });

        return dadosParoquia;
      });

      return resultado;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to find many paroquias");
    }
  }

  async deleteParoquias(id: number) {
    try {
      const result = await prisma.paroquias.delete({ where: { idParoquia: id } });
      return { message: "Paroquia deleted successfully" };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to delete paroquia whith id " + id);
    }
  }
}
