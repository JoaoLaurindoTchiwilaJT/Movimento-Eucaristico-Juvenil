import { actividadeController } from "@controller/actividadeController";
import { FastifyTypeInstance } from "types/types";
import z from "zod";

const campoSchema = z.object({
  value: z.string().min(1, "Campo obrigatório"),
});

const dateSchema = z.object({
  value: z
    .string()
    .min(1, "Campo obrigatório")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Data inválida. Use o formato AAAA-MM-DD",
    })
    .transform((val) => new Date(val)),
});

const idArquivoSchema = z.object({
  value: z.preprocess(
    (valor) => {
      if (typeof valor === "string") {
        try {
          return JSON.parse(valor);
        } catch {
          const id = Number(valor);
          return Number.isFinite(id) ? id : valor;
        }
      }

      return valor;
    },
    z.union([
      z.number().int().positive(),
      z.array(z.number().int().positive()),
    ]).optional()
  ),
});


export async function actividadeRouter(app: FastifyTypeInstance) {
  const controllerActividades = new actividadeController();

  app.post(
    "/createActividade",
    {
      schema: {
        description: "Cria Uma Nova Actividade",
        tags: ["Actividades"],
        body: z.object({
          nomeActividade: campoSchema,
          localizacao: campoSchema,
          dataActiv: dateSchema,
          descricao: campoSchema,
          categoria: campoSchema,
          estado: campoSchema,
          arquivo: z.any(),
        }),
 
        response: {
          201: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              idActividades: z.number(),
              nomeActividade: z.string(),
              localizacao: z.string(),
              data: z.date(),
              descricao: z.string(),
              categoria: z.string(),
              estado: z.string(),
              fileUrls: z.array(z.string()),
            }),
          }),
        },
      },
    },

    async (req, res) => controllerActividades.createActividade(req, res),
  );

  app.get(
    "/getManyActividade",
    {
      schema: {
        description: "Buscar todas as Actividades existentes",
        tags: ["Actividades"],
        response: {
          201: z.object({
            success: z.boolean(),
            message: z.string(),
        
            data: z.object({
              idActividades: z.number(),
              nomeActividade: z.string(),
              localizacao: z.string(),
              data: z.date(),
              descricao: z.string(),
              categoria: z.string(),
              estado: z.string(),
        
              arquivos: z.array(
                z.object({
                  urlfile: z.string(),
                  idArquivo: z.number()
                })
              ),
            }),
          }),
        },
      },
    },
    async (req, res) => controllerActividades.findManyActividade(req, res),
  );

  app.get(
    "/getByIdActividade/:idActividades",
    {
      schema: {
        description: "Buscar todas as Actividades existentes",
        tags: ["Actividades"],
        params: z.object({
          idActividades: z.string().min(1, "Id da Actividade invalido digite um id valido"),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
        
            data: z.object({
              idActividades: z.number(),
              nomeActividade: z.string(),
              localizacao: z.string(),
              data: z.date(),
              descricao: z.string(),
              categoria: z.string(),
              estado: z.string(),
              arquivos: z.array(
                z.object({
                  urlfile: z.string(),
                })
              ),
            }),
          }),
        }
      },
    },
    async (req, res) => controllerActividades.findByIdActividade(req, res),
  );

  app.delete(
    "/deleteActividade/:idActividades",
    {
      schema: {
        description: "Eliminar uma Actividade existente",
        tags: ["Actividades"],

        params: z.object({
          idActividades: z.string().min(1, "Id da Actividade inválido, digite um id válido"),
        }),

        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => controllerActividades.delete(req, res),
  );
  
  app.put(
    "/UpdateActividade/:idActividades",
    {
      schema: {
        description: "Atualizar uma actividade",
        tags: ["Actividades"],
  
        params: z.object({
          idActividades: z.string().min(1, "ID da actividade inválido"),
        }),
  
        body: z.object({
          nomeActividade: campoSchema.optional(),
          localizacao: campoSchema.optional(),
          dataActiv: dateSchema.optional(),
          descricao: campoSchema.optional(),
          categoria: campoSchema.optional(),
          estado: campoSchema.optional(),
  
          // Eliminar um arquivo ou vários arquivos específicos.
          // Recebe, por exemplo, "[12,15]" através do FormData.
          idArquivo: idArquivoSchema.optional(),
    
          // Adicionar novos arquivos.
          arquivo: z.any().optional(),
        }),
   
response: {
  200: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      idActividades: z.number(),
      nomeActividade: z.string(),
      localizacao: z.string(),
      data: z.string(),
      descricao: z.string(),
      categoria: z.string(),
      estado: z.string(),
      arquivos: z.array(
        z.object({
          idArquivo: z.number(),
          urlfile: z.string(),
        }),
      ),
      fileUrls: z.array(z.string()),
    }),
  }),
},

        
      },
    },
  
    async (req, res) =>
      controllerActividades.updateActividade(req, res),
  );
  

}
