import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import api from '@/services/api';
import {
  CadastrarCentro,
  DeleteCentro,
  GetCentro,
  UpdateCentro,
} from '@/services/centroService';
import { createTypeCentro, type createCentroSchema } from '@/types/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Edit, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Paroquia = {
  idParoquia: number;
  nomeParoquia: string;
  quota: number;
};

type Centro = {
  idCentrosParoquias: string;
  nomeCentro: string;
  coordenador: string;
  paroquia: Paroquia;
  totalPromessados: number;
  totalNaoPromessados: number;
};

export default function Centros() {
  const [dataCentro, setDataCentro] = useState<Centro[]>([]);
  const [centroEdit, setCentroEdit] = useState<Centro | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<createCentroSchema>({ resolver: zodResolver(createTypeCentro) });

  const isOpenModal = () => setIsOpen(true);

  const closeModal = () => {
    reset();
    setCentroEdit(null);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchCentros = async () => {
      try {
        const response = await api.get('/centros/findMany');
        setDataCentro(response.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    fetchCentros();
  }, []);

  const handleEdit = (item: Centro) => {
    setCentroEdit(item);
    setIsOpen(true);
  };

  useEffect(() => {
    if (centroEdit) {
      setValue('nomeCentro', centroEdit.nomeCentro);
      setValue('idParoquia', centroEdit.paroquia.idParoquia);
    }
  }, [centroEdit]);

  const onSubmit = async (data: createCentroSchema) => {
    try {
      if (centroEdit) {
        const body = {
          idCentrosParoquias: centroEdit.idCentrosParoquias,
          ...data,
        };
        const update = await UpdateCentro(body);
        setDataCentro((prev) =>
          prev.map((item) =>
            item.idCentrosParoquias === centroEdit.idCentrosParoquias
              ? { ...item, ...update }
              : item,
          ),
        );
        setCentroEdit(null);
      } else {
        await CadastrarCentro(data);
        const created = await GetCentro();
        setDataCentro(created);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao cadastrar centro:', error);
      alert('Erro ao cadastrar centro');
    }
  };

  const onDelete = async (idCentrosParoquias: string) => {
    const result = await DeleteCentro(idCentrosParoquias);
    if (result.success) {
      setDataCentro((prev) =>
        prev.filter((item) => item.idCentrosParoquias !== idCentrosParoquias),
      );
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pt-6 pb-10">

      {/* CABEÇALHO + BOTÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-10">
        <div>
          <h1 className="text-xl font-black text-amber-800">Centros</h1>
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
          <Table className="bg-white min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-amber-50 border-b border-gray-300">
                <TableHead className="text-amber-600 font-semibold">Nome</TableHead>
                <TableHead className="text-amber-600 font-semibold">Coordenador</TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">Paróquia</TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">Nº Promessados</TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">Nº Não Promessados</TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">Acções</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataCentro.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-400">
                    Nenhum centro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                dataCentro.map((item) => (
                  <TableRow
                    className="hover:bg-gray-50 transition"
                    key={item.idCentrosParoquias}
                  >
                    <TableCell className="font-medium whitespace-normal break-words">
                      {item.nomeCentro}
                    </TableCell>
                    <TableCell>{item.coordenador}</TableCell>
                    <TableCell className="text-center">
                      {item.paroquia.nomeParoquia}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.totalPromessados}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {item.totalNaoPromessados}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        aria-label="Editar centro"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.idCentrosParoquias)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        aria-label="Eliminar centro"
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
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-6 overflow-y-auto"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 flex flex-col gap-4 my-auto"
          >
            {/* HEADER DO MODAL */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-amber-800 text-xl font-semibold">
                  {centroEdit ? 'Editar Centro' : 'Cadastrar Centro'}
                </h1>
                <div className="w-10 h-1 bg-amber-800 rounded-md mt-1" />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="text-red-500 text-lg hover:bg-red-100 cursor-pointer"
                onClick={closeModal}
              >
                ✕
              </Button>
            </div>

            {/* NOME DO CENTRO */}
            <div className="flex flex-col gap-1">
              <label className="text-amber-800 text-sm font-medium">
                Nome do Centro
              </label>
              <Input
                {...register('nomeCentro')}
                placeholder="Nome do Centro"
                className="focus-visible:ring-amber-700"
              />
              {errors.nomeCentro && (
                <span className="text-red-700 text-sm">
                  {errors.nomeCentro.message}
                </span>
              )}
            </div>

            {/* PARÓQUIA */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="paroquia"
                className="text-sm font-medium text-amber-800"
              >
                Paróquia
              </label>
              <select
                {...register('idParoquia', { valueAsNumber: true })}
                id="paroquia"
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
              >
                {dataCentro.map((item) => (
                  <option
                    key={item.paroquia.idParoquia}
                    value={item.paroquia.idParoquia}
                  >
                    {item.paroquia.nomeParoquia}
                  </option>
                ))}
              </select>
              {errors.idParoquia && (
                <span className="text-red-700 text-sm">
                  {errors.idParoquia.message}
                </span>
              )}
            </div>

            {/* BOTÃO SUBMIT */}
            <Button
              type="submit"
              className="mt-4 bg-amber-700 hover:bg-amber-800 transition-all active:scale-[0.98] cursor-pointer"
            >
              Confirmar
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}