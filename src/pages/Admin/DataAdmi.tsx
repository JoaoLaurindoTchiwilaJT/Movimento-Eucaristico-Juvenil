import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Mail,
  Phone,
  KeyRound,
  ShieldCheck,
  Save,
  UserCircle,
  Clock,
  Lightbulb,
} from 'lucide-react';
import { useState } from 'react';

export default function Actualizar() {
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6 pt-6 pb-10">
      {/* CABEÇALHO */}
      <div className="px-4 sm:px-10">
        <h1 className="text-xl font-black text-amber-800">
          Actualizar dados
        </h1>
        <div className="bg-amber-800 w-10 h-1 rounded-md mt-1" />
      </div>

      <div className="px-4 sm:px-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* COLUNA PRINCIPAL — FORMULÁRIOS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
        {/* DADOS DE CONTACTO */}
        <section className="flex flex-col gap-6 bg-white p-5 md:p-8 rounded-xl shadow-md">
          <div>
            <h2 className="text-lg font-semibold text-amber-800">
              Dados de contacto
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Estas informações são usadas para o identificar e contactar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-amber-800"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@gmail.com"
                  className="pl-9 focus-visible:ring-amber-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="telefone"
                className="text-sm font-medium text-amber-800"
              >
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700/60" />
                <Input
                  id="telefone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={13}
                  placeholder="+244 9XX XXX XXX"
                  className="pl-9 focus-visible:ring-amber-700 no-spinner"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end pt-2 border-t border-gray-100">
            <Button className="bg-amber-700 hover:bg-amber-800 transition-all active:scale-[0.97] w-full sm:w-auto px-6 cursor-pointer">
              <Save className="mr-2 h-4 w-4" />
              Salvar dados
            </Button>
          </div>
        </section>

        {/* SEGURANÇA */}
        <section className="flex flex-col gap-6 bg-white p-5 md:p-8 rounded-xl shadow-md">
          <div>
            <h2 className="text-lg font-semibold text-amber-800">
              Segurança — Alterar senha
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Escolha uma senha forte que não tenha usado antes.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="senhaActual"
              className="text-sm font-medium text-amber-800"
            >
              Senha actual
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700/60" />
              <Input
                id="senhaActual"
                type="password"
                placeholder="Introduza a senha actual"
                className="pl-9 focus-visible:ring-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="novaSenha"
                className="text-sm font-medium text-amber-800"
              >
                Nova senha
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700/60" />
                <Input
                  id="novaSenha"
                  type="password"
                  placeholder="Nova senha"
                  className="pl-9 focus-visible:ring-amber-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmarSenha"
                className="text-sm font-medium text-amber-800"
              >
                Confirmar senha
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700/60" />
                <Input
                  id="confirmarSenha"
                  type="password"
                  placeholder="Repita a senha"
                  className="pl-9 focus-visible:ring-amber-700"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 -mt-2">
            Mínimo de 8 caracteres, com pelo menos uma letra e um número.
          </p>

          {showPasswordSuccess && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              Senha actualizada com sucesso.
            </p>
          )}

          <div className="w-full flex justify-end pt-2 border-t border-gray-100">
            <Button
              onClick={() => setShowPasswordSuccess(true)}
              className="bg-amber-700 hover:bg-amber-800 transition-all active:scale-[0.97] w-full sm:w-auto px-6 cursor-pointer"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar senha
            </Button>
          </div>
        </section>
        </div>

        {/* COLUNA LATERAL */}
        <div className="flex flex-col gap-6">
          {/* RESUMO DA CONTA */}
          <section className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-xl shadow-md">
            <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center">
              <UserCircle className="h-12 w-12 text-amber-700" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">A tua conta</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Mantém os teus dados sempre actualizados.
              </p>
            </div>
            <div className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-3 mt-1">
              <Clock className="h-3.5 w-3.5" />
              Última actualização: há 3 dias
            </div>
          </section>

          {/* DICAS DE SEGURANÇA */}
          <section className="flex flex-col gap-4 bg-amber-50 p-6 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-700" />
              <h3 className="font-semibold text-amber-800">
                Dicas de segurança
              </h3>
            </div>
            <ul className="text-sm text-amber-900/80 flex flex-col gap-2.5 list-disc pl-4">
              <li>Usa uma senha diferente da que usas noutros sites.</li>
              <li>Combina letras, números e símbolos.</li>
              <li>Nunca partilhes a tua senha com ninguém.</li>
              <li>Actualiza o teu contacto para recuperares o acesso mais fácil.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}