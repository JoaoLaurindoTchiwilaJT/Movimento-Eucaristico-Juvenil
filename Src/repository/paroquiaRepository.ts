import type { CreateParoquia, updateParoquia } from "@model/dao";
import { prisma } from "database/prisma";
import { Prisma } from "generated/prisma/client";

export class paroquiasMej {
    
    async createParoquias(datas:CreateParoquia){
        try {
            const result = await prisma.paroquias.create({
                data:{
                    nomeParoquia: datas.nomeParoquia
                }
            });

            return result;
        } catch (error) {
            throw new Error("Error to create Paroquia!");
        }
    } 

    async updateParoquias(datas:updateParoquia){
        try {
            if (!datas.idParoquia) throw new Error("Id da paróquia é obrigatório!");
            const result = await prisma.paroquias.update({
              where: {
                idParoquia: datas.idParoquia,
              },
              data: {
                nomeParoquia: datas.nomeParoquia,
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

    async findByIdParoquias(id:number){
        try {
            const result = await prisma.paroquias.findUnique({where:{idParoquia:id}});

            return result;
        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
              return null;
            }

            throw new Error("Error to find by id Paroquias.");
        }
    }

    async findManyParoquias(){
        try {
            const result = await prisma.paroquias.findMany();

            return result;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
              return null;
            }

            throw new Error("Error to find many paroquias");
        }
    }

    async deleteParoquias(id:number){
        try {
            const result = await prisma.paroquias.delete({where:{idParoquia:id}});
            return { message: "Paroquia deleted successfully" };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
              return null;
            }

            throw new Error("Error to delete paroquia whith id " + id)
        }
    }

}