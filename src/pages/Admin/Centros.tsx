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
import { createTypeCentro, type createCentroSchema } from '@/types/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Centros() {
  const [dataCentro, setDataCentro] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createCentroSchema>({ resolver: zodResolver(createTypeCentro) });
  const isOpenModal = () => setIsOpen(true);
  const CloseModal = () => setIsOpen(false);

  function createCentro(data: createCentroSchema) {
    setDataCentro(JSON.stringify(data));
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-6 pt-8">
        <div className="px-12">
          <h1 className="text-xl font-black text-amber-800">Centros</h1>
          <div className="bg-amber-800 w-35 h-1 rounded-md"></div>
        </div>
        <div className="w-screen flex max-w-[80vw] justify-end px-50 ">
          <Button
            onClick={isOpenModal}
            className="bg-white text-[#F91D1D] text-xl shadow cursor-pointer w-45 h-10"
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
                  Paróquia
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Nº Promessados
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Nº Não Promessados
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Acções
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow className="hover:bg-gray-50 transition">
                <TableCell className="font-medium break-words whitespace-normal">
                  Santa Mãe de Deus centro sede
                </TableCell>
                <TableCell>Francisco Pedro Tchiwila</TableCell>
                <TableCell className="text-center">Santa Mãe de Deus</TableCell>
                <TableCell className="text-center">10</TableCell>
                <TableCell className="text-center font-semibold ">5</TableCell>

                <TableCell className="text-center space-x-2">
                  <button className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </TableCell>
              </TableRow>
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
            action=""
            onSubmit={handleSubmit(createCentro)}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 flex flex-col gap-4"
          >
            <div className="flex justify-between">
              <div className="mb-4">
                <h1 className="text-amber-800 text-xl font-semibold">
                  Cadastrar Centros
                </h1>
                <div className="w-35 h-1 bg-amber-800 rounded-md"></div>
              </div>
              <Button
                variant="ghost"
                className="text-red-500 text-lg hover:bg-red-100 cursor-pointer"
                onClick={CloseModal}
              >
                ✕
              </Button>
            </div>
            <label htmlFor="" className="text-amber-800 text-sm font-medium">
              Nome do Centro
            </label>
            <Input
              {...register('nomeCentro')}
              placeholder="Nome do Centro"
              className="focus-visible:ring-amber-700 outline:none"
            ></Input>
            {errors.nomeCentro && (
              <span className="text-red-700">{errors.nomeCentro.message}</span>
            )}
            <label
              htmlFor="paroquia"
              className="text-sm font-medium text-amber-800"
            >
              Paróquia
            </label>
            <select
              {...register('nomeParoquia')}
              id="paroquia"
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
            >
              <option>Nenhuma</option>
              <option>Santa Mãe de Deus</option>
            </select>
            {errors.nomeParoquia && (
              <span className="text-red-700">
                {errors.nomeParoquia.message}
              </span>
            )}
            <Button className="mt-10 mb-5 bg-amber-700 hover:bg-amber-800 transition-all active:scale-[0.98] cursor-pointer">
              Confirmar
            </Button>
          </form>
          <pre>{dataCentro}</pre>
        </div>
      )}
    </div>
  );
}
