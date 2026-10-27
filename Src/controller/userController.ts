import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTypeMember, LoginTypeUser, updateTypeMember } from "@model/dao";
import { userMej } from "@repository/userRepository";
import { Criptografia } from "util/criptografia";
import Jwt from "jsonwebtoken";

export class UserController {
  private user: userMej;
  private criptografar: Criptografia;

  constructor() {
    this.user = new userMej();
    this.criptografar = new Criptografia();
  }

  async createUser(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
    const data = CreateTypeMember.parse(req.body);

    try {
      const result = await this.user.CreateUser(data);

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

      console.log(result)
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

        const password = this.criptografar.descriptografar(data.password, hash);

        if (password) {
          const token = Jwt.sign(result, data.password, {
            expiresIn: "24h",
          });

          //console.log("login realizado com sucesso");
          return res.status(200).send({ token: token, message: true });
        }
      }
      console.log("Erro ao logar");

      return res.status(401).send();
    } catch (error) {
      console.error("errou", error);
      return res.status(500).send("Internal server Error !" + error);
    }
  }

  async dashboard(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
    try {
      const result = await this.user.dashboard();

      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server Error !" + error);
    }
  }

  async updateAdmin(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
    try {
      const loca = req.params;

      const data = req
      return res.status(200).send();
    } catch (error) {
      return res.status(500).send("Internal Error Server!")
    }
  }
}
