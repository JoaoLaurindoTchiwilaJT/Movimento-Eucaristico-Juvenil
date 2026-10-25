import { gerarCodigo } from "util/generateNumberMembro";
import { prisma } from "../database/prisma";
import { CreateMember, type LoginUser, type updateMember } from "@model/dao";
import { Prisma } from "generated/prisma/client";

export class userMej {
  async CreateUser(datas: CreateMember) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const centro = await tx.centrosparoquias.findUnique({
          where: {
            idCentrosParoquias: datas.centroId,
          },
          include: {
            paroquias: true,
          },
        });

        if (!centro) {
          throw new Error("Centro não encontrado");
        }

        const membro = await tx.user.create({
          data: {
            nomeMembro: datas.nomeMembro,
            numeroMembro: "TEMP",
            contacto: datas.contacto,
            nivel: datas.nivel,
            cargo: datas.cargo ?? "Membro",
            centroId: datas.centroId,
            promessado: datas.promessado as any,
            role: "User",
          },
        });

        const codigo = gerarCodigo(membro.idMejista, centro.paroquias.nomeParoquia);

        const membroAtualizado = await tx.user.update({
          where: {
            idMejista: membro.idMejista,
          },
          data: {
            numeroMembro: codigo,
          },
        });

        return membroAtualizado;
      });

      return result;
    } catch (error) {
      console.error(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error("Erro Prisma: " + error.code);
      }

      throw new Error("Erro ao criar membro: " + error);
    }
  }

  async UpdateUser(datas: updateMember) {
    if (!datas.idMejista) throw new Error("Id do membro é obrigatório!");

    const dataUpdate: any = {};
    if (datas.nomeMembro) dataUpdate.nomeMembro = datas.nomeMembro;
    if (datas.numeroMembro) dataUpdate.numeroMembro = datas.numeroMembro;
    if (datas.contacto) dataUpdate.contacto = datas.contacto;
    if (datas.centroId) dataUpdate.centroId = datas.centroId;
    if (datas.cargo) dataUpdate.cargo = datas.cargo;
    if (datas.nivel) dataUpdate.nivel = datas.nivel;
    if (datas.promessado) dataUpdate.promessado = datas.promessado;

    try {
      if (datas.cargo?.toLowerCase() === "coordenador") {
        // Verifica se já existe um coordenador no mesmo centro
        const antigoCoordenador = await prisma.user.findFirst({
          where: {
            centroId: datas.centroId, // centro do usuário
            cargo: "Coordenador",
            idMejista: { not: datas.idMejista }, // ignora o usuário que estamos atualizando
          },
        });

        // Se existir, rebaixa para Membro normal
        if (antigoCoordenador) {
          await prisma.user.update({
            where: { idMejista: antigoCoordenador.idMejista },
            data: { cargo: "Membro" },
          });
        }

        if (datas.centroId !== undefined) {
          dataUpdate.centroId = datas.centroId;
        }

        //se o id do centro mudar então deve-se gerar um novo numero de membro
        const verifCentId = await prisma.user.findFirst({
          where: {
            idMejista: datas.idMejista,
          },
          select: {
            centroId: true,
            centro: {
              select: {
                paroquias: true,
              },
            },
          },
        });

        if (dataUpdate.centroId === verifCentId?.centro?.paroquias.idParoquia) {
          const nomeParoquia = verifCentId?.centro?.paroquias.nomeParoquia || "";
          dataUpdate.numeroMembro = gerarCodigo(datas.idMejista, nomeParoquia);
        }

        // Agora atualiza o novo coordenador
        const result = await prisma.user.update({
          where: { idMejista: datas.idMejista! },
          data: dataUpdate,
        });

        return result;
      } else {
        // Se o cargo não for coordenador, apenas atualiza

        if (datas.centroId !== undefined) {
          dataUpdate.centroId = datas.centroId;
        }

        const result = await prisma.user.update({
          where: { idMejista: datas.idMejista! },
          data: dataUpdate,
        });

        return result;
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null; // usuário não existe
      }

      throw new Error("Error to update user Id not exist!" + error);
    }
  }

  async findByIdUser(id: number) {
    try {
      const result = await prisma.user.findUnique({
        where: {
          idMejista: id,
        },
        include: {
          centro: {
            include: {
              paroquias: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null; // usuário não existe
      }

      throw new Error("Error to find by Id user!");
    }
  }

  async findManyUsers() {
    try {
      const result = await prisma.user.findMany({
        where: { role: "User" },
        include: {
          centro: {
            include: {
              paroquias: {
                select: {
                  nomeParoquia: true,
                },
              },
            },
          },
        },
      });

      //console.log("chegou aqui",JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null; // usuário não existe
      }
      throw new Error("Error to find many users");
    }
  }

  async deleteUser(id: number) {
    try {
      const result = await prisma.user.delete({ where: { idMejista: id } });

      return { message: "User deleted successfully" };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null; // usuário não existe
      }

      throw new Error("Error to delete user Id " + id);
    }
  }

  async adminLogin(data: LoginUser) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: data.email,
          role: "Admin",
        },
      });

      return user;
    } catch (error) {
      throw new Error("Error to login User!");
    }
  }

  async dashboard() {
    try {
      const totalUsuario = await prisma.user.count({ where: { role: "User" } });

      const totalParoquia = await prisma.paroquias.count();

      const totalCentros = await prisma.centrosparoquias.count();

      //Promessados
      const totalUsuarioPromessados = await prisma.user.count({
        where: { promessado: "Sim", role: "User" },
      });

      //Não Promessados
      const totalUsuarioNaoPromessados = await prisma.user.count({
        where: { Promessado: "Não", role: "User" },
      });

      const data = {
        totalUsuario,
        totalParoquia,
        totalCentros,
        totalUsuarioPromessados,
        totalUsuarioNaoPromessados,
      };

      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error to get data");
    }
  }
  
}
