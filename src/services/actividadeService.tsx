import type { createActividade, updateActividade } from '@/types/Schemas';
import api from './api';
type Actividade = createActividade & { id: number };

export async function CreateActividade(data: createActividade) {
  const datas = new FormData();

  datas.append('nomeActividade', data.nomeActividade);
  datas.append('descricao', data.descricao);
  datas.append('categoria', data.categoria);
  datas.append('localizacao', data.localizacao);
  datas.append('estado', data.estado);
  datas.append('dataActiv', data.dataActiv);

  // Enviar apenas ficheiros novos.
  (data.arquivo ?? []).forEach((item) => {
    if (item instanceof File) {
      datas.append('arquivo', item);
    }
  });

  try {
    const response = await api.post('/actividade/createActividade', datas);

    console.log('Actividade criada:', response.data);

    return response.data;
  } catch (error: unknown) {
    console.error('Erro ao cadastrar actividade:', error);

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const httpError = error as {
        response?: {
          status?: number;
          data?: unknown;
        };
      };

      console.error('Status HTTP:', httpError.response?.status);
      console.error('Resposta do servidor:', httpError.response?.data);
    }

    throw error;
  }
}


export async function UpdateActividade(data: updateActividade) {
  console.log("Dados para actualizar actividade:", data);

  const datas = new FormData();

  // =====================================================
  // CAMPOS DA ACTIVIDADE
  // =====================================================

  if (data.nomeActividade !== undefined) {
    datas.append("nomeActividade", data.nomeActividade);
  }

  if (data.descricao !== undefined) {
    datas.append("descricao", data.descricao);
  }

  if (data.categoria !== undefined) {
    datas.append("categoria", data.categoria);
  }

  if (data.localizacao !== undefined) {
    datas.append("localizacao", data.localizacao);
  }

  if (data.estado !== undefined) {
    datas.append("estado", data.estado);
  }

  if (data.dataActiv !== undefined) {
    datas.append("dataActiv", data.dataActiv);
  }

  // =====================================================
  // IDs DOS ARQUIVOS A ELIMINAR
  // =====================================================

  if (data.idArquivo !== undefined && data.idArquivo !== null) {
    const idsArquivos = (
      Array.isArray(data.idArquivo)
        ? data.idArquivo
        : [data.idArquivo]
    ).map(Number);

    if (
      idsArquivos.some(
        (id) => !Number.isInteger(id) || id <= 0
      )
    ) {
      throw new Error("Um ou mais IDs de arquivos são inválidos.");
    }

    // Evitar IDs repetidos
    const idsUnicos = [...new Set(idsArquivos)];

    if (idsUnicos.length > 0) {
      // Um ID: [5]
      // Vários IDs: [5, 6, 7]
      datas.append("idArquivo", JSON.stringify(idsUnicos));
    }
  }

  // =====================================================
  // NOVOS FICHEIROS
  // =====================================================

  if (data.arquivo?.length) {
    data.arquivo.forEach((item) => {
      if (item instanceof File) {
        datas.append("arquivo", item);
      }
    });
  }

  // =====================================================
  // DEBUG
  // =====================================================

  console.log("FormData enviado:");

  datas.forEach((valor, chave) => {
    console.log(chave, valor);
  });

  // =====================================================
  // REQUISIÇÃO
  // =====================================================

  try {
    const response = await api.put(
      `/actividade/UpdateActividade/${data.idActividades}`,
      datas
    );

    console.log("Actividade actualizada:", response.data);

    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao actualizar actividade:", error);

    if (typeof error === "object" && error !== null && "response" in error) {
      const httpError = error as {
        response?: {
          status?: number;
          data?: unknown;
        };
      };

      console.error("Status HTTP:", httpError.response?.status);
      console.error("Resposta do servidor:", httpError.response?.data);
    }

    throw error;
  }
}

export async function DeleteActividade(idActividades: string) {
  try {
    const response = await api.delete(
      `/actividade/deleteActividade/${idActividades}`,
    );

    // resposta do backend
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    // captura erro vindo do backend
    const message = error.response?.data?.message;

    return {
      success: false,
      message: message || 'Erro ao eliminar actividade',
    };
  }
}
 
export async function getManyActividade() {
  try {
    const response = await api.get('/actividade/getManyActividade');
    const resultado = response.data;

    console.log('Resposta do backend:', resultado);

    const lista = Array.isArray(resultado?.data)
      ? resultado.data
      : Array.isArray(resultado)
        ? resultado
        : [];

    const actividadesConvertidas: Actividade[] = lista.map((item: any) => {
      const arquivosRecebidos = Array.isArray(item.arquivos)
        ? item.arquivos
        : Array.isArray(item.arquivo)
          ? item.arquivo
          : Array.isArray(item.fileUrls)
            ? item.fileUrls
            : Array.isArray(item.imagens)
              ? item.imagens
              : [];

      const imagens: string[] = arquivosRecebidos
        .map((arquivo: any) => {
          if (typeof arquivo === 'string') return arquivo;
          if (typeof arquivo?.urlfile === 'string') {
            return arquivo.urlfile;
          }
          if (typeof arquivo?.url === 'string') {
            return arquivo.url;
          }
          return '';
        })
        .filter((url: string) => url.trim().length > 0);

      return {
        id: Number(item.idActividades ?? item.id),
        nomeActividade: item.nomeActividade ?? '',
        localizacao: item.localizacao ?? '',
        dataActiv: item.dataActiv
          ? String(item.dataActiv).split('T')[0]
          : item.data
            ? String(item.data).split('T')[0]
            : '',
        descricao: item.descricao ?? '',
        categoria: item.categoria ?? '',
        estado: item.estado ?? '',
        arquivo: imagens,
      } as Actividade;
    });

    console.log('Actividades convertidas:', actividadesConvertidas);

    return actividadesConvertidas;
  } catch (error: unknown) {
    console.error('Erro ao cadastrar actividade:', error);

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const httpError = error as {
        response?: {
          status?: number;
          data?: unknown;
        };
      };

      console.error('Status HTTP:', httpError.response?.status);
      console.error('Resposta do servidor:', httpError.response?.data);
    }

    throw error;
  }
}

