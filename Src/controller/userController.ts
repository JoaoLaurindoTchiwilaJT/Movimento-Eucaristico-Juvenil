import { JwtPayload } from "./../../node_modules/@types/jsonwebtoken/index.d";
import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTypeMember, LoginTypeUser, updateTypeMember } from "@model/dao";
import { userMej } from "@repository/userRepository";
import { Criptografia } from "util/criptografia";
import  Jwt  from "jsonwebtoken";


export class UserController {

  private user: userMej;
  private criptografar : Criptografia;

  constructor() {
    this.user = new userMej();
    this.criptografar = new Criptografia();
  }

  async createUser(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
    const data = CreateTypeMember.parse(req.body);
    
    try {
      const result = await this.user.CreateUser(data);
      console.log(result);
      if (result) {
        return res.status(201).send(result);
      } else {
        return res.status(404).send({
          message: "Id do centro não encontrado",
        });
      }
    } catch (error) {
      console.error(error);

      return res.status(500).send({
        message: "Internal server error" + error,
      });
    }
  }

  async updateUser(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
    const data = updateTypeMember.parse(req.body);

    try {
      const result = await this.user.UpdateUser(data);

      if (result) {
        return res.status(200).send(result);
      }

      return res.status(404).send("User Not Found!");
    } catch (error) {
      return res.status(500).send("Internal server Error !" + error);
    }
  }

  async deleteUser(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
    const id = Number((req.body as any).idMejista);

    try {
      const result = await this.user.deleteUser(Number(id));

      if (!result) {
        return res.status(404).send("User not found");
      }

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send("Internal server Error !" + error);
    }
  }

  async getById(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
    const idMejista = Number((req.params as any).idMejista);

    try {
      const result = await this.user.findByIdUser(Number(idMejista));

      if (result) {
        return res.status(200).send(result);
      }

      return res.status(404).send("User Not Found!");
    } catch (error) {
      return res.status(500).send("Internal server Error !" + error);
    }
  }

  async getMany(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
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

  async LoginUser(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
    
    let data = LoginTypeUser.parse(req.body);

    try {
      const result = await this.user.adminLogin(data);

      if (result) {
         

         const hash = result.senha || "não passou";

         const senha = this.criptografar.descriptografar(data.senha,hash);
         
         if (senha) {
          const token = Jwt.sign(result, data.senha, {
            expiresIn: "24h",
          });

          return res.status(200).send(token);
         }   
      }

      return res.status(200).send("Error to login Admin!");
    } catch (error) {
      return res.status(500).send("Internal server Error !" + error);
    }
  }

}