import { useState, type KeyboardEvent } from "react";
import { Mail, KeyRound, Lock, CheckCircle2, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, label: "E-mail" },
  { id: 2, label: "Código" },
  { id: 3, label: "Nova senha" },
  { id: 4, label: "Concluído" },
];

export default function RecuperarSenha() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    codigo: ["", "", "", "", "", ""],
    novaSenha: "",
    confirmarSenha: "",
  });
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [erro, setErro] = useState("");

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleEmailSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setErro("Digite um e-mail válido.");
      return;
    }
    setErro("");
    goNext();
  };

  const handleCodigoChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const novoCodigo = [...form.codigo];
    novoCodigo[index] = value;
    setForm({ ...form, codigo: novoCodigo });

    if (value && index < 5) {
      const proximo = document.getElementById(`codigo-${index + 1}`);
      if (proximo) proximo.focus();
    }
  };

  const handleCodigoKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !form.codigo[index] && index > 0) {
      const anterior = document.getElementById(`codigo-${index - 1}`);
      if (anterior) anterior.focus();
    }
  };

  const handleCodigoSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (form.codigo.some((d) => d === "")) {
      setErro("Preencha todos os dígitos do código.");
      return;
    }
    setErro("");
    goNext();
  };

  const handleSenhaSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (form.novaSenha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (form.novaSenha !== form.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    setErro("");
    goNext();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FEFCE8] p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl border-2 border-amber-300 shadow-lg p-8 sm:p-10">
        {/* Indicador de passos */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step === s.id
                      ? "bg-orange-500 text-white"
                      : step > s.id
                      ? "bg-orange-200 text-orange-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s.id ? <CheckCircle2 size={18} /> : s.id}
                </div>
                <span
                  className={`text-xs font-medium ${
                    step === s.id ? "text-orange-600" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    step > s.id ? "bg-orange-300" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {erro && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {erro}
          </div>
        )}

        {/* Passo 1: E-mail */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                <Mail className="text-orange-500" size={26} />
              </div>
            </div>
            <h1 className="text-xl font-bold text-center text-gray-800 mb-2">
              Recuperar senha
            </h1>
            <p className="text-sm text-gray-500 text-center mb-6">
              Digite o e-mail cadastrado para receber o código de verificação.
            </p>

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 mb-6"
            />

            <Button
              type="submit"
              className="w-full cursor-pointer bg-[#5C2E0F] hover:bg-[#4a2409] text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
            >
              Enviar código <ArrowRight size={18} />
            </Button>
          </form>
        )}

        {/* Passo 2: Código de verificação */}
        {step === 2 && (
          <form onSubmit={handleCodigoSubmit}>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                <KeyRound className="text-orange-500" size={26} />
              </div>
            </div>
            <h1 className="text-xl font-bold text-center text-gray-800 mb-2">
              Verifique seu e-mail
            </h1>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enviamos um código de 6 dígitos para{" "}
              <span className="font-medium text-gray-700">{form.email}</span>
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {form.codigo.map((digito, index) => (
                <input
                  key={index}
                  id={`codigo-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digito}
                  onChange={(e) => handleCodigoChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodigoKeyDown(index, e)}
                  className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                />
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mb-6">
              Não recebeu?{" "}
              <button
                type="button"
                className="text-orange-600 font-semibold hover:underline"
              >
                Reenviar código
              </button>
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={goBack}
                className="flex-1 border border-gray-300 bg-white cursor-pointer text-[#4a2409] font-semibold rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={18} /> Voltar
              </Button>
              <Button
                type="submit"
                className="flex-1 cursor-pointer bg-[#5C2E0F] hover:bg-[#4a2409] text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
              >
                Continuar <ArrowRight size={18} />
              </Button>
            </div>
          </form>
        )}

        {/* Passo 3: Nova senha */}
        {step === 3 && (
          <form onSubmit={handleSenhaSubmit}>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                <Lock className="text-orange-500" size={26} />
              </div>
            </div>
            <h1 className="text-xl font-bold text-center text-gray-800 mb-2">
              Crie uma nova senha
            </h1>
            <p className="text-sm text-gray-500 text-center mb-6">
              Use pelo menos 8 caracteres, misturando letras e números.
            </p>

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nova senha
            </label>
            <div className="relative mb-4">
              <input
                type={showSenha ? "text" : "password"}
                placeholder="Digite sua nova senha"
                value={form.novaSenha}
                onChange={(e) => setForm({ ...form, novaSenha: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
              />
              <Button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirmar senha
            </label>
            <div className="relative mb-6">
              <input
                type={showConfirmar ? "text" : "password"}
                placeholder="Repita a nova senha"
                value={form.confirmarSenha}
                onChange={(e) =>
                  setForm({ ...form, confirmarSenha: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
              />
              <Button
                type="button"
                onClick={() => setShowConfirmar(!showConfirmar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={goBack}
                className="flex-1 border cursor-pointer bg-white border-gray-300 text-gray-700 font-semibold rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={18} /> Voltar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#5C2E0F] hover:bg-[#4a2409] text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
              >
                Redefinir senha <ArrowRight size={18} />
              </Button>
            </div>
          </form>
        )}

        {/* Passo 4: Confirmação */}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={32} />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Senha redefinida!
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Sua senha foi alterada com sucesso. Agora você já pode entrar
              com a nova senha.
            </p>
            <Button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-[#5C2E0F] hover:bg-[#4a2409] text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
            >
              Ir para o login <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}