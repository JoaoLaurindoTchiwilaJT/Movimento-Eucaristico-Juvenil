import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTypeMember } from "@model/dao";
import { userMej } from "@repository/userRepository";

export class UserController {
    private user : userMej;

   constructor(){
    this.user = new userMej();
   }

    async createUser(req:FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        const data = CreateTypeMember.parse(req.body);

    try {
        
        const result = await this.user.CreateUser(data);

        if (result !== null) {
            
        return res.status(201).send(result);
        }
        return res.status(200).send("Failed to create user request negada!");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server Error !" + error);
    }
    }

    async updateUser(){

    }

    async deleteUser(req:FastifyRequest,res:FastifyReply):Promise<FastifyReply>{
        const id = req.body;

        try {
            const result = await this.user.deleteUser(Number(id));

            if (result === null) {
                return res.status(404).send("User not found");
            }

            return res.status(200).send(result);
        } catch (error) {
            return res.status(500).send("Internal server Error !" + error);
        }
    }

    async getById(req:FastifyRequest,res:FastifyReply): Promise<FastifyReply>{
        const id = req.body;
        try {
            const result = await this.user.findByIdUser(Number(id));
            
            if (result === null ) {
                return res.status(200).send(result);
            }

            return res.status(404).send("Usr Not Found!");
        } catch (error) {
            return res.status(500).send("Internal server Error !" + error);
        }
    }

    async getMany(req:FastifyRequest,res:FastifyReply):Promise<FastifyReply>{
        try {
            const result = await this.user.findManyUsers();

            if (result === null) {
                return res.status(404).send("Not found users");
            }

            return res.status(200).send(result);
        } catch (error) {
            return res.status(500).send("Internal server Error !" + error);
        }
    }
}