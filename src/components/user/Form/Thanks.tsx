import { useEffect, useState } from 'react';
import { CheckCircle, Mail } from 'lucide-react';

export default function SuccessScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div
      role="status"
      className={`w-full text-center transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="mb-3 flex justify-center">
        <CheckCircle size={48} className="text-green-500" />
      </div>

      <h2 className="mb-2 text-lg font-bold text-orange-950">
        Inscrição concluída com sucesso!
      </h2>

      <p className="mb-4 text-sm leading-relaxed text-gray-700">
        O teu cadastro foi recebido pela nossa equipa. Acompanha as próximas
        comunicações do MEJ.
      </p>

      <div className="mb-3 rounded-lg border border-amber-300 bg-amber-100 p-3 text-left text-sm">
        <div className="mb-2 flex items-center gap-2 font-semibold text-orange-950">
          <Mail size={18} />O que acontece a seguir?
        </div>

        <ul className="list-disc space-y-1 pl-5 text-gray-800">
          <li>A equipa poderá analisar os teus dados.</li>
          <li>
            Receberás informações sobre os próximos passos pelos canais
            disponibilizados.
          </li>
        </ul>
      </div>

      <p className="text-xs text-gray-500">
        Obrigado por te juntares à nossa comunidade.
      </p>
    </div>
  );
}
