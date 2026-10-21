import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logotipo from '@/assets/logotipo.png';
import { Button } from '@/components/ui/button';
import { User2Icon, MenuIcon, XIcon } from 'lucide-react';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition-colors flex flex-col items-center gap-0.5 ${
    isActive ? 'text-orange-950' : 'text-orange-800 hover:text-orange-950'
  }`;

const navLinks = [
  { to: '/Home', label: 'Início' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/actividades', label: 'Actividades' },
];

export default function HeaderUser() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-orange-100 bg-white sticky top-0 z-50">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between px-8 lg:px-16 h-16">
        <img src={logotipo} alt="logo" className="w-14 lg:w-16" />

        <nav className="flex items-center gap-8">
          {navLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`h-0.5 rounded-full bg-yellow-400 transition-all duration-200 ${
                      isActive ? 'w-4' : 'w-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 px-4 rounded-full text-sm font-semibold text-orange-950 border-orange-900 hover:bg-orange-950 hover:text-white transition-colors"
          >
            Cadastrar
          </Button>
          <Button className="h-9 px-4 rounded-full text-sm font-semibold bg-orange-950 text-white border border-orange-950 hover:bg-white hover:text-orange-950 transition-colors flex items-center gap-1.5">
            <User2Icon size={15} /> Entrar
          </Button>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14">
        <img src={logotipo} alt="logo" className="w-12" />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-orange-950 p-1 rounded-md hover:bg-orange-50 transition-colors"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-orange-100 bg-white px-4 pt-4 pb-6 flex flex-col gap-5">
          <nav className="flex flex-col gap-4 items-center">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`h-0.5 rounded-full bg-yellow-400 transition-all duration-200 ${
                        isActive ? 'w-4' : 'w-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-col gap-2 pt-2 border-t border-orange-100">
            <Button
              variant="outline"
              className="w-full h-9 rounded-full text-sm font-semibold text-orange-950 border-orange-900 hover:bg-orange-950 hover:text-white transition-colors"
            >
              Cadastrar
            </Button>
            <Button className="w-full h-9 rounded-full text-sm font-semibold bg-orange-950 text-white border border-orange-950 hover:bg-white hover:text-orange-950 transition-colors flex items-center justify-center gap-1.5">
              <User2Icon size={15} /> Entrar
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}