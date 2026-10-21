import { CreateActividade, type UpdateActividade } from "@model/dao";
import { prisma } from "database/prisma";
import { Prisma } from "generated/prisma/client";

export class actividade {

  async createActividade(datas: CreateActividade) {
    try {
      const result = await prisma.actividade.create({
        data: {
          nomeActividade: datas.nomeActividade,
          descricao: datas.descricao,
          localizacao: datas.localizacao,
          categoria: datas.categoria,
          estado: datas.estado,
          dataActiv: datas.dataActiv,
          statusUpload: datas.statusUpload,
          userId: 1,
        },
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to create actividade!");
    }
  }

  async deleteActividade(id: number) {
    try {
      const result = await prisma.actividade.delete({
        where: {
          idActividades: id,
        },
      });

      return { message: "Actividade deleted successfully" };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to delete Actividade");
    }
  }
  
async getActividadeById(id: number) {
  try {
    const result = await prisma.actividade.findUnique({
      where: {
        idActividades: id,
      },
      include: {
        arquivos: {
          select: {
            idArquivo: true,
            urlfile: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.error(
      "Erro original ao buscar actividade por ID:",
      error
    );

    throw error;
  }
}

  async getManyActividade() {
    try {
      const result = await prisma.actividade.findMany({
        include: {
          arquivos: {
            select: {
              urlfile: true,
              idArquivo: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw new Error("Error to get Many Actividades");
    }
  }

  async updateActividade(data: UpdateActividade) {
    const { idActividades, nomeActividade, dataActiv, ...rest } = data;

    try {
      const result = await prisma.actividade.updateMany({
        where: { idActividades },
        data: {
          ...rest,
          nomeActividade: nomeActividade,
          dataActiv: dataActiv,
        },
      });

      if (result.count === 0) {
        return null;
      }

      return result;
    } catch (error) {
      console.error("Erro ao atualizar actividade:", error);
      throw error;
    }
  }
  
}

