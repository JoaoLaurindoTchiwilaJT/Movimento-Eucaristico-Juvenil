import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import api from '@/services/api';
import {
  CreateMember,
  DeleteMember,
  GetMember,
  UpdateMember,
} from '@/services/membroService';
import { createTypeMembro, type createMembroSchema } from '@/types/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Trash2Icon, UserPlus } from 'lucide-react';

type Paroquia = {
  idParoquia: number;
  nomeParoquia: string;
  quota: number;
};

type Centro = {
  idCentrosParoquias: string;
  nomeCentro: string;
  tipo: string;
  paroquia: Paroquia;
};

type Centros = {
  idCentrosParoquias: number;
  nomeCentro: string;
  tipo: string;
  paroquia: Paroquia;
};

type Membro = {
  idMejista: number;
  nomeMembro: string;
  numeroMembro: string;
  cargo: string;
  promessado: string;
  contacto: number;
  centroId: number;
  centro: Centro;
  nivel: string;
};

export default function Membros() {
  const [dataMembro, setDataMembro] = useState<Membro[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<createMembroSchema>({
    resolver: zodResolver(createTypeMembro),
    defaultValues: {
      promessado: 'Não',
      nomeParoquia: 'Nenhuma',
      centroId: undefined as unknown as number,
    },
  });
  const [paroquiaSelecionada, setParoquiaSelecionada] = useState('');
  const [centros, setCentros] = useState<Centros[]>([]);
  const [memberEdit, setMemberEdit] = useState<Membro | null>(null);

  const isOpenModal = () => setIsOpen(true);

  const closeModal = () => {
    reset();
    setMemberEdit(null);
    setIsOpen(false);
  };

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
      return (
        nome.toLowerCase().trim() === paroquiaSelecionada.toLowerCase().trim()
      );
    });
  }, [centros, paroquiaSelecionada]);

  useEffect(() => {
    if (
      filterCentros.length === 0 ||
      !paroquiaSelecionada ||
      paroquiaSelecionada === 'Nenhuma'
    )
      return;

    if (memberEdit) {
      const centroExisteNaLista = filterCentros.some(
        (c) => c.idCentrosParoquias === memberEdit.centroId,
      );
      if (centroExisteNaLista) {
        setValue('centroId', memberEdit.centroId);
      } else {
        setValue('centroId', filterCentros[0].idCentrosParoquias);
      }
    } else {
      setValue('centroId', filterCentros[0].idCentrosParoquias);
    }
  }, [filterCentros, memberEdit]);

  useEffect(() => {
    const fetchMembros = async () => {
      try {
        const response = await api.get('/user/findMany');
        setDataMembro(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        setDataMembro([]);
      }
    };
    fetchMembros();
  }, []);

  const handleEdit = (item: Membro) => {
    setMemberEdit(item);
    setIsOpen(true);
  };

  useEffect(() => {
    if (memberEdit) {
      const paroquia = memberEdit.centro?.paroquia?.nomeParoquia ?? '';

      setParoquiaSelecionada(paroquia);

      setValue('nomeMembro', memberEdit.nomeMembro);
      setValue('cargo', memberEdit.cargo);
      setValue('promessado', memberEdit.promessado as 'Sim' | 'Não');
      setValue('contacto', memberEdit.contacto);
      setValue('nomeParoquia', paroquia);
    }
  }, [memberEdit, setValue]);

  const onDelete = async (idMejista: number) => {
    const result = await DeleteMember(idMejista);

    if (result.success) {
      setDataMembro((prev) =>
        prev.filter((item) => item.idMejista !== idMejista),
      );
    } else {
      alert(result.message);
    }
  };

  const onSubmit = async (data: createMembroSchema) => {
    try {
      if (memberEdit) {
        const body = {
          idMejista: memberEdit.idMejista,
          nomeMembro: data.nomeMembro,
          contacto: data.contacto,
          centroId: data.centroId,
          cargo: data.cargo,
          nivel: data.nivel || 'MEJ',
          promessado: data.promessado,
        };
        await UpdateMember(body);
        const updatedList = await GetMember();
        setDataMembro(updatedList);
        setMemberEdit(null);
      } else {
        await CreateMember(data);
        const created = await GetMember();
        setDataMembro(Array.isArray(created) ? created : []);
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Nomes únicos de paróquias com protecção contra valores undefined
  const paroquiasUnicas = [
    ...new Set(
      centros
        .map((c) => c?.paroquia?.nomeParoquia)
        .filter((nome): nome is string => Boolean(nome)),
    ),
  ];

  return (
    <div className="w-full flex flex-col gap-6 pt-6 pb-10">
      {/* CABEÇALHO + BOTÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-10">
        <div>
          <h1 className="text-xl font-black text-amber-800">Membros</h1>
          <div className="bg-amber-800 w-10 h-1 rounded-md mt-1" />
        </div>
        <Button
          onClick={isOpenModal}
          className="bg-white text-amber-800 shadow cursor-pointer w-full sm:w-auto h-10 px-5"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {/* TABELA */}
      <div className="px-4 sm:px-10">
        <div className="w-full overflow-x-auto rounded-xl shadow-md">
          <Table className="bg-white min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-amber-50 border-b border-gray-300">
                <TableHead className="text-amber-600 font-semibold">
                  Nº
                </TableHead>
                <TableHead className="text-amber-600 font-semibold">
                  Nome
                </TableHead>
                <TableHead className="text-amber-600 font-semibold">
                  Paróquia
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Centro
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Cargo
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Nível
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Promessado
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Contacto
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Acções
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataMembro.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-gray-400"
                  >
                    Nenhum membro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                dataMembro.map((item) => (
                  <TableRow
                    className="hover:bg-gray-50 transition"
                    key={item.idMejista}
                  >
                    <TableCell className="font-medium whitespace-normal break-words">
                      {item.numeroMembro}
                    </TableCell>
                    <TableCell className="font-medium whitespace-normal break-words">
                      {item.nomeMembro}
                    </TableCell>
                    {/* ✅ Optional chaining para evitar crash se centro/paroquia for undefined */}
                    <TableCell>{item.centro?.paroquia?.nomeParoquia}</TableCell>
                    <TableCell className="text-center">
                      {item.centro?.tipo}
                    </TableCell>
                    <TableCell className="text-center">{item.cargo}</TableCell>
                    <TableCell className="text-center">{item.nivel}</TableCell>
                    <TableCell className="text-center">
                      {item.promessado}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.contacto}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        aria-label="Editar membro"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.idMejista)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        aria-label="Eliminar membro"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4 py-6 overflow-y-auto"
          onClick={closeModal}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-2xl bg-white p-5 md:p-8 shadow-2xl rounded-2xl flex flex-col gap-6 my-auto"
          >
            {/* HEADER DO MODAL */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-amber-800">
                  {memberEdit
                    ? 'Actualizar dados do Mejista'
                    : 'Cadastrar Membro'}
                </h1>
                <div className="w-12 h-1 bg-amber-800 rounded-md mt-1" />
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={closeModal}
                className="text-red-500 text-lg hover:bg-red-100 cursor-pointer"
              >
                ✕
              </Button>
            </div>

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ESQUERDA */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-amber-800">
                    Nome do Membro
                  </label>
                  <Input
                    {...register('nomeMembro')}
                    placeholder="Digite o nome"
                    className="mt-1 focus-visible:ring-amber-700"
                  />
                  {errors.nomeMembro && (
                    <span className="text-red-700 text-sm">
                      {errors.nomeMembro.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-amber-800">
                      Paróquia
                    </label>
                    <select
                      {...register('nomeParoquia')}
                      value={paroquiaSelecionada || 'Nenhuma'}
                      onChange={(e) => {
                        const paroquia = e.target.value;
                        setParoquiaSelecionada(paroquia);
                        setValue('nomeParoquia', paroquia);
                      }}
                      className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-700"
                    >
                      <option value="Nenhuma">Nenhuma</option>
                      {/* ✅ Usa a variável pré-computada com protecção */}
                      {paroquiasUnicas.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-amber-800">
                      Centro
                    </label>
                    <select
                      {...register('centroId', { valueAsNumber: true })}
                      className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-700"
                      onChange={(e) =>
                        setValue('centroId', Number(e.target.value))
                      }
                    >
                      <option value="">Nenhuma</option>
                      {filterCentros.map((c) => (
                        <option
                          key={c.idCentrosParoquias}
                          value={c.idCentrosParoquias}
                        >
                          {c.nomeCentro}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* DIREITA */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-amber-800">
                    Cargo
                  </label>
                  <Input
                    {...register('cargo')}
                    placeholder="Digite o cargo"
                    className="mt-1 focus-visible:ring-amber-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-amber-800">
                    Contacto
                  </label>
                  <Input
                    type="number"
                    {...register('contacto', { valueAsNumber: true })}
                    placeholder="Digite o Contacto"
                    className="mt-1 focus-visible:ring-amber-700 no-spinner"
                  />
                </div>
              </div>
            </div>

            {/* LINHA FINAL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-amber-800">
                  Promessado
                </label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 text-sm text-amber-800">
                    <Input
                      type="radio"
                      value="Sim"
                      {...register('promessado')}
                    />
                    Sim
                  </label>
                  <label className="flex items-center gap-2 text-sm text-amber-800">
                    <Input
                      type="radio"
                      value="Não"
                      {...register('promessado')}
                    />
                    Não
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-amber-800">
                  Nível
                </label>
                <select
                  {...register('nivel')}
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-700"
                >
                  <option>Nenhum</option>
                  <option value="AO">A.O</option>
                  <option value="MEJ">MEJ</option>
                  <option value="CE">C.E</option>
                </select>
              </div>
            </div>

            {/* BOTÃO SUBMIT */}
            <Button
              type="submit"
              className="mt-2 bg-amber-700 hover:bg-amber-800 transition-all active:scale-[0.97] w-full cursor-pointer"
            >
              Confirmar
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
