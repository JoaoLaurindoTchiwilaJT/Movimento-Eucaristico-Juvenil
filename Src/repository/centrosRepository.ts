import { CreateCentro } from "@model/dao";
import { prisma } from "database/prisma";

export class centrosMej{

    async createCentro(datas:CreateCentro){
        try {
            const result = await prisma.centrosParoquias.create({
                data:{
                    nomeCentro: datas.nomeCentro,
                    qtdMembros: datas.qtdMembros,
                    paroquiaId: datas.paroquia,
                    coordenador: datas.coordenador 
                }
            });

            return result;
        } catch (error) {
            throw new Error("Error to create centro!");
        }
    }

    async updateCentros(){}

    async findByIdCentros(id:number){
        try {
            const result = await prisma.centrosParoquias.findUnique({where:{idCentrosParoquias:id}});

            return result;
        } catch (error) {
            throw new Error("Error to find by id Centros.");
        }
    }

    async findManyCentros(){
        try {
            const result = await prisma.centrosParoquias.findMany();

            return result;
        } catch (error) {
            throw new Error("Error to find many Centros");
        }
    }

    async deleteCentros(id:number){
        try {
            const result = await prisma.centrosParoquias.delete({where:{idCentrosParoquias:id}});

            return result;
        } catch (error) {
            throw new Error("Error to delete centro whith id " + id)
        }
    }
}
