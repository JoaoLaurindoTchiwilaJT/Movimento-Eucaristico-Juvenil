import { localArqu, TipoArqui, TipoStatus } from "generated/prisma/enums";
import { email, z } from "zod";

export const CreateTypeAdmin = z.object({
  email: z.string().email("Deve ser um email valido e conter @"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export type CreateAdmin = z.infer<typeof CreateTypeAdmin>;

export const CreateTypeMember = z.object({
  nomeMembro: z.string().min(2, "Insira o 1ª e o Ultimo nome!"),
  numeroMembro: z.string().min(9, "Número de membro gerado de forma incorrecta! ").optional(),
  contacto: z.coerce.number().min(9, "Quantidade de números invalidos! "),
  centroId: z.coerce.number().min(1, "Selecione um centro valido!").optional(),
  cargo: z.string().min(1, "Escolha um cargo existente!"),
  nivel: z.string().min(1, "O nivel selecionado está incorrecto!"),
  promessado: z.string(),
});

export type CreateMember = z.infer<typeof CreateTypeMember>;

export const updateTypeMember = z.object({
  idMejista: z.number().min(1, "Id invalido!").optional(),
  nomeMembro: z.string().min(2, "Insira o 1ª e o Ultimo nome!").optional(),
  numeroMembro: z.string().min(9, "Número de membro gerado de forma incorrecta! ").optional(),
  contacto: z.coerce.number().min(9, "Quantidade de números invalidos! ").optional(),
  centroId: z.coerce.number().min(1, "Selecione um centro valido!").optional(),
  cargo: z.string().min(1, "Escolha um cargo existente!").optional(),
  nivel: z.string().min(1, "O nivel selecionado está incorrecto!").optional(),
  promessado: z.enum(["Sim", "Não"], {
    message: "Selecione uma opção!",
  }),
});

export type updateMember = z.infer<typeof updateTypeMember>;

export const CreateTypeParoquia = z.object({
  nomeParoquia: z.string().min(1, "Paróquia invalida digite uma paróquia valida"),
  quota: z.number().min(1, "Valor da quota invalida"),
});

export type CreateParoquia = z.infer<typeof CreateTypeParoquia>;

export const updateTypeParoquia = z.object({
  idParoquia: z.number().min(1, "Id da paróquia invalido"),
  nomeParoquia: z.string().min(1, "Paróquia invalida digite uma paróquia valida").optional(),
  quota: z.number().min(1, "Valor da quota invalida").optional(),
});

export type updateParoquia = z.infer<typeof updateTypeParoquia>;

export const CreateTypeCentro = z.object({
  nomeCentro: z.string().min(1, "Centro invalido verifique a escrita!"),
  idParoquia: z.coerce.number().min(1, "Id invalido para paróquia"),
});

export type CreateCentro = z.infer<typeof CreateTypeCentro>;

export const updateTypeCentro = z.object({
  idCentrosParoquias: z.number().min(1, "Id do centro é necessário").optional(),
  nomeCentro: z.string().min(1, "Centro invalido verifique a escrita!"),
  nomeParoquia: z.string().min(1, "Paróquia invalida digite uma paróquia valida").optional(),
});

export type updateCentro = z.infer<typeof updateTypeCentro>;

export const CreateTypeActividade = z.object({
  nomeActividade: z.string().min(1, "Nome da actividade deve ter pelo menos uma palavra"),
  localizacao: z.string().min(1, "Localização invalida"),
  descricao: z.string().min(1, "Descrição invalida!"),
  categoria: z.enum(["Espiritualidade", "Missao", "Acampamento", "Formacao"]),
  estado: z.enum(["Aberta", "Encerrada"]),
  dataActiv: z.coerce.date().refine(
    (date: any) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    {
      message: "A data não pode ser anterior a hoje",
    },
  ),
  statusUpload: z.nativeEnum(TipoStatus),
});

export type CreateActividade = z.infer<typeof CreateTypeActividade>;

export const UpdateTypeActividade = z.object({
  idActividades: z.coerce.number().min(1, "Id invalido para paróquia"),
  nomeActividade: z
    .string()
    .min(1, "Nome da actividade deve ter pelo menos uma palavra")
    .optional(),
  localizacao: z.string().min(1, "Localização invalida").optional(),
  descricao: z.string().min(1, "Descrição invalida!").optional(),
  categoria: z.enum(["Espiritualidade", "Missao", "Acampamento", "Formacao"]).optional(),
  estado: z.enum(["Aberta", "Encerrada"]).optional(),
  dataActiv: z.coerce
    .date()
    .refine(
      (date: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: "A data não pode ser anterior a hoje",
      },
    )
    .optional(),
  statusUpload: z.nativeEnum(TipoStatus).optional(),
});

export type UpdateActividade = z.infer<typeof UpdateTypeActividade>;

const imagemSchema = z.object({
  filename: z.string().min(1, "O nome da imagem é obrigatório"),
  mimetype: z.enum(["image/jpeg", "image/png", "image/webp"], {
    message: "A imagem deve ser JPEG, PNG ou WebP",
  }),
  file: z.any(),
});

export const imagensSchema = z
  .array(imagemSchema)
  .min(1, "Envie pelo menos uma imagem")
  .max(5, "Máximo de 5 imagens");

export type TypeSchema = z.infer<typeof imagensSchema>;

export const fileSchema = z.object({
  idImagem: z.number().optional(),
  filename: z.string().min(1, "File name invalido"),
  urlfile: z.string().min(1, "File name invalido"),
  dataFile: z.coerce.date().default(() => new Date()),
});

export const LoginTypeUser = z.object({
  email: z.email().min(1, "Email inserido invalido!"),
  password: z.string().min(1, "Senha invalida!"),
});

export type LoginUser = z.infer<typeof LoginTypeUser>;

export const arquivoType = z.object({
  idArquivo: z.number().min(1, "O id é necessário").optional(),
  filename: z.string().min(25, "O nome do ficheiro é invalido"),
  urlfile: z.string().min(20, "Url do ficheiro invalida"),
  dataFile: z.coerce.date().default(() => new Date()),
  local: z.nativeEnum(localArqu),
  tipoArqui: z.nativeEnum(TipoArqui),
  userId: z.number().optional(),
  actividadeId: z.number().optional(),
});

export type arquivoSchema = z.infer<typeof arquivoType>;




