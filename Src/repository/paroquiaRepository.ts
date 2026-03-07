import type { CreateParoquia } from "@model/dao";
import { prisma } from "database/prisma";

export class paroquiasMej {
    async createParoquias(datas:CreateParoquia){
        try {
            const result = await prisma.paroquias.create({
                data:{
                    nomeParoquia: datas.nomeParoquia,
                    qtdCentros: datas.qtdCentros
                }
            });

            return result;
        } catch (error) {
            throw new Error("Error to create Paroquia!");
        }
    }

    async updateParoquias(){}

    async findByIdParoquias(id:number){
        try {
            const result = await prisma.paroquias.findUnique({where:{idParoquia:id}});

            return result;
        } catch (error) {
            throw new Error("Error to find by id Paroquias.");
        }
    }

    async findManyParoquias(){
        try {
            const result = await prisma.paroquias.findMany();

            return result;
        } catch (error) {
            throw new Error("Error to find many paroquias");
        }
    }

    async deleteParoquias(id:number){
        try {
            const result = await prisma.paroquias.delete({where:{idParoquia:id}});

            return result;
        } catch (error) {
            throw new Error("Error to delete paroquia whith id " + id)
        }
    }
}