import { Input } from '@/components/ui/input';
import {
  CalendarClockIcon,
  MapPin,
  Search,
  UsersRoundIcon,
  User2Icon,
  Tent,
  ArrowRight,
  CalendarDays,
  Users,
  HandHeart,
  Bell,
} from 'lucide-react';
import procissao from '@/assets/procissao.jpg';
import { Button } from '@/components/ui/button';
import { EspiritualidadeIcon, MissaoIcon } from '../../lib/icons';
import  { NavLink } from 'react-router-dom';

const categorias = [
  { icon: <UsersRoundIcon className="text-white" />, label: 'Todas', active: true },
  { icon: <EspiritualidadeIcon />, label: 'Espiritualidade', active: false },
  { icon: <User2Icon className="text-green-600" />, label: 'Formação', active: false },
  { icon: <MissaoIcon />, label: 'Missão', active: false },
  { icon: <Tent />, label: 'Acampamento', active: false },
];

const infos = [
  { icon: <CalendarClockIcon className="text-amber-400 w-10 h-10 shrink-0" />, title: 'Calendário completo', desc: 'Fique por dentro de todos os eventos do MEJ' },
  { icon: <Users className="text-amber-400 w-10 h-10 shrink-0" />, title: 'Traga seus amigos', desc: 'Convide mais jovens para viver essa missão' },
  { icon: <HandHeart className="text-amber-400 w-10 h-10 shrink-0" />, title: 'Faça a diferença', desc: 'Cada actividade transforma vidas e comunidades' },
  { icon: <Bell className="text-amber-400 w-10 h-10 shrink-0" />, title: 'Receba novidades', desc: 'Cadastre-se e receba novidades por email' },
];

function ActivityCard() {
  return (
    <div className="flex flex-col rounded-xl shadow-xl w-full">
      <div
        className="rounded-t-xl flex p-4 w-full h-44"
        style={{
          backgroundImage: `url(${procissao})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="flex flex-col justify-center items-center shadow h-14 w-14 bg-white text-red-600 font-bold rounded-md">
          <p>07</p>
          <p>JUN</p>
        </div>
      </div>
      <div className="flex flex-col p-4 gap-2 flex-1">
        <h1 className="text-orange-950 font-black">Grupo de Oração</h1>
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex gap-2 items-center">
            <CalendarDays size={16} className="text-orange-950 shrink-0" /> 07
            de junho de 2026
          </div>
          <div className="flex gap-2 items-center">
            <MapPin size={16} className="text-orange-950 shrink-0" /> Paróquia
            Santa Mãe de Deus
          </div>
          <div className="flex gap-2 items-center">
            <UsersRoundIcon size={16} className="text-orange-950 shrink-0" /> 45
            participantes
          </div>
          <Button className="bg-white border border-blue-300 text-blue-600 w-fit px-3 cursor-pointer text-xs">
            Espiritualidade
          </Button>
        </div>
      </div>
      <div className="border-t p-2 flex justify-center">
        <NavLink
          to="/ActividadesView"
          className="bg-white flex text-orange-950 cursor-pointer text-sm font-medium"
        >
          Ver Detalhes <ArrowRight size={18} />
        </NavLink>
      </div>
    </div>
  );
}

export default function ActividadesUser() {
  return (
    <div className="flex flex-col gap-6 p-4">

      {/* ── CABEÇALHO ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-8 py-4">
        <div>
          <h1 className="text-orange-950 font-bold text-2xl">Actividades</h1>
          <p className="text-sm text-gray-600 mt-1">
            Participe dos eventos e viva momentos de fé, comunhão e missão!
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-950" size={16} />
          <Input className="pl-9" placeholder="Pesquisar..." />
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div className="flex flex-wrap gap-2 px-4 sm:px-8">
        {categorias.map((c) => (
          <Button
            key={c.label}
            className={`cursor-pointer flex items-center gap-1.5 text-sm px-3 h-9 ${
              c.active
                ? 'bg-orange-950 text-white'
                : 'bg-white text-orange-950 border border-zinc-300'
            }`}
          >
            {c.icon} {c.label}
          </Button>
        ))}
      </div>

      {/* ── DESTAQUE + 3 CARDS ── */}
      <section className="flex flex-col lg:flex-row gap-6 px-4 sm:px-8">
        {/* Destaque */}
        <div
          style={{ backgroundImage: `url(${procissao})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          className="flex flex-col text-white shadow-2xl gap-6 p-5 w-full lg:w-80 shrink-0 rounded-xl"
        >
          <div className="flex justify-between flex-wrap gap-2">
            <div className="text-orange-950 font-medium rounded-full px-4 h-8 flex items-center bg-yellow-400 text-sm">
              Destaque
            </div>
            <div className="rounded-md h-8 flex items-center bg-green-400 px-3 text-white text-sm font-normal">
              Inscrições Abertas
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black">Procissão do Corpo e Sangue MEJ 2026</h1>
            <p className="text-sm font-normal mt-1">Corações ardentes, pés a caminho</p>
          </div>
          <div className="flex flex-col gap-2 text-sm font-normal">
            <div className="flex gap-2 items-center"><CalendarDays size={16} /> 18 a 21 de Julho de 2025</div>
            <div className="flex gap-2 items-center"><MapPin size={16} /> Nossa Senhora de Fátima</div>
          </div>
          <div className="text-orange-950 font-medium rounded-md px-4 h-8 flex items-center bg-yellow-400 w-fit text-sm cursor-pointer">
            Saiba mais
          </div>
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
          {Array.from({ length: 3 }).map((_, i) => <ActivityCard key={i} />)}
        </div>
      </section>

      {/* ── PUBLICIDADE ── */}
      <section className="px-4 sm:px-8">
        <div className="shadow-xl p-4 sm:p-6 border rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {infos.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                {item.icon}
                <div>
                  <h2 className="text-orange-950 font-bold text-sm">{item.title}</h2>
                  <p className="text-xs font-medium text-zinc-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TODAS AS ACTIVIDADES ── */}
      <section className="px-4 sm:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 10 }).map((_, i) => <ActivityCard key={i} />)}
        </div>
      </section>
    </div>
  );
}