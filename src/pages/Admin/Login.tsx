import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import logotipo from '@/assets/logotipo.png';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type LoginUserSchemas, LoginUserSchema } from '@/types/Schemas';



export default function Login() {
  const [datas, setDatas] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserSchemas>({
    resolver: zodResolver(LoginUserSchema),
  });

  function LoginUser(data: LoginUserSchemas) {
    setDatas(JSON.stringify(data, null, 2));
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center bg-amber-300">
        <div className="text-center text-red-800">
          <h1 className="font-extrabold text-4xl">Bem-vindo</h1>
          <p className="text-xl">"Tudo por voz, Sagrado Coração de Jesus!"</p>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="grid gap-4 w-80 items-center justify-items-center  mb-14">
          <img
            src={logotipo}
            alt="Logotipo"
            className="w-36 h-auto object-contain"
          />
          <form
            action=""
            className="flex flex-col w-90 gap-6"
            onSubmit={handleSubmit(LoginUser)}
          >
            <Input
              className="w-full h-10"
              placeholder="E-mail"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
            <Input
              className="w-full h-10"
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
            <Button
              type="submit"
              className="w-full h-10 bg-amber-400 cursor-pointer text-base"
            >
              Login
            </Button>
          </form>

          <pre>{datas}</pre>
        </div>
      </div>
    </div>
  );
}
