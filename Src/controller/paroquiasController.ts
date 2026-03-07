import { FastifyReply, FastifyRequest } from "fastify";
import { paroquiasMej } from "@repository/paroquiaRepository";
import { CreateTypeParoquia } from "@model/dao";

export class paroquiasController {
  private paroquias: paroquiasMej;

  constructor() {
    this.paroquias = new paroquiasMej();
  }

  async createParoquias(req: FastifyRequest, res: FastifyReply) {
    const data = CreateTypeParoquia.parse(req.body);

    try {
      const result = await this.paroquias.createParoquias(data);

      if (result === null) {
        return res.status(200).send("Failure to create paroquia if exists!");
      }

      return res.status(201).send(result);
    } catch (error) {
      return res.status(500).send("Internal error server!");
    }
  }

  async deleteParoquia(req: FastifyRequest, res: FastifyReply) {
    const id = req.body;

    try {
      const result = await this.paroquias.deleteParoquias(Number(id));

      if (result === null) {
        return res.status(400).send("Failure to delete paroquia not found!");
      }

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send("Internal error server!");
    }
  }

  async getParoquiaById(req: FastifyRequest, res: FastifyReply) {
    const id = req.body;

    try {
      const result = await this.paroquias.findByIdParoquias(Number(id));

      if (result === null) {
        return res.status(400).send("Failure to get paroquia by id !");
      }

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send("Internal error server!");
    }
  }

  async getParoquiaMany(req: FastifyRequest, res: FastifyReply) {


    try {
      const result = await this.paroquias.findManyParoquias();

      if (result === null) {
        return res.status(400).send("Failure to get paroquia !");
      }

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send("Internal error server!");
    }
  }

}
