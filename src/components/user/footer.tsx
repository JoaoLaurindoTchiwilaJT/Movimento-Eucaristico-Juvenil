import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { AxiosError } from 'axios';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  LoaderCircle,
  Send,
} from 'lucide-react';

import type { createMembroSchema } from '@/types/Schemas';
import { createTypeMembro } from '@/types/Schemas';
import { CreateMember } from '@/services/membroService';

import { Button } from '../ui/button';
import UserForm from './Form/UserForm';
import ReviewForm from './Form/ReviewForm';
import ThanksForm from './Form/Thanks';

const steps = ['Dados pessoais', 'Interesses', 'Confirmação'];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex w-full items-center">
      {steps.map((label, index) => {
        const concluido = index < currentStep;
        const activo = index === currentStep;

        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  concluido
                    ? 'border-amber-400 bg-amber-400 text-white'
                    : activo
                      ? 'border-amber-400 bg-white text-amber-600'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {concluido ? '✓' : index + 1}
              </div>

              <span
                className={`text-center text-[10px] sm:text-xs ${
                  activo || concluido
                    ? 'font-medium text-amber-600'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-1 mb-5 h-0.5 flex-1 ${
                  index < currentStep ? 'bg-amber-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Footer() {
  const [currentStep, setCurrentStep] = useState(0);

  const [dadosCadastro, setDadosCadastro] = useState<
    Partial<createMembroSchema>
  >({});

  const [interesse, setInteresse] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  const [erroCadastro, setErroCadastro] = useState('');

  // Recebe e acumula os dados enviados pelo UserForm.
  const atualizarDados = useCallback((dados: Partial<createMembroSchema>) => {
    console.log('[CADASTRO] Dados recebidos do UserForm:', dados);

    setDadosCadastro((anterior) => {
      const novosDados = {
        ...anterior,
        ...dados,
      };

      console.log('[CADASTRO] Dados acumulados:', novosDados);

      return novosDados;
    });

    setErroCadastro('');
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErroCadastro('');

    // Etapas 1 e 2: avançar sem enviar o cadastro para o servidor.
    if (currentStep < 2) {
      if (currentStep === 1 && !interesse.trim()) {
        setErroCadastro('Selecciona uma área de interesse para continuar.');
        console.warn('[CADASTRO] Nenhuma área de interesse seleccionada.');
        return;
      }

      console.log('[CADASTRO] Avançando de etapa:', {
        etapaAtual: currentStep,
        proximaEtapa: currentStep + 1,
        dadosCadastro,
        interesse,
      });

      setCurrentStep((anterior) => anterior + 1);
      return;
    }

    // Etapa 3: validar e enviar o cadastro.
    console.group('[CADASTRO] Validação final');

    console.log('Dados completos recebidos:', dadosCadastro);
    console.log('Área de interesse seleccionada:', interesse);

    const resultado = createTypeMembro.safeParse(dadosCadastro);

    if (!resultado.success) {
      const erros = resultado.error.issues.map((issue) => {
        const campo = issue.path.map(String).join('.') || 'formulario';

        return {
          campo,
          valorRecebido: dadosCadastro[campo as keyof typeof dadosCadastro],
          mensagem: issue.message,
          codigo: issue.code,
        };
      });

      console.error('[CADASTRO] Existem campos inválidos:', erros);

      console.error('[CADASTRO] Detalhes completos do Zod:', resultado.error);

      console.table(erros);

      console.log(
        '[CADASTRO] Dados recebidos para comparação:',
        JSON.stringify(dadosCadastro, null, 2),
      );

      console.groupEnd();

      setErroCadastro(
        `Existem ${erros.length} erro(s) nos dados do cadastro. Abre a consola do navegador (F12) para identificar os campos.`,
      );

      return;
    }

    console.log('[CADASTRO] Validação concluída com sucesso.');
    console.log('[CADASTRO] Dados validados para envio:', resultado.data);

    console.groupEnd();

    try {
      setCarregando(true);

      // Envia somente dados validados pelo schema.
      const resposta = await CreateMember(resultado.data);

      console.log('[CADASTRO] Resposta do servidor:', resposta);

      setCadastroConcluido(true);
    } catch (error: unknown) {
      console.group('[CADASTRO] Erro ao enviar os dados');

      if (error instanceof AxiosError) {
        console.error('Mensagem:', error.message);
        console.error('Código HTTP:', error.response?.status);
        console.error('Resposta da API:', error.response?.data);
        console.error('URL:', error.config?.url);
        console.error('Método:', error.config?.method);
      } else {
        console.error('Erro inesperado:', error);
      }

      console.error('Dados que foram enviados:', resultado.data);

      console.groupEnd();

      setErroCadastro(
        error instanceof AxiosError
          ? error.response?.data?.message ||
              'Não foi possível cadastrar o membro. Verifica a consola para mais detalhes.'
          : 'Ocorreu um erro inesperado durante o cadastro.',
      );
    } finally {
      setCarregando(false);
    }
  };

  const voltar = () => {
    if (carregando) return;

    setErroCadastro('');
    setCurrentStep((anterior) => Math.max(0, anterior - 1));
  };

  return (
    <footer className="flex flex-col gap-5">
      <section className="bg-amber-400 p-4 sm:p-6 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-5 text-orange-950">
            <div>
              <h1 className="text-2xl font-bold">Cadastrar-se</h1>

              <p className="mt-2 text-sm">
                Faça parte dessa missão! Juntos, podemos transformar o mundo com
                o amor de Cristo.
              </p>
            </div>

            <div>
              <h2 className="font-semibold">Encontre uma comunidade</h2>
              <p className="text-sm">Participe de grupos perto de você.</p>
            </div>

            <div>
              <h2 className="font-semibold">Comunidade</h2>
              <p className="text-sm">
                Participe de grupos e crie novas amizades.
              </p>
            </div>

            <div>
              <h2 className="font-semibold">Fé</h2>
              <p className="text-sm">Fortaleça a sua vida espiritual.</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-[400px] w-full min-w-0 flex-col gap-5 rounded-lg bg-white p-4 shadow-sm sm:p-6 md:p-8"
          >
            {!cadastroConcluido && <StepIndicator currentStep={currentStep} />}

            {/*
              Mantém o UserForm montado para preservar os valores
              do React Hook Form entre as etapas.
            */}
            <div
              className={
                currentStep === 0 && !cadastroConcluido ? 'block' : 'hidden'
              }
            >
              <UserForm onDataChange={atualizarDados} />
            </div>

            {!cadastroConcluido && currentStep === 1 && (
              <ReviewForm
                selectedInterest={interesse}
                onInterestChange={(valor) => {
                  setInteresse(valor);
                  setErroCadastro('');
                  console.log(
                    '[CADASTRO] Área de interesse seleccionada:',
                    valor,
                  );
                }}
              />
            )}

            {!cadastroConcluido && currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-950">
                  <CheckCircle className="text-amber-600" />
                  <h2 className="font-semibold">Confirmar cadastro</h2>
                </div>

                <p className="text-sm text-gray-600">
                  Revê os dados pessoais e a área de interesse antes de concluir
                  a inscrição.
                </p>

                <div className="space-y-2 rounded-md bg-amber-50 p-4 text-sm">
                  <p>
                    <strong>Nome:</strong>{' '}
                    {dadosCadastro.nomeMembro || 'Não preenchido'}
                  </p>

                  <p>
                    <strong>Paróquia:</strong>{' '}
                    {dadosCadastro.nomeParoquia || 'Não seleccionada'}
                  </p>

                  <p>
                    <strong>Centro ID:</strong>{' '}
                    {dadosCadastro.centroId ?? 'Não seleccionado'}
                  </p>

                  <p>
                    <strong>Contacto:</strong>{' '}
                    {dadosCadastro.contacto ?? 'Não preenchido'}
                  </p>

                  <p>
                    <strong>Cargo:</strong>{' '}
                    {dadosCadastro.cargo || 'Não preenchido'}
                  </p>

                  <p>
                    <strong>Nível:</strong>{' '}
                    {dadosCadastro.nivel || 'Não preenchido'}
                  </p>

                  <p>
                    <strong>Promessado:</strong>{' '}
                    {dadosCadastro.promessado || 'Não seleccionado'}
                  </p>

                  <p>
                    <strong>Email:</strong>{' '}
                    {dadosCadastro.email || 'Não preenchido'}
                  </p>

                  <p>
                    <strong>Interesse:</strong>{' '}
                    {interesse || 'Não seleccionado'}
                  </p>
                </div>
              </div>
            )}

            {cadastroConcluido && <ThanksForm />}

            {erroCadastro && !cadastroConcluido && (
              <p
                role="alert"
                className="rounded-md bg-red-50 p-3 text-sm text-red-700"
              >
                {erroCadastro}
              </p>
            )}

            {!cadastroConcluido && (
              <div className="mt-auto flex flex-wrap justify-between gap-3 border-t pt-4">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={carregando}
                    onClick={voltar}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  type="submit"
                  disabled={carregando}
                  className="bg-orange-950 text-white hover:bg-orange-900"
                >
                  {carregando ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />A
                      cadastrar...
                    </>
                  ) : currentStep < 2 ? (
                    <>
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Confirmar
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </section>
    </footer>
  );
}
