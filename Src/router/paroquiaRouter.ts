import { FastifyInstance } from "fastify";
import { paroquiasController } from "@controller/paroquiasController";
import { z } from "zod";
import { verifyJWT } from "util/autenticar";


export async function paroquiasRouter(app: FastifyInstance) {
  const controllParoquia = new paroquiasController();

//   // Criar paróquia
  app.post(
    "/createParoquia",
    {
    
      schema: {
        description: "Criar uma nova paróquia",
        tags: ["Paroquias"], 
        body: z.object({
          nomeParoquia: z.string().min(1, "Paróquia invalida digite uma paróquia valida"),
          quota: z.coerce.number().min(1, "Valor da quota invalido"),
        }),
        response: {
          201: z.object({
            idParoquia: z.number(),
            nomeParoquia: z.string(),
            quota: z.number()
          }),
        },
      }, 
    },
    async (req, res) => controllParoquia.createParoquias(req, res),
  );

    // Atualizar paróquia
  app.put(
      "/updateParoquia",
      {
        schema: {
          description: "Atualizar uma paróquia existente",
          tags: ["Paroquias"],
          body: z.object({
            idParoquia: z.number().min(1,"O id da paróquia é necessário"),
            nomeParoquia: z.string().min(1,"O nome para ser actualizado é necessário").optional(),
            quota: z.coerce.number().min(1, "Valor da quota invalido").optional(),
          }),
          response: {
            200: z.object({
              idParoquia: z.number(),
              nomeParoquia: z.string(),
              quota : z.number()
            }),
          },
        },
      },
      async (req, res) => controllParoquia.updateParoquias(req, res),
  );
 
  // Buscar paróquia por ID
  app.get(
    "/findByID/:idParoquia",
    {
      preHandler: verifyJWT,
      schema: {
        description: "Buscar paróquia por Id",
        tags: ["Paroquias"],
        params: z.object({
          idParoquia: z.string().min(1, "Id centro invalido digite um id valido"),
        }),
        response: {
          201: z.object({
            nomeParoquia: z.string(),
            coordenador: z.string(),
            quota: z.string(),
            qtdCentros: z.coerce.number(),
          }),
        },
      },
    },
    async (req, res) => controllParoquia.getParoquiaById(req, res),
  );

//   // Buscar todas as paróquias
  app.get(
    "/findMany",
    {
      
      schema: {
        description: "Listar todas as paróquias",
        tags: ["Paroquias"],
        response: {
          201: z.object({
            nomeParoquia: z.string(),
            coordenador: z.string(),
            quota: z.string(),
            qtdCentros: z.coerce.number(),
          }),
        },
      },
    },
    async (req, res) => controllParoquia.getParoquiaMany(req, res),
  );

//   // Deletar paróquia
  app.delete(
    "/deleteParoquia",
    {
     
      schema: {
        description: "Deletar paróquia por Id",
        tags: ["Paroquias"],
        body: z.object({ idParoquia: z.coerce.number().min(1, "Paroquia Id invalido") }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => controllParoquia.deleteParoquia(req, res),
  );

}