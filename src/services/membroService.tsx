import type { createMembroSchema } from '@/types/Schemas';
import api from './api';

export async function DeleteMember(idMejista: number) {
  try {
    const response = await api.delete('/user/deleteMember', {
      data: { idMejista },
    });

    return { 
      success: true,
      message: response.data?.message || 'Membro eliminado com sucesso',
    };
  } catch (error:any) {
    const message = error.response?.data?.message;

    return {
      success: false,
      message: message || 'Erro ao eliminar Usuario',
    };
  }
}

export async function GetMember() {
  try {
    const response = await api.get('/user/findMany');

    return response.data;
  } catch (error) {
    console.log(error);
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
    console.log("error" + error);
    throw error;
  }
}

export async function CreateMember(data: createMembroSchema) {
  try {

    const response = await api.post('/user/createMember', data);
   
    return response.data;
  } catch (error) {
    console.log("error" + error);
    throw error;
  }
}
