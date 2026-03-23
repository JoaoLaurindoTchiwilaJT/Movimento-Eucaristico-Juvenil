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

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  {
    element: <AdminLayout />,
    children: [
      { path: '/Dashboard', element: <Dashboard /> },
      { path: '/Centros', element: <Centros /> },
      { path: '/Paroquias', element: <Paroquias /> },
      { path: '/Membros', element: <Membros /> },
      { path: '/Actividades', element: <Actividades /> },
      { path: '*', element: <Navigate to="/" replace /> },
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
