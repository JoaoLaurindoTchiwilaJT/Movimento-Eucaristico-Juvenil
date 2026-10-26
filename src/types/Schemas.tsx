import { z } from 'zod';

export const createTypeParoquia = z.object({
  nomeParoquia: z.string().nonempty('O nome da paróquia não é valido!').min(5),
  quota: z.number().min(1500, 'Valor da Quota invalido'),
});

export type createParoquiaSchema = z.infer<typeof createTypeParoquia>;

export const createTypeCentro = z.object({
  nomeCentro: z.string().nonempty('O nome do centro é invalido!').min(5),
  idParoquia: z.number().min(1, 'Selecione uma paróquia!'),
});

export type createCentroSchema = z.infer<typeof createTypeCentro>;

export const createTypeMembro = z
  .object({
    nomeMembro: z.string().nonempty('O nome do Membro é inválido!').min(5),

    nomeParoquia: z
      .string()
      .refine((value) => value !== 'Nenhuma', {
        message: 'Selecione uma paróquia!',
      })
      .min(5),

    centroId: z.number().min(1, 'Selecione um centro!'),

    promessado: z.enum(['Sim', 'Não'], {
      message: 'Selecione uma opção!',
    }),

    email: z.string().email('E-mail inválido').optional(),

    contacto: z.number().min(9, 'Quantidade de números inválida!'),

    // Cargo opcional
    cargo: z.string().optional(),

    nivel: z.string().refine((value) => value !== 'Nenhum', {
      message: 'Selecione um nível para o membro',
    }),
  })
  .superRefine((data, ctx) => {
    // Só valida a regra do coordenador quando existe um cargo.
    if (
      data.cargo?.trim().toLowerCase() === 'coordenador' &&
      data.promessado !== 'Sim'
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Coordenador deve ser promessado!',
        path: ['promessado'],
      });
    }
  });

export type createMembroSchema = z.infer<typeof createTypeMembro>;

const TIPOS_IMAGEM = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_TAMANHO = 5 * 1024 * 1024; // 5 MB

export const createTypeActividade = z.object({
  nomeActividade: z
    .string()
    .min(5, 'O nome da actividade deve ter pelo menos 5 caracteres'),
  localizacao: z
    .string()
    .min(5, 'A localização deve ter pelo menos 5 caracteres'),
  descricao: z
    .string()
    .min(5, 'A descrição deve ter pelo menos 5 caracteres'),
  dataActiv: z.string().min(1, 'Data é obrigatória'),
  categoria: z.string().min(1, 'Escolha uma categoria'),
  estado: z.string().min(1, 'Seleccione um estado'),

  // Lista de imagens: File = nova imagem; string = URL já existente (modo edição)
  arquivo: z
    .array(
      z.union([
        z
          .file()
          .mime(TIPOS_IMAGEM, 'A imagem deve ser PNG, JPEG ou WebP')
          .max(MAX_TAMANHO, 'A imagem não pode exceder 5MB'),
        z.string().min(1),
      ]),
    )
    .min(1, 'Seleccione pelo menos uma imagem')
    .max(10, 'Pode enviar no máximo 10 imagens'),
});


export type createActividade = z.infer<typeof createTypeActividade>;

export const updateTypeActividade = z.object({
  nomeActividade: z
    .string()
    .min(5, 'O nome da actividade deve ter pelo menos 5 caracteres'),
  localizacao: z
    .string()
    .min(5, 'A localização deve ter pelo menos 5 caracteres'),
  descricao: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),
  dataActiv: z.string().min(1, 'Data é obrigatória'),
  categoria: z.string().min(1, 'Escolha uma categoria'),
  estado: z.string().min(1, 'Seleccione um estado'),
  idArquivo: z.number().min(2, 'Id do arquivo invalido').optional(),
  idActividades: z.number().min(2, 'Id do arquivo invalido').optional(),
  // Lista de imagens: File = nova imagem; string = URL já existente (modo edição)
  arquivo: z
    .array(
      z.union([
        z
          .file()
          .mime(TIPOS_IMAGEM, 'A imagem deve ser PNG, JPEG ou WebP')
          .max(MAX_TAMANHO, 'A imagem não pode exceder 5MB'),
        z.string().min(1),
      ]),
    )
    .max(10, 'Pode enviar no máximo 10 imagens')
    .optional(),
});

export type updateActividade = z.infer<typeof updateTypeActividade>;

export const LoginUserSchema = z.object({
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail invalido!')
    .toLowerCase(),
  password: z.string().min(6, 'Password invalida!'),
});

export type LoginUserSchemas = z.infer<typeof LoginUserSchema>;
