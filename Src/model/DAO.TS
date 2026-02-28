import { z } from "zod";

export const CreateTypeAdmin = z.object({
  email: z.string().email("Deve ser um email valido e conter @"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export const CreateTypeMember = z.object({
  nomeMembro: z.string().min(2, "Insira o 1ª e o Ultimo nome!"),
  paroquia: z.string().min(1, "Selecione uma paroquia valida!"),
  centro: z.string().min(1, "Selecione um centro valido!"),
  cargo: z.string().min(1, "Escolha um cargo existente!"),
});

export const CreateParoquia = z.object({
  nomeParoquia: z.string().min(1, "Paróquia invalida digite uma paróquia valida"),
  coordenador: z.string().min(1, "Id invalido para o Coordenador"),
  quota: z.string().min(1, "Valor da quota invalida"),
});

export const CreateCentro = z.object({
  nomeCentro: z.string().min(1, "Centro invalido verifique a escrita!"),
  coordenador: z.string().min(1, "Id do coordenador do centro invalido"),
  paroquia: z.coerce.number().min(1, "Id invalido para paróquia"),
});

export const CreateActividade = z.object({
  nomeActividade: z.string().min(1, "Nome da actividade deve ter pelo menos uma palavra"),
  localizacao: z.string().min(1, "Localização invalida"),
  descricao: z.string().min(1, "Descrição invalida!"),
  dataRealizar: z.coerce.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    {
      message: "A data não pode ser anterior a hoje",
    },
  ),
});
