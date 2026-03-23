import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createTypeParoquia, type createParoquiaSchema } from '@/types/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CadastraParoquia,
  DeleteParoquia,
  GetParoquia,
  UpdateParoquia,
} from '@/services/paroquiaService';
import api from '@/services/api';

type Paroquia = {
  idParoquia: string;
  nomeParoquia: string;
  totalPromessados: number;
  totalNaoPromessados: number;
  quota: number;
};

export default function Paroquias() {
  const [dataParoquia, setDataParoquia] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<createParoquiaSchema>({
    resolver: zodResolver(createTypeParoquia),
  });
  const [paroquiaEdit, setParoquiaEdit] = useState<Paroquia | null>(null);
 const { reset } = useForm();

  const isOpenModal = () => setIsOpen(true);
   const CloseModal = () => {
    reset();
    setParoquiaEdit(null);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchParoquias = async () => {
      try {
        const response = await api.get('/paroquias/findMany');
        setDataParoquia(response.data);
      } catch (error) {
        console.log('Error to get Paróquias', error);
      }
    };

    fetchParoquias();
  }, []);


  const handleEdit = (item: Paroquia) => {
    setParoquiaEdit(item);
    setIsOpen(true);
  };

  useEffect(() => {
    if (paroquiaEdit) {
      setValue('nomeParoquia', paroquiaEdit.nomeParoquia);
      setValue('quota', paroquiaEdit.quota);
    }
  }, [paroquiaEdit]);

  const onSubmit = async (data: createParoquiaSchema) => {
    try {
      console.log(data);
      if (paroquiaEdit) {
        const body = { idParoquia: paroquiaEdit.idParoquia, ...data };

        const updated = await UpdateParoquia(body);

        setDataParoquia((prev) =>
          prev.map((item) =>
            item.idParoquia === paroquiaEdit.idParoquia
              ? { ...item, ...updated }
              : item,
          ),
        );

        setParoquiaEdit(null);
      } else {
        await CadastraParoquia(data);
        const created = await GetParoquia();
        setDataParoquia(created);
      }

      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (idParoquia: string) => {
    try {
      await DeleteParoquia(idParoquia);

      setDataParoquia((prev) =>
        prev.filter((item) => item.idParoquia !== idParoquia),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-6 pt-8">
        <div className="px-12">
          <h1 className="text-xl font-black text-amber-800">Paróquias</h1>
          <div className="bg-amber-800 w-35 h-1 rounded-md"></div>
        </div>
        <div className="w-screen flex max-w-[80vw] justify-end px-50 ">
          <Button
            className="bg-white text-[#F91D1D] text-xl shadow cursor-pointer w-45 h-10"
            onClick={isOpenModal}
          >
            Adicionar
          </Button>
        </div>
        <div className="bg-slate-5 w-full flex flex-col items-center justify-center p-4">
          <Table className="w-[65vw] bg-white rounded-xl overflow-hidden shadow-md">
            <TableHeader className="bg-white -100">
              <TableRow className="bg-amber-50 border-b border-gray-300">
                <TableHead className="text-amber-600 font-semibold">
                  Nome
                </TableHead>
                <TableHead className="text-amber-600 font-semibold">
                  Coordenador
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Nº Promessados
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Nº Não Promessados
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Quota
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Acções
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataParoquia.map((item) => (
                <TableRow className="hover:bg-gray-50 transition">
                  <TableCell className="font-medium break-words whitespace-normal">
                    {item.nomeParoquia}
                  </TableCell>
                  <TableCell>{} Sem coordenador</TableCell>
                  <TableCell className="text-center">
                    {item.totalPromessados}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.totalNaoPromessados}
                  </TableCell>

                  <TableCell className="text-center font-semibold text-green-600">
                    {item.quota} kz
                  </TableCell>

                  <TableCell className="text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(item.idParoquia)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 flex flex-col gap-4"
          >
            <div className="flex  justify-between">
              <div className="mb-2">
                <h1 className="text-amber-800 text-2xl font-semibold">
                  {paroquiaEdit ? 'Editar Paróquia' : 'Cadastrar Paróquia'}
                </h1>
                <div className="bg-amber-800 w-16 h-1 rounded-md mt-1"></div>
              </div>
              <Button
                variant="ghost"
                className="text-red-500 text-lg hover:bg-red-100 cursor-pointer"
                onClick={CloseModal}
              >
                ✕
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-amber-800 text-sm font-medium">
                Nome da Paróquia
              </label>
              <Input
                {...register('nomeParoquia')}
                placeholder="Nome da Paróquia"
                className="focus-visible:ring-amber-700 outline:none"
              />
              {errors.nomeParoquia && (
                <span className="text-red-700">
                  {errors.nomeParoquia.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-amber-800 text-sm font-medium">
                Quota
              </label>
              <Input
                type="number"
                placeholder="Valor da quota  paga"
                className="focus-visible:ring-amber-700 outline:none"
                {...register('quota', { valueAsNumber: true })}
              />
              {errors.quota && (
                <span className="text-red-700">{errors.quota.message}</span>
              )}
            </div>

            <Button
              type="submit"
              className="mt-10 mb-5 bg-amber-700 hover:bg-amber-800 transition-all active:scale-[0.98] cursor-pointer"
            >
              Confirmar
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
