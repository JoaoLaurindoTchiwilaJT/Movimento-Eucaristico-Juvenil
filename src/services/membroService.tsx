import type { createMembroSchema } from '@/types/Schemas';
import api from './api';

export async function DeleteMember(idMejista: number) {
  try {
    const response = await api.delete('/user/deleteMember', {
      data: { idMejista },
    });

    return {
      success: true,
      message: response.data?.message ?? 'Membro eliminado com sucesso',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message ?? 'Erro ao eliminar membro',
    };
  }
}

export async function GetMember() {
  try {
    const response = await api.get('/user/findMany');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    throw error;
  }
}

export async function UpdateMember(data: {
  idMejista: number;
  nomeMembro: string;
  centroId: number;
  cargo: string;
  promessado: string;
  contacto: number;
  nivel: string;
}) {
  try {
    const response = await api.put('/user/updateMember', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao actualizar membro:', error);
    throw error;
  }
}

export async function CreateMember(data: createMembroSchema) {
  try {
    const response = await api.post('/user/createMember', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar membro:', error);
    throw error;
  }
}
