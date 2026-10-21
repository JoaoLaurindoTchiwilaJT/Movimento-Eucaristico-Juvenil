import { useEffect, useState } from "react";
import { CheckCircle, Mail } from "lucide-react";

export default function SuccessScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  return (
    
     <div
        className={`w-full text-center transition-all duration-700 transform ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Ícone animado */}
        <div className="flex justify-center mb-2">
          <div className="relative">
            <CheckCircle size={48} className="text-green-500 animate-bounce" />
            <span className="absolute inset-0 rounded-full bg-green-100 blur-xl opacity-40 animate-pulse" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-lg font-bold text-orange-950 mb-2">
          Inscrição concluída com sucesso!
        </h1>

        {/* Mensagem */}
        <p className="text-gray-700 text-xs leading-relaxed mb-4">
          A tua candidatura foi recebida e está a ser processada pela nossa equipa.
          Em breve receberás um link de acesso ao teu <strong>perfil pessoal</strong>,
          onde poderás acompanhar o teu histórico, atividades e atualizações da comunidade.
        </p>

        {/* Caixa de informação */}
        <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 text-left text-xs mb-3">
          <div className="flex items-center gap-2 font-semibold text-orange-950 mb-2">
            <Mail size={16} />
            O que acontece a seguir?
          </div>
          <ul className="list-disc pl-4 text-gray-800 space-y-1">
            <li>Receberás um link de acesso ao teu perfil</li>
            <li>Poderás ver histórico de atividades</li>
            <li>Serás notificado sobre eventos e novidades</li>
          </ul>
        </div>

        {/* Status final */}
        <div className="text-xs text-gray-500">
          Obrigado por te juntares à nossa comunidade 🙏
        </div>
      </div>
 
  );
}