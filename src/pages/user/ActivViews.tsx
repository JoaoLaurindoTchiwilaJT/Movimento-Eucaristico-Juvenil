import procissao from '@/assets/procissao.jpg';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
} from 'lucide-react';

export default function ActivityDetailPage() {
  const [confirmed, setConfirmed] = useState(false);
  const baseCount = 45;
  const totalCount = baseCount + (confirmed ? 1 : 0);

  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div
          className="relative rounded-2xl overflow-hidden h-72 md:h-96 flex flex-col justify-between p-5"
          style={{
            backgroundImage: `url(${procissao})`,
            backgroundPosition: 'center 35%',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80" />

          <div className="relative flex justify-between">
            <button className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center text-orange-950 shadow">
              <ArrowLeft size={18} />
            </button>
            <div className="flex gap-2">
              <button className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center text-orange-950 shadow">
                <Bookmark size={18} />
              </button>
              <button className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center text-orange-950 shadow">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className="relative flex flex-col items-start gap-3 text-white">
            <div className="flex items-end gap-3">
              <div className="flex flex-col justify-center items-center shadow h-14 w-14 bg-white text-red-600 font-bold rounded-md -rotate-6">
                <p className="leading-none">07</p>
                <p className="text-xs leading-none mt-1">JUN</p>
              </div>
              <span className="bg-red-600/90 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={12} /> Espiritualidade
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Grupo de Oração</h1>
            <p className="text-white/90 text-sm">
              Uma marcha de fé pelas ruas da comunidade
            </p>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Main column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white border rounded-2xl p-5">
              <h2 className="text-orange-950 font-bold text-lg mb-2">
                Sobre o evento
              </h2>
              <p className="text-orange-950/80 text-sm leading-relaxed">
                Uma manhã de oração e comunhão, reunindo fiéis da Paróquia Santa
                Mãe de Deus numa marcha de fé pelas ruas da comunidade. O
                encontro celebra a espiritualidade partilhada e fortalece os
                laços entre os grupos de oração da região. Todos são bem-vindos,
                independentemente do grupo paroquial a que pertencem.
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-5">
              <h2 className="text-orange-950 font-bold text-lg mb-3">Local</h2>
              <div className="flex gap-4 items-center">
                <div className="h-24 w-24 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-orange-950" />
                </div>
                <div>
                  <p className="font-semibold text-orange-950">
                    Paróquia Santa Mãe de Deus
                  </p>
                  <p className="text-sm text-orange-950/60">
                    Ponto de encontro: escadaria principal da igreja
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h2 className="text-orange-950 font-bold text-lg mb-2">
                  Quem vai participar
                </h2>
                <div className="flex -space-x-2">
                  {['MC', 'JS', 'AL', 'RT'].map((initials) => (
                    <div
                      key={initials}
                      className="h-9 w-9 rounded-full bg-orange-950 text-white text-xs font-bold flex items-center justify-center border-2 border-white"
                    >
                      {initials}
                    </div>
                  ))}
                  <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-950 text-xs font-bold flex items-center justify-center border-2 border-white">
                    +{totalCount - 4}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-950">
                  {totalCount}
                </p>
                <p className="text-xs text-orange-950/60">confirmados</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white border rounded-2xl p-5 flex flex-col gap-5 h-fit">
            <div className="flex gap-4">
              <CalendarDays className="text-orange-950" />
              <div className="text-orange-950">
                <p className="text-xs uppercase text-orange-950/50 font-semibold">
                  Data
                </p>
                <p className="font-medium">07 de Junho de 2026</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="text-orange-950" />
              <div className="text-orange-950">
                <p className="text-xs uppercase text-orange-950/50 font-semibold">
                  Horário
                </p>
                <p className="font-medium">08:00 — 10:30</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="text-orange-950" />
              <div className="text-orange-950">
                <p className="text-xs uppercase text-orange-950/50 font-semibold">
                  Local
                </p>
                <p className="font-medium">Paróquia Santa Mãe de Deus</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="text-orange-950" />
              <div className="text-orange-950">
                <p className="text-xs uppercase text-orange-950/50 font-semibold">
                  Presenças
                </p>
                <p className="font-medium">{totalCount} participantes</p>
              </div>
            </div>

            <Button
              onClick={() => setConfirmed((c) => !c)}
              className={`rounded-2xl w-full p-6 text-base transition-colors ${
                confirmed
                  ? 'bg-green-700 hover:bg-green-800'
                  : 'bg-orange-950 hover:bg-orange-900'
              }`}
            >
              {confirmed ? 'Presença confirmada ✓' : 'Confirmar presença'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
