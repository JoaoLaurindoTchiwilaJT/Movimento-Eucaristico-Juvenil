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
import { createTypeMembro, type createMembroSchema } from '@/types/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Membros() {
  const [dataMembro, setDataMembro] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createMembroSchema>({ resolver: zodResolver(createTypeMembro), defaultValues: {
    promessado: 'não',
  }, },);
  const isOpenModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  function createMembro(data: createMembroSchema) {
    setDataMembro(JSON.stringify(data));
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-6 pt-8">
        <div className="px-12">
          <h1 className="text-xl font-black text-amber-800">Membros</h1>
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
                  Promessado
                </TableHead>
                <TableHead className="text-amber-600 font-semibold text-center">
                  Acções
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow className="hover:bg-gray-50 transition">
                <TableCell className="font-medium break-words whitespace-normal">
                  090348955SA090
                </TableCell>
                <TableCell className="font-medium break-words whitespace-normal">
                  João Laurindo Chilepa Tchiwila
                </TableCell>
                <TableCell>Santa Mãe de Deus</TableCell>
                <TableCell className="text-center">Sede</TableCell>
                <TableCell className="text-center">Sim</TableCell>

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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <form
            onSubmit={handleSubmit(createMembro)}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white p-6 shadow-2xl rounded-xl flex flex-col gap-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-semibold text-amber-800">
                  Cadastrar Membro
                </h1>
                <div className="w-16 h-1 bg-amber-800 rounded-md mt-1" />
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
                Nome do Membro
              </label>
              <Input
                {...register('nomeMembro')}
                placeholder="Digite o nome"
                className="focus-visible:ring-amber-700"
              />
              {errors.nomeMembro && (
                <span className="text-red-700">
                  {errors.nomeMembro.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="paroquia"
                  className="text-sm font-medium text-amber-800"
                >
                  Paróquia
                </label>
                <select
                  id="paroquia"
                  {...register('nomeParoquia')}
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
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="centro"
                  className="text-sm font-medium text-amber-800"
                >
                  Centro
                </label>
                <select
                  id="centro"
                  {...register('nomeCentro')}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
                >
                  <option>Nenhuma</option>
                  <option>Mãe de Deus Centro Sede</option>
                </select>
                {errors.nomeCentro && (
                  <span className="text-red-700">
                    {errors.nomeCentro.message}
                  </span>
                )}
              </div>
            </div>
            <label className="text-sm font-medium text-amber-800">Cargo</label>
            <Input
              placeholder="Digite o cargo"
              className="focus-visible:ring-amber-700"
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-amber-800">
                Promessado
              </label>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-amber-800">
                  <Input type="radio" value="sim" {...register('promessado')} />
                  Sim
                </label>

                <label className="flex items-center gap-2 text-sm text-amber-800">
                  <Input type="radio" value="não" {...register('promessado')} />
                  Não
                </label>
              </div>
            </div>
            <Button className="mt-10 mb-5 bg-amber-700 hover:bg-amber-800 transition-all active:scale-[0.98] cursor-pointer">
              Confirmar
            </Button>
          </form>
          <pre>{dataMembro}</pre>
        </div>
      )}
    </div>
  );
}
