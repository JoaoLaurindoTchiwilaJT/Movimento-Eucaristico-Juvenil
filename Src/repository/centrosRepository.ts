import { CreateCentro, type updateCentro } from "@model/dao";
import { prisma } from "database/prisma";
import { Prisma } from "generated/prisma/client";

export class centrosMej {
  async createCentro(datas: CreateCentro) {
    try {
      const paroquiaConfirm = await prisma.paroquias.findFirst({
        where: {
          idParoquia: datas.paroquia,
        },
      });

      if (paroquiaConfirm) {
        const result = await prisma.centrosParoquias.create({
          data: {
            nomeCentro: datas.nomeCentro,
            paroquiaId: datas.paroquia,
          },
        });

        const result1 = await prisma.centrosParoquias.findMany({
          where: {
            idCentrosParoquias: result.idCentrosParoquias,
          },
          include: {
            membros: {
              where: {
                cargo: "Coordenador",
              },
            },
          },
        });

        const centro = result1.map((centro) => ({
          nomeCentro: centro.nomeCentro,
          coordenador: centro.membros[0]?.nomeMembro ?? "Sem coordenador",
          paroquia: centro.paroquiaId
        }));

        return centro[0];
      } else {
        return { message: "Id da paróquia invalido" };
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to create centro!");
    }
  }

  async updateCentro(datas: updateCentro) {
    try {
      if (!datas.idCentrosParoquias) throw new Error("Id da paróquia é obrigatório!");
      const result = await prisma.centrosParoquias.update({
        where: {
          idCentrosParoquias: datas.idCentrosParoquias,
        },
        data: {
          nomeCentro: datas.nomeCentro,
        },
      });

      console.log(result)
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }
      throw new Error("Error to update paróquia");
    }
  }

  async findByIdCentros(id: number) {
    try {
      const result = await prisma.centrosParoquias.findUnique({
        where: { idCentrosParoquias: id },
        include: {
          membros: {
            where: { cargo: "Coordenador" },
          },
        },
      });

      // Se não encontrou, retorna null
      if (!result) return null;

      // Monta o objeto final
      const centro = {
        idCentrosParoquias: result.idCentrosParoquias,
        nomeCentro: result.nomeCentro,
        coordenador: result.membros[0]?.nomeMembro ?? "Sem coordenador",
        paroquia: result.paroquiaId
      };

      return centro;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to find by id Centros.");
    }
  }

  async findManyCentros() {
    try {
      const result = await prisma.centrosParoquias.findMany({
        include: {
          membros: {
            where: { cargo: "Coordenador" },
          },
          paroquia: true,
          _count: {
            select: {
              membros: true,
            },
          },
        },
      });

      // Formata todos os centros em um array simples
      const centros = result.map((centro) => ({
        idCentrosParoquias: centro.idCentrosParoquias,
        nomeCentro: centro.nomeCentro,
        coordenador: centro.membros[0]?.nomeMembro ?? "Sem coordenador",
        paroquia: centro.paroquiaId,
        qtdMembros: centro._count.membros,
      }));

      return centros;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to find many Centros");
    } 
  }

  async deleteCentros(id: number) {
    try {
      const result = await prisma.centrosParoquias.delete({ where: { idCentrosParoquias: id } });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to delete centro whith id " + id);
    }
  }

}
