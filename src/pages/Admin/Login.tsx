import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import logotipo from '@/assets/logotipo.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { type LoginUserSchemas, LoginUserSchema } from '@/types/Schemas';
import { LoginUserMember } from '@/services/AdminService';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginUserSchemas>({
    resolver: zodResolver(LoginUserSchema),
  });

  const navigate = useNavigate();

  useEffect(() => {
    setValue('email', '');
    setValue('password', '');
  }, []);

  async function LoginUser(data: LoginUserSchemas) {
    try {
      const response = await LoginUserMember(data);

      if (response.message === true) {
        navigate('/Dashboard');
      }
    } catch (error) {
      console.error('Erro no login:', error);
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* PAINEL ESQUERDO — visível só no md+ */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-amber-300 px-6 py-10">
        <div className="text-center text-amber-900 max-w-md">
          <img
            src={logotipo}
            alt="Logotipo"
            className="w-28 lg:w-36 h-auto object-contain mx-auto mb-6"
          />
          <h1 className="font-extrabold text-3xl lg:text-4xl">Bem-vindo</h1>
          <p className="text-lg lg:text-xl mt-3">
            "Tudo por vós, Sagrado Coração de Jesus!"
          </p>
        </div>
      </div>

      {/* PAINEL DIREITO — formulário */}
      <div className="flex w-full md:w-1/2 min-h-screen items-center justify-center px-5 py-10 bg-white">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          {/* Logo só no mobile */}
          <img
            src={logotipo}
            alt="Logotipo"
            className="w-24 sm:w-28 h-auto object-contain md:hidden"
          />

          <div className="w-full">
            <h2 className="text-2xl font-bold text-amber-800 text-center">
              Login
            </h2>
            <p className="text-sm text-gray-400 text-center mt-1">
              Insira as suas credenciais para continuar
            </p>
          </div>

          <form
            onSubmit={handleSubmit(LoginUser)}
            className="flex flex-col w-full gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-amber-800">
                E-mail
              </label>
              <Input
                className="w-full h-12 text-base"
                placeholder="exemplo@email.com"
                {...register('email')}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-amber-800">
                Password
              </label>
              <Input
                type="password"
                className="w-full h-12 text-base"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-amber-400 text-base hover:bg-amber-500 transition cursor-pointer mt-2"
            >
              Entrar
            </Button>
            <a
              href=""
              className="text-amber-700 text-sm text-center hover:underline mt-1"
            >
              Esqueceu a senha?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
