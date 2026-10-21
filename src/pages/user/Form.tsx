import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  ChevronDown,
  Check,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Dados pessoais' },
  { id: 2, label: 'Interesses' },
  { id: 3, label: 'Comunidade' },
  { id: 4, label: 'Confirmação' },
];

const INTERESSES_OPTIONS = [
  'Oração e espiritualidade',
  'Ação social',
  'Música e louvor',
  'Formação e estudo',
  'Eventos e encontros',
  'Liderança',
];

const PAROQUIAS = [
  'Selecione sua paróquia',
  'Paróquia Nossa Senhora de Fátima',
  'Paróquia São José',
  'Paróquia Santo António',
  'Paróquia Sagrado Coração de Jesus',
];

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    nome: '',
    nascimento: '',
    email: '',
    telefone: '',
    cidade: '',
    paroquia: '',
    interesses: [],
    grupo: '',
    funcao: '',
    comoConheceu: '',
  });

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const toggleInteresse = (item) => {
    setData((d) => ({
      ...d,
      interesses: d.interesses.includes(item)
        ? d.interesses.filter((i) => i !== item)
        : [...d.interesses, item],
    }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-amber-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-6 md:p-8">
        {/* Stepper */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 min-w-[90px]">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                    ${
                      s.id === step
                        ? 'bg-amber-500 text-white'
                        : s.id < step
                          ? 'bg-amber-500 text-white'
                          : 'bg-zinc-200 text-zinc-500'
                    }`}
                >
                  {s.id < step ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span
                  className={`text-xs font-semibold text-center ${
                    s.id === step ? 'text-amber-600' : 'text-zinc-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded-full -translate-y-3 ${
                    s.id < step ? 'bg-amber-500' : 'bg-zinc-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[260px]">
          {step === 1 && <StepDadosPessoais data={data} update={update} />}
          {step === 2 && (
            <StepInteresses data={data} toggleInteresse={toggleInteresse} />
          )}
          {step === 3 && <StepComunidade data={data} update={update} />}
          {step === 4 && <StepConfirmacao data={data} />}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 gap-3">
          {step > 1 ? (
            <button
              onClick={back}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-orange-950 border-2 border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-900 to-orange-950 hover:from-orange-800 hover:to-orange-900 transition-colors shadow-md"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => alert('Cadastro enviado!')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-900 to-orange-950 hover:from-orange-800 hover:to-orange-900 transition-colors shadow-md"
            >
              Confirmar cadastro
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-orange-950">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-shadow';

function StepDadosPessoais({ data, update }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Nome completo">
        <input
          type="text"
          placeholder="Digite seu nome"
          value={data.nome}
          onChange={(e) => update('nome', e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Data de nascimento">
        <div className="relative">
          <input
            type="text"
            placeholder="DD / MM / AAAA"
            value={data.nascimento}
            onChange={(e) => update('nascimento', e.target.value)}
            className={inputClass + ' pr-10'}
          />
          <Calendar className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </Field>

      <Field label="E-mail">
        <input
          type="email"
          placeholder="seu@email.com"
          value={data.email}
          onChange={(e) => update('email', e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Telefone / WhatsApp">
        <input
          type="text"
          placeholder="(11) 99999-9999"
          value={data.telefone}
          onChange={(e) => update('telefone', e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Cidade">
        <input
          type="text"
          placeholder="Sua cidade"
          value={data.cidade}
          onChange={(e) => update('cidade', e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Paróquia">
        <div className="relative">
          <select
            value={data.paroquia}
            onChange={(e) => update('paroquia', e.target.value)}
            className={inputClass + ' appearance-none pr-10 text-zinc-700'}
          >
            {PAROQUIAS.map((p, i) => (
              <option key={p} value={i === 0 ? '' : p} disabled={i === 0}>
                {p}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </Field>
    </div>
  );
}

function StepInteresses({ data, toggleInteresse }) {
  return (
    <div>
      <p className="text-sm text-zinc-500 mb-5">
        Selecione as áreas que mais despertam o seu interesse dentro do MEJ.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {INTERESSES_OPTIONS.map((item) => {
          const active = data.interesses.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleInteresse(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-colors
                ${
                  active
                    ? 'border-amber-400 bg-amber-50 text-orange-950'
                    : 'border-zinc-200 text-zinc-600 hover:border-amber-300'
                }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0
                  ${active ? 'bg-amber-400 border-amber-400' : 'border-zinc-300'}`}
              >
                {active && <Check className="w-3 h-3 text-white" />}
              </span>
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepComunidade({ data, update }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Nome do grupo / núcleo">
        <input
          type="text"
          placeholder="Ex: Núcleo Esperança"
          value={data.grupo}
          onChange={(e) => update('grupo', e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Função na comunidade">
        <input
          type="text"
          placeholder="Ex: Membro, coordenador..."
          value={data.funcao}
          onChange={(e) => update('funcao', e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="md:col-span-2">
        <Field label="Como conheceu o MEJ?">
          <textarea
            placeholder="Conte um pouco sobre como chegou até aqui"
            value={data.comoConheceu}
            onChange={(e) => update('comoConheceu', e.target.value)}
            rows={4}
            className={inputClass + ' resize-none'}
          />
        </Field>
      </div>
    </div>
  );
}

function StepConfirmacao({ data }) {
  const rows = [
    ['Nome completo', data.nome || '—'],
    ['Data de nascimento', data.nascimento || '—'],
    ['E-mail', data.email || '—'],
    ['Telefone', data.telefone || '—'],
    ['Cidade', data.cidade || '—'],
    ['Paróquia', data.paroquia || '—'],
    ['Interesses', data.interesses.join(', ') || '—'],
    ['Grupo / núcleo', data.grupo || '—'],
    ['Função', data.funcao || '—'],
  ];

  return (
    <div>
      <p className="text-sm text-zinc-500 mb-5">
        Revise os dados antes de confirmar o seu cadastro.
      </p>
      <div className="rounded-xl border border-zinc-200 divide-y divide-zinc-100">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 px-4 py-3 text-sm"
          >
            <span className="font-semibold text-zinc-500">{label}</span>
            <span className="font-bold text-orange-950 text-right">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
