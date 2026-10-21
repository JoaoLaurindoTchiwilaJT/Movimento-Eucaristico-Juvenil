import { imagensSchema, UpdateTypeActividade } from "@model/dao";
import { CreateTypeActividade } from "@model/dao";
import { actividade } from "@repository/actividadeRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import { localArqu, TipoArqui, TipoStatus } from "generated/prisma/enums";
import { deleteFile, fileUpload, getFileUrl, streamToBuffer } from "middleware/fileUpload";
import redis from "middleware/redis";
import { ZodError } from "zod";
import { arquivo } from "@repository/fileRepository";
import type { MultipartFile } from "@fastify/multipart";

export class actividadeController {
  private actividades: actividade;
  private arquivos: arquivo;

  constructor() {
    this.actividades = new actividade();
    this.arquivos = new arquivo();
  }

  async createActividade(req: FastifyRequest, res: FastifyReply) {
    try {
      const body = req.body as any;

      // 1. Preparar e validar os dados da actividade
      const dados = {
        idActividades: 0,
        nomeActividade: body.nomeActividade?.value,
        localizacao: body.localizacao?.value,
        descricao: body.descricao?.value,
        categoria: body.categoria?.value,
        estado: body.estado?.value,
        dataActiv: body.dataActiv?.value,
        statusUpload: TipoStatus.PROCESSANDO as TipoStatus,
      };

      const data = CreateTypeActividade.parse(dados);

      // 2. Validar os ficheiros recebidos
      if (!body.arquivo) {
        return res.status(400).send({
          success: false,
          message: "Seleccione pelo menos uma imagem para a actividade.",
        });
      }

      const partes: MultipartFile[] = Array.isArray(body.arquivo) ? body.arquivo : [body.arquivo];

      if (partes.length === 0) {
        return res.status(400).send({
          success: false,
          message: "Nenhuma imagem foi recebida.",
        });
      }

      const imagens = imagensSchema.parse(partes);

      // 3. Criar a actividade na base de dados
      console.log("A criar actividade...");

      const result = await this.actividades.createActividade(data);

      if (!result) {
        throw new Error("Não foi possível criar a actividade na base de dados.");
      }

      const urls: string[] = [];

      // 4. Fazer upload das imagens para o Supabase
      for (let i = 0; i < partes.length; i++) {
        const imagem = imagens[i];
        const parte = partes[i];

        if (parte.file.truncated) {
          return res.status(413).send({
            success: false,
            message: `O ficheiro ${imagem.filename} excede o tamanho máximo permitido.`,
          });
        }

        console.log(`A processar imagem ${i + 1}/${partes.length}...`);

        const buffer = await parte.toBuffer();

        if (buffer.length === 0) {
          throw new Error(`O ficheiro ${imagem.filename} chegou vazio.`);
        }

        const uploadResult = await fileUpload(
          "actividades",
          result.idActividades,
          "imagens",
          imagem.filename,
          buffer,
          imagem.mimetype,
        );

        if (!uploadResult?.path) {
          throw new Error(`Não foi possível carregar a imagem ${imagem.filename} para o Supabase.`);
        }

        // 5. Registar o ficheiro na base de dados
        await this.arquivos.CreateFile({
          filename: imagem.filename,
          urlfile: uploadResult.path,
          dataFile: new Date(),
          local: localArqu.ACTIVIDADE,
          tipoArqui: TipoArqui.ACTIVIDADE,
          actividadeId: result.idActividades,
        });

        // 6. Obter o URL da imagem
        const link = await getFileUrl(uploadResult.path);

        urls.push(link);
      }

      // 7. Actualizar o estado do upload
      const dadosActualizados = {
        ...dados,
        idActividades: result.idActividades,
        statusUpload: TipoStatus.CONCLUIDO as TipoStatus,
      };

      await this.actividades.updateActividade(dadosActualizados);

      // 8. Consultar a actividade criada
      const actividade = await this.actividades.getActividadeById(result.idActividades);

      if (!actividade) {
        throw new Error("A actividade foi criada, mas não foi possível carregá-la.");
      }

      // 9. Preparar a resposta
      const responseData = {
        idActividades: actividade.idActividades,
        nomeActividade: actividade.nomeActividade,
        localizacao: actividade.localizacao,
        data: actividade.dataActiv,
        descricao: actividade.descricao,
        categoria: actividade.categoria,
        estado: actividade.estado,
        fileUrls: urls,
      };

      // 10. Guardar na cache Redis sem comprometer a resposta principal
      try {
        await redis.set(
          `actividade:${result.idActividades}`,
          JSON.stringify(responseData),
          "EX",
          3600,
        );

        console.log("Actividade guardada na cache Redis.");
      } catch (redisError) {
        console.error("Erro ao guardar a actividade na cache Redis:", redisError);
      }

      console.log("Actividade criada com sucesso:", responseData);

      // 11. Responder ao frontend
      return res.status(201).send({
        success: true,
        message: "Actividade criada com sucesso.",
        data: responseData,
      });
    } catch (error) {
      console.error("Erro no método createActividade:", error);

      if (error instanceof ZodError) {
        return res.status(422).send({
          success: false,
          message: "Erro de validação.",
          errors: error.flatten(),
        });
      }

      return res.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    try {
      const id = Number((req.params as any).idActividades);

      const result = await this.actividades.getActividadeById(id);

      if (!result) {
        return res.status(404).send({
          success: false,
          message: "Actividade não encontrada.",
        });
      }

      // Eliminar os arquivos do Supabase
      await Promise.all(
        result.arquivos.map(async (arquivo) => {
          await deleteFile(arquivo.urlfile);
        }),
      );

      // Eliminar a actividade e os registros dos arquivos no banco
      const result1 = await this.actividades.deleteActividade(id);

      if (!result1) {
        return res.status(404).send({
          success: false,
          message: "Actividade não encontrada.",
        });
      }

      return res.status(200).send({
        success: true,
        message: "Actividade eliminada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao eliminar actividade:", error);

      return res.status(500).send({
        success: false,
        message: "Internal Server Error.",
      });
    }
  }

  async findManyActividade(req: FastifyRequest, res: FastifyReply) {
    try {
      const result = await this.actividades.getManyActividade();
      let resultado;

      if (result) {
        resultado = await Promise.all(
          result.map(async (data) => {
            const arquivos = await Promise.all(
              data.arquivos.map(async (arquivo) => {
                const link = await getFileUrl(arquivo.urlfile);

                return {
                  ...arquivo,
                  urlfile: link,
                };
              }),
            );

            return {
              ...data,
              arquivos,
            };
          }),
        );
      }

      
      return res.status(200).send({
        success: true,
        data: resultado,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send({
        success: false,
        message: "Internal Server Error.",
      });
    }
  }

  async findByIdActividade(req: FastifyRequest, res: FastifyReply) {
    try {
      const id = Number((req.params as any).idActividades);

      const result = await this.actividades.getActividadeById(id);

      if (!result) {
        return res.status(404).send({
          success: false,
          message: "Actividade não encontrada.",
        });
      }

      const arquivos = await Promise.all(
        result.arquivos.map(async (arquivo) => {
          const link = await getFileUrl(arquivo.urlfile);

          return {
            ...arquivo,
            urlfile: link,
          };
        }),
      );

      const resultado = {
        ...result,
        arquivos,
      };

      return res.status(200).send({
        success: true,
        message: "Actividade encontrada com sucesso.",
        data: resultado,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send({
        success: false,
        message: "Internal Server Error.",
      });
    }
  }

  async updateActividade(req: FastifyRequest, res: FastifyReply) {
    try {
      const body = req.body as any;
  
      // =====================================================
      // ID DA ACTIVIDADE VEM DO PARAMETRO
      // =====================================================
  
      const id = Number((req.params as any).idActividades);
  
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send({
          success: false,
          message: "ID da actividade inválido.",
        });
      }
  
      // =====================================================
      // VERIFICAR ACTIVIDADE
      // =====================================================
  
      const actividadeExistente =
        await this.actividades.getActividadeById(id);
  
      if (!actividadeExistente) {
        return res.status(404).send({
          success: false,
          message: "Actividade não encontrada.",
        });
      }
  
      // =====================================================
      // TRATAR ID DOS ARQUIVOS
      // =====================================================
  
      let rawIdArquivo = body.idArquivo?.value ?? body.idArquivo;
  
      if (typeof rawIdArquivo === "string") {
        try {
          rawIdArquivo = JSON.parse(rawIdArquivo);
        } catch {
          // Mantém o valor original se não for JSON
        }
      }
  
      const idsArquivos: number[] =
        rawIdArquivo === undefined ||
        rawIdArquivo === null ||
        rawIdArquivo === ""
          ? []
          : (
              Array.isArray(rawIdArquivo)
                ? rawIdArquivo
                : [rawIdArquivo]
            ).map((valor: unknown) => {
              if (
                typeof valor !== "number" &&
                typeof valor !== "string"
              ) {
                return NaN;
              }
  
              if (
                typeof valor === "string" &&
                valor.trim() === ""
              ) {
                return NaN;
              }
  
              return Number(valor);
            });
  
      if (
        idsArquivos.some(
          (arquivoId) =>
            !Number.isInteger(arquivoId) || arquivoId <= 0,
        )
      ) {
        return res.status(400).send({
          success: false,
          message: "ID do arquivo inválido.",
        });
      }
  
      // Evitar IDs duplicados
      const idsUnicos = [...new Set(idsArquivos)];
  
      // =====================================================
      // VALIDAR OS ARQUIVOS ANTES DE OS ELIMINAR
      // =====================================================
  
      const arquivosParaEliminar = [];
  
      for (const idArq of idsUnicos) {
        const arquivo = await this.arquivos.getFileById(idArq);
  
        if (!arquivo) {
          return res.status(404).send({
            success: false,
            message: `Arquivo com ID ${idArq} não encontrado.`,
          });
        }
  
        // Garantir que o arquivo pertence à actividade
        if (arquivo.actividadeId !== id) {
          return res.status(403).send({
            success: false,
            message: `O arquivo ${idArq} não pertence a esta actividade.`,
          });
        }
  
        arquivosParaEliminar.push(arquivo);
      }
  
      // =====================================================
      // APAGAR UM OU VÁRIOS ARQUIVOS PELOS SEUS IDs
      // =====================================================
  
      for (const arquivo of arquivosParaEliminar) {
        // Apagar do Supabase
        await deleteFile(arquivo.urlfile);
  
        // Apagar do banco de dados
        await this.arquivos.deleteFile(arquivo.idArquivo);
      }
  
      // =====================================================
      // DADOS DA ACTIVIDADE
      // =====================================================
  
      const dados: any = {
        idActividades: id,
        nomeActividade: body.nomeActividade?.value,
        localizacao: body.localizacao?.value,
        descricao: body.descricao?.value,
        categoria: body.categoria?.value,
        estado: body.estado?.value,
        dataActiv: body.dataActiv?.value,
      };
  
      // Remover campos não enviados
      Object.keys(dados).forEach((key) => {
        if (dados[key] === undefined) {
          delete dados[key];
        }
      });
  
      // Validar os dados
      const data = UpdateTypeActividade.parse(dados);
  
      // =====================================================
      // ATUALIZAR ACTIVIDADE
      // =====================================================
  
      const result = await this.actividades.updateActividade(data);
  
      if (!result) {
        return res.status(404).send({
          success: false,
          message: "Não foi possível atualizar a actividade.",
        });
      }
  
      // =====================================================
      // ADICIONAR NOVOS ARQUIVOS
      // =====================================================
  
      const possuiArquivos =
        body.arquivo !== undefined &&
        body.arquivo !== null;
  
      if (possuiArquivos) {
        const partes: MultipartFile[] = Array.isArray(body.arquivo)
          ? body.arquivo
          : [body.arquivo];
  
        const imagens = imagensSchema.parse(partes);
  
        await this.actividades.updateActividade({
          idActividades: id,
          statusUpload: TipoStatus.PROCESSANDO,
        });
  
        try {
          for (let i = 0; i < partes.length; i++) {
            const imagem = imagens[i];
            const parte = partes[i];
  
            if (parte.file.truncated) {
              await this.actividades.updateActividade({
                idActividades: id,
                statusUpload: TipoStatus.ERRO,
              });
  
              return res.status(413).send({
                success: false,
                message:
                  `O arquivo ${imagem.filename} excede o tamanho máximo permitido (4.5MB).`,
              });
            }
  
            const buffer = await parte.toBuffer();
  
            if (buffer.length === 0) {
              throw new Error(
                `O arquivo ${imagem.filename} chegou vazio.`,
              );
            }
  
            // Upload para o Supabase
            const uploadResult = await fileUpload(
              "actividades",
              id,
              "imagens",
              imagem.filename,
              buffer,
              imagem.mimetype,
            );
  
            // Guardar no banco de dados
            await this.arquivos.CreateFile({
              filename: imagem.filename,
              urlfile: uploadResult.path,
              dataFile: new Date(),
              local: localArqu.ACTIVIDADE,
              tipoArqui: TipoArqui.ACTIVIDADE,
              actividadeId: id,
            });
          }
  
          await this.actividades.updateActividade({
            idActividades: id,
            statusUpload: TipoStatus.CONCLUIDO,
          });
        } catch (error) {
          await this.actividades.updateActividade({
            idActividades: id,
            statusUpload: TipoStatus.ERRO,
          });
  
          throw error;
        }
      }
  
      // =====================================================
      // BUSCAR ACTIVIDADE ATUALIZADA
      // =====================================================
  
      const actividade =  await this.actividades.getActividadeById(id);
  
      if (!actividade) {
        throw new Error(
          "Actividade atualizada, mas não foi possível carregá-la.",
        );
      }
  
      // =====================================================
      // GERAR URLS DOS ARQUIVOS
      // =====================================================
  
      const arquivos = await Promise.all(
        actividade.arquivos.map(async (arquivo) => {
          const link = await getFileUrl(arquivo.urlfile);
  
          return {
            idArquivo: arquivo.idArquivo,
            urlfile: link,
          };
        }),
      );
  
      console.log("idArquivo",arquivos.idArquivo)
      // =====================================================
      // RESPONSE COMPATÍVEL COM O SCHEMA
      // =====================================================
  
      const responseData = {
        idActividades: actividade.idActividades,
        nomeActividade: actividade.nomeActividade ?? "",
        localizacao: actividade.localizacao ?? "",
  
        data:
          actividade.dataActiv instanceof Date
            ? actividade.dataActiv.toISOString()
            : String(actividade.dataActiv),
  
        descricao: actividade.descricao ?? "",
        categoria: actividade.categoria,
        estado: actividade.estado,
  
        arquivos,
  
        fileUrls: arquivos.map((arquivo) => arquivo.urlfile),
      };
  
      // =====================================================
      // REDIS
      // =====================================================
  
      await redis.set(
        `actividade:${id}`,
        JSON.stringify(responseData),
        "EX",
        3600,
      );
  
      // =====================================================
      // RESPOSTA
      // =====================================================
  
      console.log("Resposta da actividade actualizada:", responseData);
  
      return res.status(200).send({
        success: true,
        message: "Actividade atualizada com sucesso.",
        data: responseData,
      });
    } catch (error) {
      console.error("Erro ao atualizar actividade:", error);
  
      if (error instanceof ZodError) {
        return res.status(422).send({
          success: false,
          message: "Erro de validação.",
          errors: error.flatten(),
        });
      }
  
      return res.status(500).send({
        success: false,
        message: "Internal Server Error.",
      });
    }
  }
  
  
  
  

}
