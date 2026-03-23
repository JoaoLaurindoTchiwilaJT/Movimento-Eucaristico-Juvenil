import type { createParoquiaSchema } from '@/types/Schemas';
import api from '@/services/api';

export async function CadastraParoquia(data: createParoquiaSchema) {
  try {
    const response = await api.post(
      '/paroquias/createParoquia',
      data,
      //     {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error('Error to create paróquia', error);
    throw error;
  }
}

export async function GetParoquia() {
  try {
    const response = await api.get(
      '/paroquias/findMany',
      //     {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.log('Error to get Paróquias', error);
    throw error;
  }
}

export async function DeleteParoquia(idParoquia: string) {
  try {
    const response = await api.delete('/paroquias/deleteParoquia', {
      data: { idParoquia },
    });
    return response;
  } catch (error) {
    console.log('Error to delete Paróquias', error);
    throw error;
  }
}

export async function UpdateParoquia(data: { nomeParoquia: string; quota: number; idParoquia: string; }) {
    
  try {
    const response = await api.put('/paroquias/updateParoquia',data);
    return response.data;
  } catch (error) {
    console.log('Error to update Paróquias', error);
    throw error;
  }
}
