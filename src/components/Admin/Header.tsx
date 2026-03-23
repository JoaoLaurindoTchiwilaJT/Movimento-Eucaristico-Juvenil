import { NavLink } from 'react-router-dom';
import logotipo from '@/assets/logotipo.png';

export default function Header() {
  return (
    <div className="w-1/5 max-w-62.5 h-screen box-border flex flex-col gap-6 bg-amber-300">
      <img src={logotipo} alt="Logo" className="w-28 mx-auto mt-4" />

      <div className="flex flex-col gap-2 mt-6 w-full">
        <NavLink
          to="/Dashboard"
          className={({ isActive }) =>
            `w-full py-3 text-xl font-semibold px-6 ${
              isActive
                ? 'bg-white text-amber-800 border-l-4 border-amber-800'
                : 'text-amber-800'
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/Paroquias"
          className={({ isActive }) =>
            `w-full py-3 text-xl font-semibold px-6 ${
              isActive
                ? 'bg-white text-amber-800 border-l-4 border-amber-800'
                : 'text-amber-800'
            }`
          }
        >
          Paróquias
        </NavLink>

        <NavLink
          to="/Centros"
          className={({ isActive }) =>
            `w-full py-3 text-xl font-semibold px-6 ${
              isActive
                ? 'bg-white text-amber-800 border-l-4 border-amber-800'
                : 'text-amber-800'
            }`
          }
        >
          Centros
        </NavLink>

        <NavLink
          to="/Membros"
          className={({ isActive }) =>
            `w-full py-3 text-xl font-semibold px-6 ${
              isActive
                ? 'bg-white text-amber-800 border-l-4 border-amber-800'
                : 'text-amber-800'
            }`
          }
        >
          Membros
        </NavLink>
        <NavLink
          to="/Actividades"
          className={({ isActive }) =>
            `w-full py-3 text-xl font-semibold px-6 ${
              isActive
                ? 'bg-white text-amber-800 border-l-4 border-amber-800'
                : 'text-amber-800'
            }`
          }
        >
          Actividades
        </NavLink>
      </div>
    </div>
  );
}
