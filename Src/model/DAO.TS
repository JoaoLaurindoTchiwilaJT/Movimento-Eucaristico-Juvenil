import { email, z } from "zod";

export const CreateTypeAdmin = z.object({
  email: z.string().email("Deve ser um email valido e conter @"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export type CreateAdmin = z.infer<typeof CreateTypeAdmin>;

export const CreateTypeMember = z.object({
  idMejista : z.number().min(1,"Id invalido!").optional(),
  nomeMembro: z.string().min(2, "Insira o 1ª e o Ultimo nome!"),
  numeroMembro: z.string().min(9, "Número de membro gerado de forma incorrecta! ").optional(),
  contacto: z.coerce.number().min(9, "Quantidade de números invalidos! "),
  centro: z.coerce.number().min(1, "Selecione um centro valido!"),
  cargo: z.string().min(1, "Escolha um cargo existente!"),
  nivel: z.string().min(1, "O nivel selecionado está incorrecto!"), 
  promessado: z.string()
});

export type CreateMember = z.infer<typeof CreateTypeMember>;
 
export const updateTypeMember = z.object({
  idMejista : z.number().min(1,"Id invalido!").optional(),
  nomeMembro: z.string().min(2, "Insira o 1ª e o Ultimo nome!").optional(),
  numeroMembro: z.string().min(9, "Número de membro gerado de forma incorrecta! ").optional(),
  contacto: z.coerce.number().min(9, "Quantidade de números invalidos! ").optional(),
  centro: z.coerce.number().min(1, "Selecione um centro valido!").optional(),
  cargo: z.string().min(1, "Escolha um cargo existente!").optional(),
  nivel: z.string().min(1, "O nivel selecionado está incorrecto!").optional(),
});

export type updateMember = z.infer<typeof updateTypeMember>;

export const CreateTypeParoquia = z.object({
  nomeParoquia: z.string().min(1, "Paróquia invalida digite uma paróquia valida"),
  quota: z.number().min(1, "Valor da quota invalida"),
});

export type CreateParoquia = z.infer<typeof CreateTypeParoquia>;

export const updateTypeParoquia = z.object({
  idParoquia : z.number().min(1,"Id da paróquia invalido"),
  nomeParoquia: z.string().min(1, "Paróquia invalida digite uma paróquia valida").optional(),
  quota: z.number().min(1, "Valor da quota invalida").optional(),
});

export type updateParoquia = z.infer<typeof updateTypeParoquia>;

export const CreateTypeCentro = z.object({
  nomeCentro: z.string().min(1, "Centro invalido verifique a escrita!"),
  paroquia: z.coerce.number().min(1, "Id invalido para paróquia"),
});

export type CreateCentro = z.infer<typeof CreateTypeCentro>;


export const updateTypeCentro = z.object({
  idCentrosParoquias: z.number().min(1, "Id do centro é necessário").optional(),
  nomeCentro: z.string().min(1, "Centro invalido verifique a escrita!"),
  quota: z.number().min(1, "Valor da quota invalida"),
});

export type updateCentro = z.infer<typeof updateTypeCentro>;

export const CreateTypeActividade = z.object({
  nomeActividade: z.string().min(1, "Nome da actividade deve ter pelo menos uma palavra"),
  localizacao: z.string().min(1, "Localização invalida"),
  descricao: z.string().min(1, "Descrição invalida!"),
  dataRealizar: z.coerce.date().refine(
    (date:any) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    {
      message: "A data não pode ser anterior a hoje",
    },
  ),
});

export type CreateActividade = z.infer<typeof CreateTypeActividade>;

export const LoginTypeUser = z.object({
  email: z.email().min(1,"Email inserido invalido!"),
  senha: z.string().min(1,"Senha invalida!")
});

export type LoginUser = z.infer<typeof LoginTypeUser>;