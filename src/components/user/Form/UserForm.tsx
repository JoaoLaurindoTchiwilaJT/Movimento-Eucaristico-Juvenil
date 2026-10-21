import { Input } from '@/components/ui/input';
import api from '@/services/api';
import { type createMembroSchema, createTypeMembro } from '@/types/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

type Paroquia = {
  idParoquia: number;
  nomeParoquia: string;
  quota: number;
};

type Centros = {
  idCentrosParoquias: number;
  nomeCentro: string;
  tipo: string;
  paroquia: Paroquia;
};

export default function UserForm() {
  const [paroquiaSelecionada, setParoquiaSelecionada] = useState('');
  const [centros, setCentros] = useState<Centros[]>([]);

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<createMembroSchema>({
    resolver: zodResolver(createTypeMembro),
    defaultValues: {
      promessado: 'Não',
      nomeParoquia: 'Nenhuma',
      centroId: undefined as unknown as number,
    },
  });

  useEffect(() => {
    const fetchCentros = async () => {
      try {
        const response = await api.get('/centros/findMany');
        setCentros(response.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCentros();
  }, []);

  const filterCentros = useMemo(() => {
    return centros.filter((c) => {
      const nome = c?.paroquia?.nomeParoquia;
      if (!nome || !paroquiaSelecionada) return false;
      return nome.toLowerCase().trim() === paroquiaSelecionada.toLowerCase().trim();
    });
  }, [centros, paroquiaSelecionada]);

  const paroquiasUnicas = [
    ...new Set(
      centros
        .map((c) => c?.paroquia?.nomeParoquia)
        .filter((nome): nome is string => Boolean(nome)),
    ),
  ];

  const selectClass =
    'w-full border rounded-md px-3 py-2 text-sm h-11 focus:outline-none focus:ring-2 focus:ring-amber-700';

  const fields = [
    {
      label: 'Nome completo',
      content: <Input placeholder="Digite seu nome" className="w-full h-11" />,
    },
    {
      label: 'Data de Nascimento',
      content: <Input type="date" className="w-full h-11" />,
    },
    {
      label: 'E-mail',
      content: <Input placeholder="seu@email.com" className="w-full h-11" />,
    },
    {
      label: 'Telefone / WhatsApp',
      content: <Input placeholder="( +244 ) 922 999 334" className="w-full h-11" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Grid de campos simples */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <label className="text-orange-950 font-medium text-sm">{f.label}</label>
            {f.content}
          </div>
        ))}
      </div>

      {/* Selects em grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-orange-950 font-medium text-sm">Paróquia</label>
          <select
            {...register('nomeParoquia')}
            value={paroquiaSelecionada || 'Nenhuma'}
            onChange={(e) => {
              const paroquia = e.target.value;
              setParoquiaSelecionada(paroquia);
              setValue('nomeParoquia', paroquia);
            }}
            className={selectClass}
          >
            <option value="Nenhuma">Nenhuma</option>
            {paroquiasUnicas.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-orange-950 font-medium text-sm">Centro</label>
          <select
            {...register('centroId', { valueAsNumber: true })}
            className={selectClass}
            onChange={(e) => setValue('centroId', Number(e.target.value))}
          >
            <option value="">Nenhuma</option>
            {filterCentros.map((c) => (
              <option key={c.idCentrosParoquias} value={c.idCentrosParoquias}>
                {c.nomeCentro}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}