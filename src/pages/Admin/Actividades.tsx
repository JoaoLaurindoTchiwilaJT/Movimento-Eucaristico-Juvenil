import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createTypeActividade, type createActividade } from '@/types/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Actividades() {
  const [dataActiv, setDataActiv] = useState('');
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<createActividade>({
    resolver: zodResolver(createTypeActividade),
  });

  const [isOpen, setIsOpen] = useState(false);
  const isOpenModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  function createActividades(data: createActividade) {
    setDataActiv(JSON.stringify(data));
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-6 pt-8">
        <div className="px-12">
          <h1 className="text-xl font-black text-amber-800">Actividades</h1>
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
          <Table className="w-[65vw] table-fixed bg-white rounded-xl overflow-hidden shadow-md border border-gray-300">
            <TableHeader className="bg-white -100">
              <TableRow className="bg-amber-50 border-b border-gray-300">
                <TableHead className="text-amber-600 font-semibold border-r border-gray-300 px-4 py-2 text-left">
                  Nome
                </TableHead>
                <TableHead className="text-amber-600 font-semibold border-r border-gray-300 px-4 py-2 text-left">
                  Paróquia
                </TableHead>
                <TableHead className="text-amber-600 font-semibold border-r border-gray-300 px-4 py-2 text-center">
                  Data
                </TableHead>
                <TableHead className="text-amber-600 font-semibold border-r border-gray-300 px-4 py-2 text-left">
                  Descrição
                </TableHead>
                <TableHead className="text-amber-600 font-semibold px-4 py-2 text-center">
                  Acções
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow className="hover:bg-gray-50 transition border-b border-gray-200">
                <TableCell className="font-medium border-r border-gray-200 px-4 py-2 break-words whitespace-normal">
                  Procissão do Corpo e Sangue
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-2 break-words whitespace-normal">
                  Sagrada Familia
                </TableCell>
                <TableCell className="text-center border-r border-gray-200 px-4 py-2">
                  20/03/2026
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-2 max-w-[250px] break-words whitespace-normal">
                  A procissão do corpo e sangue é uma actividade que é celebrada
                  no mês de Novembro.
                </TableCell>
                <TableCell className="text-center px-4 py-2 space-x-2">
                  <button className="text-blue-600 hover:underline font-semibold">
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline font-semibold">
                    Eliminar
                  </button>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-gray-50 transition border-b border-gray-200">
                <TableCell className="font-medium border-r border-gray-200 px-4 py-2 break-words whitespace-normal">
                  Festa de São João
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-2 break-words whitespace-normal">
                  Nossa Senhora do Carmo
                </TableCell>
                <TableCell className="text-center border-r border-gray-200 px-4 py-2 break-words whitespace-normal">
                  24/06/2026
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-2 max-w-[250px] break-words whitespace-normal">
                  Celebração tradicional com música, dança e comidas típicas.
                </TableCell>
                <TableCell className="text-center px-4 py-2 space-x-2">
                  <button className="text-blue-600 hover:underline font-semibold">
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline font-semibold">
                    Eliminar
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <form
            onSubmit={handleSubmit(createActividades)}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-amber-800">
                  Cadastrar Actividade
                </h1>
                <div className="w-26 h-1 bg-amber-800 rounded-md mt-1" />
              </div>

              <Button
                variant="ghost"
                onClick={closeModal}
                className="text-red-500 text-lg hover:bg-red-100 cursor-pointer"
              >
                ✕
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="nome"
                className="text-sm font-medium text-amber-800"
              >
                Nome da Actividade
              </label>
              <Input
                {...register('nomeActividade')}
                placeholder="Nome da actividade"
                className="focus-visible:ring-amber-700 outline-none"
              />
              {errors.nomeActividade && (
                <span className="text-red-700">
                  {errors.nomeActividade.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="local"
                className="text-sm font-medium text-amber-800"
              >
                Localização
              </label>
              <Input
                {...register('localizacao')}
                placeholder="Localização da igreja"
                className="focus-visible:ring-amber-700 outline-none"
              />
              {errors.localizacao && (
                <span className="text-red-700">
                  {errors.localizacao.message}
                </span>
              )}
            </div>

            <div className="flex gap-5">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-amber-800">
                  Data
                </label>

                <div className="border rounded-lg p-3">
                  <Controller
                    name="dataActiv"
                    control={control}
                    render={({ field }) => (
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(date?.toISOString().split('T')[0]); // armazena como string 'YYYY-MM-DD'
                        }}
                        disabled={{ before: new Date() }}
                      />
                    )}
                  />
                  {errors.dataActiv && (
                    <span className="text-red-700">
                      {errors.dataActiv.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <label
                  htmlFor="descricao"
                  className="text-sm font-medium text-amber-800"
                >
                  Descrição
                </label>
                <Textarea
                  id="descricao"
                  {...register('descricao')}
                  placeholder="Descrição da actividade"
                  className="border rounded-lg h-full  focus-visible:ring-amber-700"
                />
                {errors.descricao && (
                  <span className="text-red-700">
                    {errors.descricao.message}
                  </span>
                )}
              </div>
            </div>
            <Button className="mt-10 mb-5 bg-amber-800 hover:bg-amber-900 transition-all active:scale-[0.98] cursor-pointer">
              Confirmar
            </Button>
          </form>
          <pre>{dataActiv}</pre>
        </div>
      )}
    </div>
  );
}
