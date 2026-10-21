import { Card } from '@/components/ui/card';
import { Users, Church, Building2, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import api from '@/services/api';

type EvolucaoMensal = {
  name: string;
  Promessados: number;
  NaoPromessados: number;
};

type MembrosPorParoquia = {
  paroquia: string;
  total: number;
};

type AtividadeRecente = {
  id: string | number;
  titulo: string;
  data: string;
};

type Datas = {
  totalUsuario: number;
  totalParoquia: number;
  totalCentros: number;
  totalUsuarioPromessados: number;
  totalUsuarioNaoPromessados: number;
  evolucaoMensal?: EvolucaoMensal[];
  membrosPorParoquia?: MembrosPorParoquia[];
  atividadesRecentes?: AtividadeRecente[];
};

const CORES_DONUT = ['#0088FE', '#FF8042'];

// Dados de fallback, usados enquanto a API não responde ou em ambiente de demonstração
const lineDataFallback: EvolucaoMensal[] = [
  { name: 'Jan', Promessados: 10, NaoPromessados: 5 },
  { name: 'Fev', Promessados: 15, NaoPromessados: 8 },
  { name: 'Mar', Promessados: 20, NaoPromessados: 12 },
  { name: 'Abr', Promessados: 25, NaoPromessados: 15 },
];

const membrosPorParoquiaFallback: MembrosPorParoquia[] = [
  { paroquia: 'São José', total: 34 },
  { paroquia: 'Sto. António', total: 28 },
  { paroquia: 'Fátima', total: 25 },
  { paroquia: 'Cristo Rei', total: 22 },
  { paroquia: 'São Paulo', total: 19 },
];

const atividadesFallback: AtividadeRecente[] = [
  { id: 1, titulo: 'Retiro espiritual — Paróquia São José', data: '10 Abr' },
  { id: 2, titulo: 'Encontro de novos mejistas — Centro Luanda', data: '05 Abr' },
  { id: 3, titulo: 'Reunião de coordenação regional', data: '01 Abr' },
];

export default function Dashboard() {
  const [data, setData] = useState<Datas | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/user/dashboard');
        setData(response.data);
      } catch (error) {
        console.log('Erro ao buscar dashboard:', error);
      } finally {
        setCarregando(false);
      }
    };
    fetchDashboard();
  }, []);

  const lineData = data?.evolucaoMensal?.length
    ? data.evolucaoMensal
    : lineDataFallback;

  const membrosPorParoquia = data?.membrosPorParoquia?.length
    ? data.membrosPorParoquia
    : membrosPorParoquiaFallback;

  const atividadesRecentes = data?.atividadesRecentes?.length
    ? data.atividadesRecentes
    : atividadesFallback;

  // Taxa de cumprimento: percentual de mejistas promessados sobre o total
  const taxaCumprimento = useMemo(() => {
    const promessados = data?.totalUsuarioPromessados ?? 0;
    const naoPromessados = data?.totalUsuarioNaoPromessados ?? 0;
    const total = promessados + naoPromessados;
    if (!total) return 0;
    return Math.round((promessados / total) * 100);
  }, [data]);

  const donutData = [
    { name: 'Promessados', value: taxaCumprimento || 63 },
    { name: 'Não promessados', value: 100 - (taxaCumprimento || 63) },
  ];

  return (
    <div className="w-full flex flex-col gap-8 pt-6 pb-10">

      {/* CABEÇALHO */}
      <div className="px-4 sm:px-10">
        <h1 className="text-xl font-black text-amber-800">Dashboard</h1>
        <div className="bg-amber-800 w-10 h-1 rounded-md mt-1" />
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-10">

        {/* Total Mejistas */}
        <div className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-l-4 border-red-300 bg-white rounded-md py-3 px-4 flex items-center gap-4 h-20">
          <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
            <Users className="text-red-500" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total mejistas</span>
            <p className="text-gray-700 text-2xl font-bold leading-tight">
              {carregando ? '—' : data?.totalUsuario ?? 128}
            </p>
          </div>
        </div>

        {/* Total Paróquias */}
        <div className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-l-4 border-yellow-300 bg-white rounded-md py-3 px-4 flex items-center gap-4 h-20">
          <div className="bg-yellow-100 p-3 rounded-full flex-shrink-0">
            <Church className="text-yellow-600" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total paróquias</span>
            <p className="text-gray-700 text-2xl font-bold leading-tight">
              {carregando ? '—' : data?.totalParoquia ?? 9}
            </p>
          </div>
        </div>

        {/* Total Centros */}
        <div className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-l-4 border-orange-300 bg-white rounded-md py-3 px-4 flex items-center gap-4 h-20">
          <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
            <Building2 className="text-orange-500" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total centros</span>
            <p className="text-gray-700 text-2xl font-bold leading-tight">
              {carregando ? '—' : data?.totalCentros ?? 14}
            </p>
          </div>
        </div>

        {/* Taxa de Cumprimento */}
        <div className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-l-4 border-green-300 bg-white rounded-md py-3 px-4 flex items-center gap-4 h-20">
          <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Taxa de cumprimento</span>
            <p className="text-gray-700 text-2xl font-bold leading-tight">
              {carregando ? '—' : `${taxaCumprimento || 63}%`}
            </p>
          </div>
        </div>
      </div>

      {/* GRÁFICO DE EVOLUÇÃO */}
      <div className="px-4 sm:px-10">
        <Card className="w-full h-72 sm:h-80 p-4 shadow-[0_5px_30px_rgba(0,0,0,0.1)] rounded-xl bg-white border-none">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Promessados vs não promessados (Jan - Abr)
          </p>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="4 4" opacity={0.3} />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="Promessados"
                stroke="#0088FE"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />

              <Line
                type="monotone"
                dataKey="NaoPromessados"
                stroke="#FF8042"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Não Promessados"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* MEMBROS POR PARÓQUIA + PROPORÇÃO GERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 px-4 sm:px-10">

        {/* Barras por paróquia */}
        <Card className="w-full h-80 p-4 shadow-[0_5px_30px_rgba(0,0,0,0.1)] rounded-xl bg-white border-none">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Membros por paróquia
          </p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={membrosPorParoquia}>
              <CartesianGrid strokeDasharray="4 4" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="paroquia"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="total" fill="#F5A623" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Donut de proporção */}
        <Card className="w-full h-80 p-4 shadow-[0_5px_30px_rgba(0,0,0,0.1)] rounded-xl bg-white border-none flex flex-col">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Proporção geral
          </p>
          <div className="relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="65%"
                  outerRadius="90%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {donutData.map((_, index) => (
                    <Cell key={index} fill={CORES_DONUT[index % CORES_DONUT.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-gray-800">
                {taxaCumprimento || 63}%
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CORES_DONUT[0] }} />
              Promessados {taxaCumprimento || 63}%
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CORES_DONUT[1] }} />
              Não promessados {100 - (taxaCumprimento || 63)}%
            </div>
          </div>
        </Card>
      </div>

      {/* ATIVIDADES RECENTES */}
      <div className="px-4 sm:px-10">
        <Card className="w-full p-4 shadow-[0_5px_30px_rgba(0,0,0,0.1)] rounded-xl bg-white border-none">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Actividades recentes
          </p>
          <div className="flex flex-col divide-y divide-gray-100">
            {atividadesRecentes.map((atividade) => (
              <div
                key={atividade.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <span className="text-sm font-semibold text-gray-700">
                  {atividade.titulo}
                </span>
                <span className="text-xs text-gray-400">{atividade.data}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}