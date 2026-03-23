import z, { email } from "zod";
import { UserController } from "../controller/userController";
import { FastifyTypeInstance } from "types/types";
import { verifyJWT } from "util/autenticar";

export async function userRouter(app: FastifyTypeInstance) {
  const controllUser = new UserController();

  // Criar membro
  app.post(
    "/createMember",
    {
     
      schema: {
        tags: ["Members"],
        description: "Create a new user",

        body: z.object({
          nomeMembro: z.string().min(2, "Insira o 1ª e o Ultimo nome!"),
          contacto: z.number(),
          centro: z.number().min(1, "Selecione um centro valido!"),
          cargo: z.string().min(1, "Escolha um cargo existente!"),
          nivel: z.string().min(1, "O nivel selecionado está incorrecto!"),
          promessado: z.string().max(3)
        }),

        response: {
          201: z.object({
            idMejista: z.number(),
            nomeMembro: z.string(),
            email: z.string().nullable(),
            senha: z.string().nullable(),
            numeroMembro: z.string(),
            contacto: z.number(),
            cargo: z.string(),
            centroId: z.number(),
            nivel: z.string(),
            role: z.string(),
          }),

          404: z.object({
            message: z.string(),
          }),

          500: z.object({
            message: z.string(),
          }),
        },
      },
    },

    async (req, res) => controllUser.createUser(req, res),
  );
 
  // Atualizar membro
  app.put(
    "/updateMember",
    {
      preHandler: verifyJWT,
      schema: {
        description: "Atualizar membro",
        tags: ["Members"],
        body: z.object({
          idMejista: z.number().min(1, "Id do mejista invalido"),
          nomeMembro: z.string().min(2, "Insira o 1ª e o Ultimo nome!").optional(),
          contacto: z.number().min(9, "Quantidade de números invalidos! ").optional(),
          centro: z.number().min(1, "Selecione um centro valido!").optional(),
          cargo: z.string().min(1, "Escolha um cargo existente!").optional(),
          nivel: z.string().min(1, "O nivel selecionado está incorrecto!").optional(),
        }),
        response: {
          200: z.object({
            idMejista: z.number(),
            nomeMembro: z.string(),
            email: z.null(),
            senha: z.null(),
            numeroMembro: z.string(),
            contacto: z.number(),
            cargo: z.string(),
            centroId: z.number(),
            nivel: z.string(),
            role: z.string(),
          }),
        },
      },
    },
    async (req, res) => controllUser.updateUser(req, res),
  );

  // Buscar membro por ID
  app.get(
    "/findByID/:idMejista",
    {
      preHandler: verifyJWT,
      schema: {
        description: "Buscar membro por Id",
        tags: ["Members"],
        params: z.object({
          idMejista: z.coerce.number().min(1, "Selecione uma paroquia valida!"),
        }),
        response: {
          200: z.object({
            idMejista: z.number(),
            nomeMembro: z.string(),
            email: z.string().nullable(),
            senha: z.string().nullable(),
            nivel: z.string(),
            role: z.string(),
            cargo: z.string(),
            numeroMembro: z.string(),
            contacto: z.number(),
            centroId: z.number(),
            centro: z.object({
              idCentrosParoquias: z.number(),
              nomeCentro: z.string(),
              quota: z.number(),
              paroquiaId: z.number(),
              paroquia: z.object({
                idParoquia: z.number(),
                nomeParoquia: z.string(),
              }),
            }),
          }),
        },
      },
    },
    async (req, res) => controllUser.getById(req, res),
  );
  
  // Buscar todos os membros
  app.get(
    "/findMany",
    {
      preHandler: verifyJWT,
      schema: {
        description: "Listar todos os membros",
        tags: ["Members"],
        response: {
          200: z.array(
            z.object({
              idMejista: z.number(),
              nomeMembro: z.string(),
              email: z.string().nullable(),
              senha: z.string().nullable(),
              nivel: z.string(),
              role: z.string(),
              cargo: z.string(),
              numeroMembro: z.string(),
              contacto: z.number(),
              centroId: z.number(),

              centro: z.object({
                idCentrosParoquias: z.number(),
                nomeCentro: z.string(),
                quota: z.number(),
                paroquiaId: z.number(),

                paroquia: z
                  .object({
                    idParoquia: z.number(),
                    nomeParoquia: z.string(),
                  })
                  .partial(), // caso não venha todos os campos
              }),
            }),
          ),
        },
      },
    },
    async (req, res) => controllUser.getMany(req, res),
  );

  // Deletar membro
   app.delete(
     "/deleteMember",
     {
       preHandler: verifyJWT,
       schema: {
         description: "Deletar membro por Id",
         tags: ["Members"],
         body: z.object({ idMejista: z.coerce.number().min(1, "User Id invalido") }),
         response: {
           200: z.object({
             message: z.string(),
           }),
         },
       },
     },
     async (req, res) => controllUser.deleteUser(req, res),
   );

   // Login Admin
   app.post("/login",{schema:{
    description: "Login Admin",
    tags: ["Members"],
      body: z.object({
        email: z.email().min(1,"Email do administrador Invalido!"),
        senha: z.string().min(1,"Senha do Admin é necessária!")
      }),
      response:{
        200: z.object({
          message : z.string(),
        })
      }
   }},
  async(req,res) => controllUser.LoginUser(req,res)
   )

}
