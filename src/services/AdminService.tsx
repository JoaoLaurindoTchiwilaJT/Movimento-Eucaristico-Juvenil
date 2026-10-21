import type { LoginUserSchemas } from '@/types/Schemas';
import { Navigate, Outlet } from 'react-router-dom';
import api from './api';

export async function LoginUserMember(data: LoginUserSchemas) {
  try {
    const response = await api.post('/user/login', data);

    console.log(data)
    localStorage.removeItem('token');

    const token = response.data.token;

    localStorage.setItem('token', token);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function PrivateRoute() {
  try {
    const isAuthenticated = !!localStorage.getItem('token');

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
