import type { createCentroSchema } from '@/types/Schemas';
import api from './api';

export async function UpdateCentro(data: {
  nomeCentro: string;
  idCentrosParoquias: string;
}) {
  try {
    console.log(data);
    const response = await api.put('/centros/updateCentros', data);

    return response.data;
  } catch (error) {
     console.log()
    throw error;
  }
}

export async function CadastrarCentro(data: createCentroSchema) {
  try {
    console.log(data)
    const response = await api.post('/centros/createCentros', data);
    return response.data;
  } catch (error) {
     console.log()
    throw error;
  }
}

export async function GetCentro() {
  try {
    const response = await api.get('/centros/findMany');
    return response.data;
  } catch (error) {
    console.log()
    throw error;
  }
}

export async function DeleteCentro(idCentrosParoquias: string) {
  try {
    const response = await api.delete('/centros/deleteCentros', {
      data: { idCentrosParoquias },
    });

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
      message: message || 'Erro ao eliminar centro',
    };
  }
}
