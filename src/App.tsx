import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import AdminLayout from './layouts/Admin/AdminLayout';
import Centros from './pages/Admin/Centros';
import Paroquias from './pages/Admin/Paroquias';
import Membros from './pages/Admin/Membros';
import Actividades from './pages/Admin/Actividades';
import { PrivateRoute } from './services/AdminService';
import Home from './pages/user/Home';
import UserLayout from './layouts/user/UserLayout';
import Sobre from './pages/user/Sobre';
import ActividadesUser from './pages/user/ActividadesUser';
import ActiviCard from './pages/user/ActivViews';
import Actualizar from './pages/Admin/DataAdmi';
import RecoverAcount from './pages/recoverAcount';

const router = createBrowserRouter([
  {
    element: <UserLayout />,
    children: [
      { path: '/Home', element: <Home /> },
      { path: '/Sobre', element: <Sobre /> },
      { path: '/Actividades', element: <ActividadesUser /> },
      { path: '/ActividadesView', element: <ActiviCard /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
  { path: '/recoverAcount', element: <RecoverAcount /> },
  { path: '/', element: <Login /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/Dashboard', element: <Dashboard /> },
          { path: '/Centros', element: <Centros /> },
          { path: '/Paroquias', element: <Paroquias /> },
          { path: '/Membros', element: <Membros /> },
          { path: '/ActividadesAdmin', element: <Actividades /> },
          { path: '/Actualizar', element: <Actualizar /> },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
