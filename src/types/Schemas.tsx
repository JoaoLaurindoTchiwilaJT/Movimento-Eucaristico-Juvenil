import { z } from 'zod';

export const createTypeParoquia = z.object({
  nomeParoquia: z.string().nonempty('O nome da paróquia não é valido!').min(5),
  quota: z.number().min(1500, 'Valor da Quota invalido'),
});

export type createParoquiaSchema = z.infer<typeof createTypeParoquia>;

export const createTypeCentro = z.object({
  nomeCentro: z.string().nonempty('O nome do centro é invalido!').min(5),
  nomeParoquia: z
    .string()
    .refine((value) => value !== 'Nenhuma', {
      message: 'Selecione uma paróquia válida!',
    })
    .min(5),
});

export type createCentroSchema = z.infer<typeof createTypeCentro>;

export const createTypeMembro = z.object({
  nomeMembro: z.string().nonempty('O nome do Membro é invalido!').min(5),
  nomeParoquia: z
    .string()
    .refine((value) => value !== 'Nenhuma', {
      message: 'Selecione uma paróquia !',
    })
    .min(5),
  nomeCentro: z
    .string()
    .refine((value) => value !== 'Nenhuma', {
      message: 'Selecione um centro !',
    })
    .min(5),
  promessado: z.enum(['sim', 'não'], {
    message: 'Selecione uma opção!',
  }),
});

export type createMembroSchema = z.infer<typeof createTypeMembro>;

export const createTypeActividade = z.object({
  nomeActividade: z
    .string()
    .nonempty('O nome da actividade é invalida!')
    .min(5),
  localizacao: z
    .string()
    .nonempty('A localização da actividade é invalida!')
    .min(5),
  descricao: z
    .string()
    .nonempty('A descrição da actividade é invalido!')
    .min(5),
  dataActiv: z.string().min(1,"Data é obrigatória"),
});

export type createActividade = z.infer<typeof createTypeActividade>;

export const LoginUserSchema = z.object({
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail invalido!')
    .toLowerCase(),
  password: z.string().min(6, 'Password invalida!'),
});

export type LoginUserSchemas = z.infer<typeof LoginUserSchema>;
