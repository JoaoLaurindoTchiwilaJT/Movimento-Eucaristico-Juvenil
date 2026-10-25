import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTypeCentro, updateTypeCentro } from "@model/dao";
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
        return res.status(200).send("Failure to create centro if exists !");
      } else if ((result as any).message === "Id da paróquia invalido") {
        return res.status(404).send("Id da paróquia invalido!");
      }

      return res.status(201).send(result);
    } catch (error) {
      console.error(error)
      return res.status(500).send("Internal error server!");
    }
  }

  async updateCentros(req: FastifyRequest, res: FastifyReply) {
    const data = updateTypeCentro.parse(req.body);

    try {
      const result = await this.centros.updateCentro(data);

      if (result === null) {
        return res.status(400).send("Failure to update centro if not exists!");
      }

      return res.status(201).send(result);
    } catch (error) {
      return res.status(500).send("Internal error server!" + error);
    }
  }

  async deleteCentros(req: FastifyRequest, res: FastifyReply) {
    const id = Number((req.body as any).idCentrosParoquias);

    try {
      const result = await this.centros.deleteCentros(id);

      if (!result) {
        return res.status(404).send({
          success: false,
          message: "Centro não encontrado",
        });
      }

      return res.status(200).send({
        success: true,
        message: "Centro eliminado com sucesso",
      });
    } catch (error: any) {
      // trata erro de centro sede
      if (error.message?.includes("sede")) {
        return res.status(400).send({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).send({
        success: false,
        message: "Erro interno no servidor",
      });
    }
  }
  
  async getCentrosById(req: FastifyRequest, res: FastifyReply) {
    const id = Number((req.params as any).idCentrosParoquias);

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
