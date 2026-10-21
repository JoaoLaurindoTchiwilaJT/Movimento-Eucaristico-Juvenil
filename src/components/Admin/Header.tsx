import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Building2,
  Church,
  LogOut,
  BookCheckIcon,
  UserCheck,
} from 'lucide-react';
import logotipo from '@/assets/logotipo.png';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md transition ${
      isActive
        ? 'bg-white text-amber-800 font-semibold'
        : 'text-amber-900 hover:bg-amber-200'
    }`;

  const navItems = [
    { to: '/Dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { to: '/Paroquias', icon: <Church />, label: 'Paróquias' },
    { to: '/Centros', icon: <Building2 />, label: 'Centros' },
    { to: '/Membros', icon: <Users />, label: 'Membros' },
    { to: '/ActividadesAdmin', icon: <BookCheckIcon />, label: 'Actividades' },
    { to: '/Actualizar', icon: <UserCheck />, label: 'Actualizar' },
  ];

  return (
    <>
      {/* ── BOTÃO HAMBÚRGUER (só mobile) ── */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-amber-300 p-2 rounded-md text-amber-900 shadow"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {/* ── OVERLAY (só mobile, quando drawer aberto) ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/40"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR MOBILE (drawer deslizante) ── */}
      <motion.div
        key="mobile-sidebar"
        initial={{ x: '-100%' }}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden fixed top-0 left-0 z-50 h-screen w-64 bg-amber-300 flex flex-col shadow-lg"
      >
        <div className="flex items-center justify-between p-4">
          <img src={logotipo} alt="logo" className="w-20" />
          <button
            onClick={() => setOpen(false)}
            className="text-amber-900 cursor-pointer"
            aria-label="Fechar menu"
          >
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2 mt-4 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <div className="text-xl">{item.icon}</div>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <NavLink
            to="/"
            className={linkClass}
            onClick={() => {
              localStorage.removeItem('token');
              setOpen(false);
            }}
          >
            <LogOut />
            <span>Sair</span>
          </NavLink>
        </nav>
      </motion.div>

      {/* ── SIDEBAR DESKTOP (colapsável como antes) ── */}
      <motion.div
        animate={{ width: desktopOpen ? 260 : 80 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="hidden md:flex h-screen bg-amber-300 flex-col shadow-lg overflow-hidden shrink-0"
      >
        <div className="flex items-center justify-between p-4">
          <AnimatePresence>
            {desktopOpen && (
              <motion.img
                key="logo"
                src={logotipo}
                alt="logo"
                className="w-20 mx-auto"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          <button
            onClick={() => setDesktopOpen(!desktopOpen)}
            className="text-amber-900 hover:scale-110 transition cursor-pointer"
            aria-label="Colapsar menu"
          >
            {desktopOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="flex flex-col gap-2 mt-6 px-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <div className="text-xl">{item.icon}</div>
              <AnimatePresence>
                {desktopOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

          <NavLink
            to="/"
            className={linkClass}
            onClick={() => localStorage.removeItem('token')}
          >
            <LogOut />
            <AnimatePresence>
              {desktopOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Sair
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        </nav>
      </motion.div>
    </>
  );
}
