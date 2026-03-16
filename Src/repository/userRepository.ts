import { gerarCodigo } from "util/generateNumberMembro";
import { prisma } from "../database/prisma";
import {CreateMember, type LoginUser, type updateMember} from "@model/dao"
import { Prisma } from "generated/prisma/client";

export class userMej {
  
  async CreateUser(datas: CreateMember) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // verificar se centro existe
        const centro = await tx.centrosParoquias.findUnique({
          where: {
            idCentrosParoquias: datas.centro,
          },
          include: {
            paroquia: true,
          },
        });

        if (centro === null) {
          return  null;
        }

        // criar membro
        const membro = await tx.user.create({
          data: {
            nomeMembro: datas.nomeMembro,
            numeroMembro: "TEMP",
            contacto: datas.contacto,
            nivel: datas.nivel,
            cargo: datas.cargo ?? "Membro",
            centroId: datas.centro,
            role: "User",
          },
        });

        // 3gerar código
        const codigo = gerarCodigo(membro.idMejista, centro.paroquia.nomeParoquia);

        // atualizar código
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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null; // usuário não existe
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
    if (datas.centro) dataUpdate.centroId = datas.centro;
    if (datas.cargo) dataUpdate.cargo = datas.cargo;
    if (datas.nivel) dataUpdate.nivel = datas.nivel;

    try {
      if (datas.cargo?.toLowerCase() === "coordenador") {
        // Verifica se já existe um coordenador no mesmo centro
        const antigoCoordenador = await prisma.user.findFirst({
          where: {
            centroId: datas.centro, // centro do usuário
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

        // Agora atualiza o novo coordenador
        const result = await prisma.user.update({
          where: { idMejista: datas.idMejista! },
          data: dataUpdate,
        });

        return result;
      } else {
        // Se o cargo não for coordenador, apenas atualiza
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

      throw new Error("Error to update user Id not exist!");
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
              paroquia: true,
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
              paroquia: true,
            },
          },
        },
      });

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

  async adminLogin(data: LoginUser){
    
    try {
       const user = await prisma.user.findFirst({
        where:{
          email: data.email,
          role: "Admin"
        },
       });
       
       return user;
    } catch (error) {
      throw new Error("Error to login User!");
    }
  }
}
