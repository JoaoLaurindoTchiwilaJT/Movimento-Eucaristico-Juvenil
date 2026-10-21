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
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createTypeActividade, type createActividade } from '@/types/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon } from 'lucide-react';
import { CreateActividade, DeleteActividade, getManyActividade, UpdateActividade } from '@/services/actividadeService';
import api from '@/services/api';

// Categorias disponíveis (mesmas usadas nos filtros da página pública)
const CATEGORIAS = [
  'Espiritualidade',
  'Formacao',
  'Missao',
  'Acampamento',
] as const;
type Categoria = (typeof CATEGORIAS)[number];

// Estado da actividade
const ESTADOS = ['Aberta', 'Encerrada'] as const;
type Estado = (typeof ESTADOS)[number];

// Regras de validação das imagens
const MAX_IMAGENS = 10;
const MAX_TAMANHO_MB = 5;
const MAX_TAMANHO_BYTES = MAX_TAMANHO_MB * 1024 * 1024;

// No formulário: File = nova imagem; string = URL de uma imagem já existente.
type ArquivoItem = File | string;

// Os arquivos existentes precisam conservar o ID que vem do backend.
type ArquivoExistente = {
  idArquivo?: number;
  urlfile: string;
};

// Actividade = dados do formulário + identificador da actividade e arquivos com os seus IDs.
type Actividade = Omit<createActividade, 'arquivo'> & {
  id: number;
  arquivo: ArquivoExistente[];
};

const categoriaCorMap: Record<Categoria, string> = {
  Espiritualidade: 'bg-red-50 text-red-600 border-red-200',
  Formacao: 'bg-green-50 text-green-600 border-green-200',
  Missao: 'bg-blue-50 text-blue-600 border-blue-200',
  Acampamento: 'bg-amber-50 text-amber-700 border-amber-200',
};

function CategoriaBadge({ categoria }: { categoria: Categoria }) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${categoriaCorMap[categoria]}`}
    >
      {categoria}
    </span>
  );
}

function EstadoBadge({ estado }: { estado: Estado }) {
  const cor =
    estado === 'Aberta'
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'bg-gray-100 text-gray-600 border-gray-300';
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${cor}`}
    >
      {estado}
    </span>
  );
}

// Formata 'YYYY-MM-DD' para 'DD/MM/YYYY'
function formatarData(data: string) {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Compara dois ficheiros para detectar duplicados
function mesmoFicheiro(a: File, b: File) {
  return (
    a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
  );
}

function ImagemThumb({
  src,
  alt,
  className,
  emptyLabel,
}: {
  src?: File | string | null;
  alt: string;
  className?: string;
  emptyLabel?: string;
}) {
  const [falhou, setFalhou] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);

  useEffect(() => {
    setFalhou(false);

    if (!src) {
      setResolvedSrc(null);
      return;
    }

    if (typeof src === 'string') {
      setResolvedSrc(src);
      return;
    }

    // src é um File: cria um object URL temporário e liberta-o na limpeza
    const url = URL.createObjectURL(src);
    setResolvedSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [src]);

  const semImagem = !resolvedSrc || falhou;

  if (semImagem) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-50 text-gray-300 gap-2 ${className}`}
      >
        <ImageIcon className="h-6 w-6" />
        {emptyLabel && <span className="text-sm">{emptyLabel}</span>}
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFalhou(true)}
    />
  );
}

export default function Actividades() {
  const [dataActividades, setDataActividades] = useState<Actividade[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<createActividade>({
    resolver: zodResolver(createTypeActividade),
    defaultValues: { arquivo: [] },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [actividadeEdit, setActividadeEdit] = useState<Actividade | null>(null);

  // IDs dos arquivos existentes que o utilizador marcou explicitamente para eliminar.
  // Um array permite enviar um único ID ou vários IDs no mesmo update.
  const [idsArquivosEliminar, setIdsArquivosEliminar] = useState<number[]>([]);

  // Avisos de validação das imagens (ficheiros rejeitados ao seleccionar)
  const [imagemErros, setImagemErros] = useState<string[]>([]);
  // Erro ao enviar o formulário para o servidor
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const isOpenModal = () => {
    setActividadeEdit(null);
    setIdsArquivosEliminar([]);
    setImagemErros([]);
    setErroEnvio(null);
    reset({
      nomeActividade: '',
      localizacao: '',
      dataActiv: '',
      descricao: '',
      categoria: '',
      estado: '',
      arquivo: [],
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    reset({ arquivo: [] });
    setActividadeEdit(null);
    setIdsArquivosEliminar([]);
    setImagemErros([]);
    setErroEnvio(null);
    setIsOpen(false);
  };

  
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await api.get('/actividade/getManyActividade');
        const resultado = response.data;

        console.log('Resposta do backend:', resultado);

        const lista = Array.isArray(resultado?.data)
          ? resultado.data
          : Array.isArray(resultado)
            ? resultado
            : [];

        const actividadesConvertidas: Actividade[] = lista.map((item: any) => {
          const arquivosRecebidos = Array.isArray(item.arquivos)
            ? item.arquivos
            : Array.isArray(item.arquivo)
              ? item.arquivo
              : Array.isArray(item.fileUrls)
                ? item.fileUrls
                : Array.isArray(item.imagens)
                  ? item.imagens
                  : [];

          const arquivos: ArquivoExistente[] = arquivosRecebidos
            .map((arquivo: any) => {
              if (typeof arquivo === 'string') {
                // Formato antigo sem ID: pode ser mostrado, mas não pode ser apagado por ID.
                return { urlfile: arquivo };
              }

              const urlfile =
                typeof arquivo?.urlfile === 'string'
                  ? arquivo.urlfile
                  : typeof arquivo?.url === 'string'
                    ? arquivo.url
                    : '';

              if (!urlfile.trim()) return null;

              const idArquivo = Number(arquivo?.idArquivo ?? arquivo?.id);
              return {
                ...(Number.isInteger(idArquivo) && idArquivo > 0
                  ? { idArquivo }
                  : {}),
                urlfile,
              };
            })
            .filter((arquivo: ArquivoExistente | null): arquivo is ArquivoExistente => arquivo !== null);

          return {
            id: Number(item.idActividades ?? item.id),
            nomeActividade: item.nomeActividade ?? '',
            localizacao: item.localizacao ?? '',
            dataActiv: item.dataActiv
              ? String(item.dataActiv).split('T')[0]
              : item.data
                ? String(item.data).split('T')[0]
                : '',
            descricao: item.descricao ?? '',
            categoria:
              item.categoria === 'Missão' ? 'Missao' :
              item.categoria === 'Formação' ? 'Formacao' :
              item.categoria ?? '',
            estado: item.estado ?? '',
            arquivo: arquivos,
          } as Actividade;
        });

        console.log('Actividades convertidas:', actividadesConvertidas);
        setDataActividades(actividadesConvertidas);
      } catch (error) {
        console.error('Erro ao carregar actividades:', error);
        setDataActividades([]);
      }
    };

    fetchActividades();
  }, []);
  
  // Preenche todos os campos de uma só vez ao abrir a edição.
  // O formulário usa as URLs dos arquivos existentes; os IDs ficam guardados
  // em actividadeEdit.arquivo para identificar eliminações.
  const handleEdit = (item: Actividade) => {
    setIdsArquivosEliminar([]);
    setImagemErros([]);
    setErroEnvio(null);

    reset({
      nomeActividade: item.nomeActividade ?? '',
      localizacao: item.localizacao ?? '',
      dataActiv: item.dataActiv ? String(item.dataActiv).split('T')[0] : '',
      descricao: item.descricao ?? '',
      categoria:
        item.categoria === 'Missão' ? 'Missao' :
        item.categoria === 'Formação' ? 'Formacao' :
        item.categoria,
      estado: item.estado ?? '',
      arquivo: (item.arquivo ?? []).map((arquivo) => arquivo.urlfile),
    });

    setActividadeEdit(item);
    setIsOpen(true);
  };

  const onDelete = async (id: number) => {
   await DeleteActividade(String(id));
   setDataActividades((prev) => prev.filter((item) => item.id !== id));
  };

  // Valida os ficheiros escolhidos e junta os válidos aos já existentes
  const handleArquivosChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    atuais: ArquivoItem[],
    onChange: (value: ArquivoItem[]) => void,
  ) => {
    const novos = Array.from(e.target.files ?? []);
    if (novos.length === 0) return;

    const avisos: string[] = [];
    const aceites: File[] = [];
    const ficheirosAtuais = atuais.filter((a): a is File => a instanceof File);
    let total = atuais.length;

    for (const file of novos) {
      if (!file.type.startsWith('image/')) {
        avisos.push(`"${file.name}" não é uma imagem e foi ignorado.`);
        continue;
      }

      if (file.size > MAX_TAMANHO_BYTES) {
        avisos.push(
          `"${file.name}" excede o tamanho máximo de ${MAX_TAMANHO_MB} MB.`,
        );
        continue;
      }

      const duplicado = [...ficheirosAtuais, ...aceites].some((f) =>
        mesmoFicheiro(f, file),
      );
      if (duplicado) {
        avisos.push(`"${file.name}" já foi seleccionada.`);
        continue;
      }

      if (total >= MAX_IMAGENS) {
        avisos.push(
          `Limite de ${MAX_IMAGENS} imagens atingido. "${file.name}" foi ignorada.`,
        );
        continue;
      }

      aceites.push(file);
      total++;
    }

    setImagemErros(avisos);
    if (aceites.length > 0) onChange([...atuais, ...aceites]);

    // permite voltar a escolher o mesmo ficheiro
    e.target.value = '';
  };

  const removerArquivo = (
    index: number,
    atuais: ArquivoItem[],
    onChange: (value: ArquivoItem[]) => void,
  ) => {
    setImagemErros([]);

    const arquivoRemovido = atuais[index];

    // Só registamos o ID se o item removido for uma imagem existente (URL).
    // Remover um File acabado de seleccionar não envia ID para o backend.
    if (typeof arquivoRemovido === 'string' && actividadeEdit) {
      const existente = actividadeEdit.arquivo.find(
        (arquivo) => arquivo.urlfile === arquivoRemovido,
      );

      if (existente?.idArquivo) {
        setIdsArquivosEliminar((prev) =>
          prev.includes(existente.idArquivo!)
            ? prev
            : [...prev, existente.idArquivo!],
        );
      }
    }

    onChange(atuais.filter((_, i) => i !== index));
  };

  // Mensagem de erro do schema para o campo arquivo (lista vazia, item inválido, etc.)
  const arquivoErroMsg = (() => {
    const err = errors.arquivo as
      | {
          message?: string;
          root?: { message?: string };
          [key: number]: { message?: string } | undefined;
        }
      | undefined;
    if (!err) return null;
    if (err.message) return err.message;
    if (err.root?.message) return err.root.message;
    return 'Seleccione pelo menos uma imagem válida';
  })();

  const createActividades = async (data: createActividade) => {
    setErroEnvio(null);

    try {
      if (actividadeEdit) {
        // Enviamos o ID da actividade e apenas os IDs dos arquivos marcados
        // para eliminação. Os arquivos que continuam no formulário não são apagados.
        // As URLs existentes não são reenviadas como novos uploads.
        const arquivosFormulario = (data.arquivo ?? []) as ArquivoItem[];
        const novosArquivos = arquivosFormulario.filter(
          (arquivo): arquivo is File => arquivo instanceof File,
        );

        const payloadUpdate = {
          ...data,
          idActividades: actividadeEdit.id,
          ...(idsArquivosEliminar.length > 0
            ? {
                // Quando um ou mais arquivos forem eliminados, enviamos "true"
                // e os IDs exactos que o backend deve eliminar.
                idArquivo:
                  idsArquivosEliminar.length === 1
                    ? idsArquivosEliminar[0]
                    : idsArquivosEliminar,
                
              }
            : {
            
              }),
          arquivo: novosArquivos,
        };

        await UpdateActividade(payloadUpdate as any);

        // Actualiza a lista local sem remover arquivos que não foram seleccionados.
        setDataActividades((prev) =>
          prev.map((item) => {
            if (item.id !== actividadeEdit.id) return item;

            const arquivosMantidos = item.arquivo.filter(
              (arquivo) =>
                !arquivo.idArquivo ||
                !idsArquivosEliminar.includes(arquivo.idArquivo),
            );

            return {
              ...item,
              nomeActividade: data.nomeActividade,
              localizacao: data.localizacao,
              dataActiv: data.dataActiv,
              descricao: data.descricao,
              categoria: data.categoria,
              estado: data.estado,
              arquivo: arquivosMantidos,
            };
          }),
        );

        // Volta a consultar a API para obter os URLs/IDs actualizados após o upload.
        const respostaActualizada = await api.get('/actividade/getManyActividade');
        const resultadoActualizado = respostaActualizada.data;
        const listaActualizada = Array.isArray(resultadoActualizado?.data)
          ? resultadoActualizado.data
          : Array.isArray(resultadoActualizado)
            ? resultadoActualizado
            : [];

        const actividadesActualizadas: Actividade[] = listaActualizada.map((item: any) => {
          const recebidos = Array.isArray(item.arquivos)
            ? item.arquivos
            : Array.isArray(item.arquivo)
              ? item.arquivo
              : [];
          const arquivos: ArquivoExistente[] = recebidos
            .map((arquivo: any) => {
              if (typeof arquivo === 'string') return { urlfile: arquivo };
              const urlfile = arquivo?.urlfile ?? arquivo?.url;
              if (typeof urlfile !== 'string' || !urlfile.trim()) return null;
              const idArquivo = Number(arquivo?.idArquivo ?? arquivo?.id);
              return {
                ...(Number.isInteger(idArquivo) && idArquivo > 0 ? { idArquivo } : {}),
                urlfile,
              };
            })
            .filter((arquivo: ArquivoExistente | null): arquivo is ArquivoExistente => arquivo !== null);

          return {
            id: Number(item.idActividades ?? item.id),
            nomeActividade: item.nomeActividade ?? '',
            localizacao: item.localizacao ?? '',
            dataActiv: item.dataActiv
              ? String(item.dataActiv).split('T')[0]
              : item.data
                ? String(item.data).split('T')[0]
                : '',
            descricao: item.descricao ?? '',
            categoria:
              item.categoria === 'Missão' ? 'Missao' :
              item.categoria === 'Formação' ? 'Formacao' :
              item.categoria ?? '',
            estado: item.estado ?? '',
            arquivo: arquivos,
          } as Actividade;
        });

        setDataActividades(actividadesActualizadas);
      } else {
        // Cria uma nova actividade
        console.log('Chegou');
        await CreateActividade(data);
        const result = await getManyActividade();

        setDataActividades(result);
      }
      closeModal();
    } catch {
      setErroEnvio(
        'Não foi possível guardar a actividade. Verifique a ligação e tente novamente.',
      );
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-6 pt-8 pb-10">
        {/* CABEÇALHO + BOTÃO */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-10">
          <div>
            <h1 className="text-xl font-black text-amber-800">Actividades</h1>
            <div className="bg-amber-800 w-10 h-1 rounded-md mt-1" />
          </div>
          <Button
            onClick={isOpenModal}
            className="bg-white text-amber-800 text-xl shadow cursor-pointer w-full sm:w-auto h-10 px-5"
          >
            Adicionar
          </Button>
        </div>

        {/* TABELA */}
        <div className="px-4 sm:px-10">
          {/* Versão em cartões — visível abaixo de md */}
          <div className="flex flex-col gap-4 md:hidden">
            {dataActividades.length === 0 ? (
              <div className="text-center py-6 text-gray-400 bg-white rounded-xl border border-gray-200">
                Nenhuma actividade encontrada
              </div>
            ) : (
              dataActividades.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col"
                >
                  <ImagemThumb
                    src={item.arquivo?.[0]?.urlfile ?? null}
                    alt={item.nomeActividade}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-gray-800">
                        {item.nomeActividade}
                      </h3>
                      <EstadoBadge estado={item.estado as Estado} />
                    </div>
                    <p className="text-sm text-gray-600">{item.localizacao}</p>
                    <p className="text-sm text-gray-500">
                      {formatarData(item.dataActiv)}
                    </p>
                    <p className="text-sm text-gray-600 wrap-break-word">
                      {item.descricao}
                    </p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-1">
                      <CategoriaBadge categoria={item.categoria as Categoria} />
                      <div className="space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:underline font-semibold text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:underline font-semibold text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Versão em tabela — visível a partir de md */}
          <div className="hidden md:block w-full overflow-x-auto rounded-xl shadow-md">
            <Table className="bg-white min-w-245 table-fixed border border-gray-300">
              <TableHeader>
                <TableRow className="bg-amber-50 border-b border-gray-300">
                  <TableHead className="text-amber-600 font-semibold border-r border-gray-300 px-4 py-2 text-center w-24">
                    Imagem
                  </TableHead>
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
                  <TableHead className="text-amber-600 font-semibold border-r border-gray-300 px-4 py-2 text-center">
                    Categoria
                  </TableHead>
                  <TableHead className="text-amber-600 font-semibold border-r border-gray-300 px-4 py-2 text-center">
                    Estado
                  </TableHead>
                  <TableHead className="text-amber-600 font-semibold px-4 py-2 text-center">
                    Acções
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dataActividades.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-gray-400"
                    >
                      Nenhuma actividade encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  dataActividades.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 transition border-b border-gray-200"
                    >
                      <TableCell className="border-r border-gray-200 px-2 py-2">
                        <ImagemThumb
                          src={item.arquivo?.[0]?.urlfile ?? null}
                          alt={item.nomeActividade}
                          className="w-16 h-16 object-cover rounded-lg mx-auto"
                        />
                      </TableCell>
                      <TableCell className="font-medium border-r border-gray-200 px-4 py-2 wrap-break-words whitespace-normal">
                        {item.nomeActividade}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 px-4 py-2 wrap-break-word whitespace-normal">
                        {item.localizacao}
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 px-4 py-2">
                        {formatarData(item.dataActiv)}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 px-4 py-2 max-w-62.5 wrap-break-words whitespace-normal">
                        {item.descricao}
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 px-4 py-2">
                        <CategoriaBadge
                          categoria={item.categoria as Categoria}
                        />
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 px-4 py-2">
                        <EstadoBadge estado={item.estado as Estado} />
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 cursor-pointer hover:underline font-semibold "
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:underline font-semibold cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4 py-6 overflow-y-auto"
          onClick={closeModal}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(createActividades)}
            className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-5 md:p-8 flex flex-col gap-6 my-auto"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg md:text-2xl font-semibold text-amber-800">
                  {actividadeEdit
                    ? 'Actualizar Actividade'
                    : 'Cadastrar Actividade'}
                </h1>
                <div className="w-26 h-1 bg-amber-800 rounded-md mt-1" />
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

            {/* IMAGENS DA ACTIVIDADE */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-amber-800">
                Imagens da Actividade
              </label>
              <Controller
                name="arquivo"
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                  const arquivos = (field.value ?? []) as ArquivoItem[];
                  const limiteAtingido = arquivos.length >= MAX_IMAGENS;

                  return (
                    <div className="flex flex-col gap-3">
                      {arquivos.length === 0 ? (
                        <ImagemThumb
                          src={null}
                          alt="Pré-visualização da actividade"
                          className="w-full h-44 rounded-lg border border-gray-200"
                          emptyLabel="Nenhuma imagem seleccionada"
                        />
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {arquivos.map((arq, index) => (
                            <div
                              key={
                                typeof arq === 'string'
                                  ? `url-${arq}`
                                  : `file-${arq.name}-${arq.size}-${arq.lastModified}`
                              }
                              className="relative"
                            >
                              <ImagemThumb
                                src={arq}
                                alt={`Imagem ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              {index === 0 && (
                                <span className="absolute bottom-1 left-1 text-[10px] font-medium bg-amber-700 text-white px-1.5 py-0.5 rounded">
                                  Capa
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  removerArquivo(
                                    index,
                                    arquivos,
                                    field.onChange,
                                  )
                                }
                                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow cursor-pointer"
                                aria-label={`Remover imagem ${index + 1}`}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={limiteAtingido}
                        onChange={(e) =>
                          handleArquivosChange(e, arquivos, field.onChange)
                        }
                        className="text-sm text-amber-800 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:font-medium hover:file:bg-amber-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />

                      <span className="text-xs text-gray-500">
                        {arquivos.length} de {MAX_IMAGENS} imagens · máx.{' '}
                        {MAX_TAMANHO_MB} MB cada · a primeira é a capa
                      </span>
                    </div>
                  );
                }}
              />

              {/* Avisos de ficheiros rejeitados */}
              {imagemErros.length > 0 && (
                <ul className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-2 flex flex-col gap-1">
                  {imagemErros.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              )}

              {/* Erro do schema (ex.: nenhuma imagem seleccionada) */}
              {arquivoErroMsg && (
                <span className="text-red-700 text-sm">{arquivoErroMsg}</span>
              )}
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

            <div className="flex flex-col sm:flex-row gap-5">
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
                  className="border rounded-lg h-full focus-visible:ring-amber-700"
                />
                {errors.descricao && (
                  <span className="text-red-700">
                    {errors.descricao.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-medium text-amber-800">
                  Categoria
                </label>
                <Controller
                  name="categoria"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="border rounded-lg px-3 py-2 focus-visible:ring-amber-700 outline-none"
                    >
                      <option value="">Selecione a categoria</option>
                      {CATEGORIAS.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.categoria && (
                  <span className="text-red-700">
                    {errors.categoria.message}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-medium text-amber-800">
                  Estado
                </label>
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="border rounded-lg px-3 py-2 focus-visible:ring-amber-700 outline-none"
                    >
                      <option value="">Selecione o estado</option>
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.estado && (
                  <span className="text-red-700">{errors.estado.message}</span>
                )}
              </div>
            </div>

            {/* Erro ao enviar para o servidor */}
            {erroEnvio && (
              <div
                role="alert"
                className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
              >
                {erroEnvio}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 bg-amber-700 hover:bg-amber-800 transition-all active:scale-[0.97] w-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'A guardar...' : 'Confirmar'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
