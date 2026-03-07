import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTypeCentro } from "@model/dao";
import { centrosMej } from "@repository/centrosRepository";

export class centroController {
  private centros: centrosMej;

  constructor() {
    this.centros = new centrosMej();
  }

  async createCentros(req: FastifyRequest, res: FastifyReply) {
    const data = CreateTypeCentro.parse(req.body);

    try {
      const result = await this.centros.createCentro(data);

      if (result === null) {
        return res.status(200).send("Failure to create centros if exists!");
      }

      return res.status(201).send(result);
    } catch (error) {
      return res.status(500).send("Internal error server!");
    }
  }

  async deleteCentros(req: FastifyRequest, res: FastifyReply) {
    const id = req.body;

    try {
      const result = await this.centros.deleteCentros(Number(id));

      if (result === null) {
        return res.status(400).send("Failure to delete centros not found!");
      }

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send("Internal error server!");
    }
  }

  async getCentrosById(req: FastifyRequest, res: FastifyReply) {
    const id = req.body;

    try {
      const result = await this.centros.findByIdCentros(Number(id));

      if (result === null) {
        return res.status(400).send("Failure to get centros by id !");
      }

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send("Internal error server!");
    }
  }

  async getCentrosMany(req: FastifyRequest, res: FastifyReply) {


    try {
      const result = await this.centros.findManyCentros();

      if (result === null) {
        return res.status(400).send("Failure to get centros !");
      }

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send("Internal error server!");
    }
  }

}
