import { prisma } from "../database/prisma";
import {CreateMember} from "@model/dao"

export class userMej {
  async CreateUser(datas: CreateMember) {
  
    try {
      const result = await prisma.user.create({
        data: {
          nomeMembro: datas.nomeMembro,
          numeroMembro: datas.numeroMembro || "Invalido",
          contacto: datas.contacto,
          nivel: datas.nivel,
          role: "User"
        }
      });    

    } catch (error) {
      throw new Error("Error to create User Member!" + error);
    }
  }

  async UpdateUser() {}

  async findByIdUser(id: number) {
    try {
      const result = await prisma.user.findUnique({where:{idMejista:id}});

      return result;
    } catch (error) {
      throw new Error("Error to find by Id user!");
    }
  }
  async findManyUsers() {
    try {
      const result = await prisma.user.findMany({where:{role:"User"}});

      return result;
    } catch (error) {
      throw new Error("Error to find many users");
    }
  }

  async deleteUser(id: number) {
    try {
      const result = await prisma.user.delete({where:{idMejista: id}});

      return result;
    } catch (error) {
      throw new Error("Error to delete user Id " + id);
    }
  }
}
