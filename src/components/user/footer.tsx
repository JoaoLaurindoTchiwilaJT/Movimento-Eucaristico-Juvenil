import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import type { createMembroSchema } from '@/types/Schemas';

import logotipo from '@/assets/logotipo.png';
import amigos from '@/assets/amigos.png';

import { NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Church,
  Facebook,
  HeartHandshake,
  Instagram,
  Send,
  Target,
  UserPlus,
  Users,
  Youtube,
} from 'lucide-react';

import { Button } from '../ui/button';
import UserForm from './Form/UserForm';
import ReviewForm from './Form/ReviewForm';
import ThanksForm from './Form/Thanks';
import useForm from '@/hooks/useForm';

const steps = [
  { label: 'Dados pessoais' },
  { label: 'Interesses' },
  { label: 'Confirmação' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                  isDone
                    ? 'bg-amber-400 border-amber-400 text-white'
                    : isActive
                      ? 'bg-white border-amber-400 text-amber-500'
                      : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </div>

              <span
                className={`text-xs whitespace-nowrap ${
                  isDone || isActive
                    ? 'text-amber-500 font-medium'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mb-5 rounded transition-all duration-300 ${
                  i < currentStep ? 'bg-amber-400' : 'bg-gray-200'
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
  // Dados partilhados entre as etapas do formulário.
  const [dadosCadastro, setDadosCadastro] = useState<
    Partial<createMembroSchema>
  >({});

  const [interesse, setInteresse] = useState('');

  // Mantém os dados anteriores e actualiza apenas os campos recebidos.
  const atualizarDados = useCallback((dados: Partial<createMembroSchema>) => {
    setDadosCadastro((anterior) => ({
      ...anterior,
      ...dados,
    }));
  }, []);

  const formComponents = [
    <UserForm key="dados-pessoais" onDataChange={atualizarDados} />,
    <ReviewForm
      key="interesses"
      selectedInterest={interesse}
      onInterestChange={setInteresse}
    />,
    <ThanksForm key="confirmacao" />,
  ];

  const { currentStep, currentComponent, changeStep, isLastStep, isFirstStep } =
    useForm(formComponents);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLastStep) {
      changeStep(currentStep + 1);
      return;
    }

    // Os dados ficam disponíveis para ligar à rota real de cadastro.
    // Não é enviada uma requisição porque a rota da API não foi fornecida.
    console.log('Dados pessoais:', dadosCadastro);
    console.log('Interesse seleccionado:', interesse);
  };

  return (
    <footer className="flex flex-col gap-5">
      {/* Cadastramento */}
      <section className="bg-amber-400">
        <div className="flex flex-col lg:flex-row items-center justify-around p-4 md:p-8 gap-8">
          {/* Informações */}
          <div className="flex flex-col w-full lg:w-auto">
            <div className="flex flex-col p-4 md:p-6">
              <h1 className="font-semibold text-xl text-orange-950">
                Cadastrar-se
              </h1>

              <p className="text-black font-medium text-sm">
                Faça parte dessa missão! Juntos, podemos transformar{' '}
                <br className="hidden md:block" />o mundo com o amor de Cristo.
              </p>
            </div>

            <div className="flex items-center gap-4 p-3 md:p-4">
              <Target size={32} className="text-white shrink-0" />
              <div>
                <h1 className="font-semibold text-lg text-orange-950">
                  Encontre uma comunidade
                </h1>
                <p className="text-black font-medium text-sm">
                  Participe de grupos perto de você.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 md:p-4">
              <Users size={32} className="text-white shrink-0" />
              <div>
                <h1 className="font-semibold text-lg text-orange-950">
                  Comunidade
                </h1>
                <p className="text-black font-medium text-sm">
                  Participe de grupos perto de você.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 md:p-4">
              <Church size={32} className="text-white shrink-0" />
              <div>
                <h1 className="font-semibold text-lg text-orange-950">Fé</h1>
                <p className="text-black font-medium text-sm">
                  Fortaleça a sua vida espiritual.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 md:p-4">
              <HeartHandshake size={32} className="text-white shrink-0" />
              <div>
                <h1 className="font-semibold text-lg text-orange-950">
                  Amizade
                </h1>
                <p className="text-black font-medium text-sm">
                  Crie novas amizades e conexões.
                </p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="w-full lg:w-auto">
            <form
              className="bg-white p-6 md:p-8 flex flex-col rounded-md gap-4 w-full lg:w-[800px] lg:h-[500px]"
              onSubmit={handleSubmit}
            >
              <div className="flex justify-center">
                <StepIndicator currentStep={currentStep} />
              </div>

              <div>{currentComponent}</div>

              <div className="actions flex justify-between p-2 md:p-4">
                {!isFirstStep && (
                  <Button
                    type="button"
                    className="text-white bg-orange-950 cursor-pointer text-base h-10 rounded-md w-36 md:w-40"
                    onClick={() => changeStep(currentStep - 1)}
                  >
                    <ArrowLeft size={24} />
                    <span>Voltar</span>
                  </Button>
                )}

                {!isLastStep ? (
                  <Button
                    type="submit"
                    className="text-white bg-orange-950 cursor-pointer text-base h-10 rounded-md w-36 md:w-40 ml-auto"
                  >
                    <span>Continuar</span>
                    <ArrowRight size={24} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="text-white bg-orange-950 cursor-pointer text-base h-10 rounded-md w-36 md:w-40 ml-auto"
                  >
                    <span>Confirmar</span>
                    <Send size={24} />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Publicidade */}
      <section className="p-4">
        <div className="bg-orange-950 relative rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-center md:justify-around items-center gap-6 md:gap-4 min-h-[160px]">
          <img
            src={amigos}
            alt=""
            className="hidden md:block h-48 absolute left-20 top-1"
          />

          <div className="md:ml-90 text-center md:text-left">
            <h1 className="text-yellow-400 text-3xl font-bold">Faça parte!</h1>

            <p className="text-white">
              Jovens que se encontram com Cristo,{' '}
              <br className="hidden md:block" />
              transformam o mundo
            </p>
          </div>

          <button
            type="button"
            className="bg-yellow-400 cursor-pointer flex p-4 gap-2 rounded-full text-orange-950 h-10 justify-center items-center whitespace-nowrap"
          >
            <UserPlus />
            Cadastrar-se agora!
          </button>
        </div>
      </section>

      {/* Logo, links e redes sociais */}
      <div className="w-full flex flex-col md:flex-row justify-around items-start gap-8 px-6 pb-4">
        <div>
          <div className="flex justify-center items-center gap-6">
            <img src={logotipo} className="w-30 h-30" alt="" />

            <h1 className="text-orange-950 font-bold text-xl">
              Movimento <br />
              Eucarístico <br />
              Juvenil
            </h1>
          </div>

          <p className="text-orange-950 font-medium text-xl mt-2">
            Tudo por vós,
            <br />
            Sagrado Coração de Jesus!
          </p>
        </div>

        {/* Links rápidos */}
        <div className="flex flex-col gap-3">
          <h1 className="text-orange-950 font-bold text-xl">Links Rápidos</h1>

          <NavLink to="">Inicio</NavLink>
          <NavLink to="">Sobre</NavLink>
          <NavLink to="">Actividades</NavLink>
          <NavLink to="">Loja</NavLink>
          <NavLink to="">Cadastrar</NavLink>
        </div>

        {/* Redes sociais */}
        <div className="flex flex-col gap-4">
          <h1 className="text-orange-950 font-bold text-xl">Redes Sociais</h1>

          <div className="flex gap-4">
            <NavLink className="bg-orange-950 rounded-full flex p-2" to="">
              <Instagram className="text-white" />
            </NavLink>

            <NavLink className="bg-orange-950 rounded-full flex p-2" to="">
              <Facebook className="text-white" />
            </NavLink>

            <NavLink className="bg-orange-950 rounded-full flex p-2" to="">
              <Youtube className="text-white" />
            </NavLink>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-orange-950 text-white min-h-10 flex justify-center items-center text-center px-4 py-2 text-sm">
        &copy; 2026 Movimento Eucarístico Juvenil - MEJ. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
