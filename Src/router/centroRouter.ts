import { FastifyInstance } from "fastify";
import { centroController } from "@controller/centroController";
import z from "zod";
import { verifyJWT } from "util/autenticar";

export async function centrosRouter(app: FastifyInstance) {
  const controllCentros = new centroController();
 
  // Criar centro
  app.post(
    "/createCentros",
    {
      preHandler: verifyJWT,
      schema: {
        description: "Criar um novo centro",
        tags: ["Centros"],
        body: z.object({
          nomeCentro: z.string().min(1, "Centro invalido verifique a escrita!"),
          paroquia: z.coerce.number().min(1, "Id invalido para paróquia"),
          quota: z.coerce.number().min(1, "Valor da quota invalido"),
        }),
        response: {
          201: z
            .object({
              nomeCentro: z.string(),
              paroquia: z.number(),
              quota: z.number(),
            })
            .nullable(),
        },
      },
    },
    async (req, res) => controllCentros.createCentros(req, res),
  );

  // Atualizar centro
  app.put(
    "/updateCentros",
    {
      preHandler: verifyJWT,
      schema: {
        description: "Atualizar um centro existente",
        tags: ["Centros"],
        body: z.object({
          idCentrosParoquias: z.number().min(1, "Id do centro é necessário"),
          nomeCentro: z.string().min(1,"Nome do centro invalido!"),
          quota: z.number().min(1,"Valor minimo da quota é de 1500!")
        }),
        response: {
          200: z.object({
            idCentrosParoquias : z.number(),
            nomeCentro : z.string(),
            quota : z.number(),
            paroquiaId : z.number()
          })
        },
      },
    },
    async (req, res) => controllCentros.updateCentros(req, res),
  );

  // Buscar centro por ID
  app.get(
    "/findByID/:idCentrosParoquias",
    {
      preHandler: verifyJWT,
      schema: {
        description: "Buscar centro por Id",
        tags: ["Centros"],
        params: z.object({
          idCentrosParoquias: z.string().min(1, "Id centro invalido digite um id valido"),
        }),
        response: {
          200: z.object({
            idCentrosParoquias: z.number(),
            nomeCentro: z.string(),
            coordenador: z.string().optional(),
            paroquia: z.number().optional(),
            quota: z.number(),
          }),
        },
      },
    },
    async (req, res) => controllCentros.getCentrosById(req, res),
  );

  // Buscar todos os centros
  app.get(
    "/findMany",
    {
      preHandler: verifyJWT,
      schema: {
        description: "Listar todos os centros",
        tags: ["Centros"],
        response: {
          200: z.array(
            z.object({
              idCentrosParoquias: z.number(),
              nomeCentro: z.string(),
              coordenador: z.string().optional(),
              paroquia: z.number().optional(),
              qtdMembros: z.number(),
            }),
          ),
        },
      },
    },
    async (req, res) => controllCentros.getCentrosMany(req, res),
  );

  // Deletar centro
  app.delete(
    "/deleteCentros",
    {
      preHandler: verifyJWT,
      schema: {
        description: "Deletar centro por Id",
        tags: ["Centros"],
        body:  z.object({idCentrosParoquias: z.coerce.number().min(1,"User Id invalido")}),
           response: {
            200: z.object({
                 message: z.string(),
            }),
          },
      },
    },
   async (req,res) => controllCentros.deleteCentros(req,res)
  );

}