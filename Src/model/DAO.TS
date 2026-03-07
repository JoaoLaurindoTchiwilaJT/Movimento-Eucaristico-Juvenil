import { z } from "zod";

export const CreateTypeAdmin = z.object({
  email: z.string().email("Deve ser um email valido e conter @"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export type CreateAdmin = z.infer<typeof CreateTypeAdmin>;

export const CreateTypeMember = z.object({
  nomeMembro: z.string().min(2, "Insira o 1ª e o Ultimo nome!"),
  numeroMembro: z.string().min(9, "Número de membro gerado de forma incorrecta! ").optional(),
  paroquia: z.string().min(1, "Selecione uma paroquia valida!"),
  contacto: z.coerce.number().min(9, "Quantidade de números invalidos! "),
  centro: z.string().min(1, "Selecione um centro valido!"),
  cargo: z.string().min(1, "Escolha um cargo existente!"),
  nivel: z.string().min(1, "O nivel selecionado está incorrecto!"),
});

export type CreateMember = z.infer<typeof CreateTypeMember>;

export const CreateTypeParoquia = z.object({
  nomeParoquia: z.string().min(1, "Paróquia invalida digite uma paróquia valida"),
  coordenador: z.string().min(1, "Id invalido para o Coordenador"),
  quota: z.string().min(1, "Valor da quota invalida"),
  qtdCentros: z.coerce.number().min(1, "Minimo valor deve ser um para cada paroquia!")
});

export type CreateParoquia = z.infer<typeof CreateTypeParoquia>;

export const CreateTypeCentro = z.object({
  nomeCentro: z.string().min(1, "Centro invalido verifique a escrita!"),
  coordenador: z.enum([
    "coordenadorParoquialCentroSede",
    "coordenadorCentral"
  ]),
  paroquia: z.coerce.number().min(1, "Id invalido para paróquia"),
  qtdMembros : z.coerce.number().min(1,"No mminimo deve conter um membro para cada centro")
});

export type CreateCentro = z.infer<typeof CreateTypeCentro>;

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