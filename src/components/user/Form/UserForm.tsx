import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import api from '@/services/api';
import {
  type createMembroSchema,
  createTypeMembro,
} from '@/types/Schemas';

// =====================================================
// TIPOS
// =====================================================

type Paroquia = {
  idParoquia: number;
  nomeParoquia: string;
  quota: number;
};

type Centro = {
  idCentrosParoquias: number;
  nomeCentro: string;
  tipo: string;
  paroquia: Paroquia;
};

type UserFormProps = {
  onDataChange: (data: Partial<createMembroSchema>) => void;
};

// =====================================================
// COMPONENTE AUXILIAR
// =====================================================

type CampoProps = {
  id: string;
  label: string;
  erro?: string;
  children: React.ReactNode;
};

function CampoFormulario({
  id,
  label,
  erro,
  children,
}: CampoProps) {
  return (
    <div className="min-w-0 w-full space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {children}

      {erro && (
        <p
          role="alert"
          className="break-words text-xs sm:text-sm text-red-500"
        >
          {erro}
        </p>
      )}
    </div>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const classeSelect =
  'block w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70';

const classeInput = 'w-full min-w-0';

// =====================================================
// FORMULÁRIO
// =====================================================

export default function UserForm({
  onDataChange,
}: UserFormProps) {
  const {
    register,
    watch,
    getValues,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<createMembroSchema>({
    resolver: zodResolver(createTypeMembro),
    defaultValues: {
      promessado: 'Não',
      nomeParoquia: 'Nenhuma',
      nivel: 'MEJ',
    },
  });

  const [centros, setCentros] = useState<Centro[]>([]);
  const [carregandoCentros, setCarregandoCentros] =
    useState(true);
  const [erroCentros, setErroCentros] = useState('');

  const [paroquiaSelecionada, setParoquiaSelecionada] =
    useState('Nenhuma');

  // =====================================================
  // COMUNICAÇÃO COM O COMPONENTE PAI
  // =====================================================

  useEffect(() => {
    const subscription = watch((dados) => {
      onDataChange(
        dados as Partial<createMembroSchema>,
      );
    });

    onDataChange(getValues());

    return () => subscription.unsubscribe();
  }, [watch, getValues, onDataChange]);

  // =====================================================
  // BUSCAR CENTROS
  // =====================================================

  useEffect(() => {
    let activo = true;

    async function buscarCentros() {
      try {
        setCarregandoCentros(true);
        setErroCentros('');

        const resposta = await api.get<Centro[]>(
          '/centros/findMany',
        );

        if (activo) {
          setCentros(
            Array.isArray(resposta.data)
              ? resposta.data
              : [],
          );
        }
      } catch (erro) {
        console.error(
          'Erro ao buscar centros:',
          erro,
        );

        if (activo) {
          setErroCentros(
            'Não foi possível carregar os centros. Tente novamente.',
          );
        }
      } finally {
        if (activo) {
          setCarregandoCentros(false);
        }
      }
    }

    void buscarCentros();

    return () => {
      activo = false;
    };
  }, []);

  // =====================================================
  // PARÓQUIAS DISPONÍVEIS
  // =====================================================

  const paroquias = useMemo(() => {
    const nomes = centros
      .map(
        (centro) =>
          centro.paroquia?.nomeParoquia,
      )
      .filter(
        (nome): nome is string => Boolean(nome),
      );

    return [...new Set(nomes)].sort((a, b) =>
      a.localeCompare(b, 'pt'),
    );
  }, [centros]);

  // =====================================================
  // CENTROS DA PARÓQUIA SELECCIONADA
  // =====================================================

  const centrosFiltrados = useMemo(() => {
    if (
      !paroquiaSelecionada ||
      paroquiaSelecionada === 'Nenhuma'
    ) {
      return [];
    }

    return centros.filter(
      (centro) =>
        centro.paroquia?.nomeParoquia ===
        paroquiaSelecionada,
    );
  }, [centros, paroquiaSelecionada]);

  // =====================================================
  // SELECÇÃO AUTOMÁTICA DO CENTRO
  // =====================================================

  useEffect(() => {
    if (centrosFiltrados.length === 0) {
      resetField('centroId', {
        defaultValue: undefined as unknown as number,
      });

      return;
    }

    const centroActual = getValues('centroId');

    const centroExiste = centrosFiltrados.some(
      (centro) =>
        centro.idCentrosParoquias === centroActual,
    );

    if (!centroExiste) {
      setValue(
        'centroId',
        centrosFiltrados[0].idCentrosParoquias,
        {
          shouldValidate: true,
          shouldDirty: false,
        },
      );
    }
  }, [
    centrosFiltrados,
    getValues,
    resetField,
    setValue,
  ]);

  // =====================================================
  // ALTERAR PARÓQUIA
  // =====================================================

  const handleParoquiaChange = useCallback(
    (
      event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
      const nomeParoquia = event.target.value;

      setParoquiaSelecionada(nomeParoquia);

      setValue('nomeParoquia', nomeParoquia, {
        shouldValidate: true,
        shouldDirty: true,
      });

      resetField('centroId', {
        defaultValue: undefined as unknown as number,
      });
    },
    [resetField, setValue],
  );

  // =====================================================
  // RENDERIZAÇÃO RESPONSIVA
  // =====================================================

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 sm:gap-y-6">

      {/* Nome completo */}
      <div className="min-w-0 sm:col-span-2">
        <CampoFormulario
          id="nomeMembro"
          label="Nome completo"
          erro={errors.nomeMembro?.message}
        >
          <Input
            id="nomeMembro"
            {...register('nomeMembro')}
            placeholder="Introduza o nome completo"
            autoComplete="name"
            className={classeInput}
          />
        </CampoFormulario>
      </div>

      {/* E-mail */}
      <CampoFormulario
        id="email"
        label="E-mail"
        erro={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="Introduza o e-mail"
          autoComplete="email"
          className={classeInput}
        />
      </CampoFormulario>

      {/* Contacto */}
      <CampoFormulario
        id="contacto"
        label="Contacto"
        erro={errors.contacto?.message}
      >
        <Input
          id="contacto"
          type="number"
          {...register('contacto')}
          placeholder="Introduza o contacto"
          autoComplete="tel"
          className={classeInput}
        />
      </CampoFormulario>

      {/* Promessado */}
      <CampoFormulario
        id="promessado"
        label="É promessado?"
        erro={errors.promessado?.message}
      >
        <select
          id="promessado"
          {...register('promessado')}
          className={classeSelect}
        >
          <option value="Não">Não</option>
          <option value="Sim">Sim</option>
        </select>
      </CampoFormulario>

      {/* Nível */}
      <CampoFormulario
        id="nivel"
        label="Nível"
        erro={errors.nivel?.message}
      >
        <select
          id="nivel"
          {...register('nivel')}
          className={classeSelect}
        >
          <option value="Nenhum">Nenhum</option>
          <option value="AO">AO</option>
          <option value="MEJ">MEJ</option>
          <option value="CE">CE</option>
        </select>
      </CampoFormulario>

      {/* Paróquia */}
      <CampoFormulario
        id="nomeParoquia"
        label="Paróquia"
        erro={errors.nomeParoquia?.message}
      >
        <select
          id="nomeParoquia"
          {...register('nomeParoquia')}
          value={paroquiaSelecionada}
          onChange={handleParoquiaChange}
          className={classeSelect}
        >
          <option value="Nenhuma">Nenhuma</option>

          {paroquias.map((paroquia) => (
            <option
              key={paroquia}
              value={paroquia}
            >
              {paroquia}
            </option>
          ))}
        </select>
      </CampoFormulario>

      {/* Centro */}
      <CampoFormulario
        id="centroId"
        label="Centro"
        erro={errors.centroId?.message}
      >
        <select
          id="centroId"
          {...register('centroId', {
            setValueAs: (valor) =>
              valor === ''
                ? undefined
                : Number(valor),
          })}
          disabled={
            carregandoCentros ||
            paroquiaSelecionada === 'Nenhuma' ||
            centrosFiltrados.length === 0
          }
          className={classeSelect}
        >
          <option value="">
            {carregandoCentros
              ? 'A carregar centros...'
              : paroquiaSelecionada === 'Nenhuma'
                ? 'Seleccione primeiro uma paróquia'
                : centrosFiltrados.length === 0
                  ? 'Não existem centros nesta paróquia'
                  : 'Seleccione um centro'}
          </option>

          {centrosFiltrados.map((centro) => (
            <option
              key={centro.idCentrosParoquias}
              value={centro.idCentrosParoquias}
            >
              {centro.nomeCentro}
            </option>
          ))}
        </select>

        {erroCentros && (
          <p
            role="alert"
            className="break-words text-xs text-red-500 sm:text-sm"
          >
            {erroCentros}
          </p>
        )}
      </CampoFormulario>
    </div>
  );
}

