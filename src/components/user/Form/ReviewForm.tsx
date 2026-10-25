type ReviewFormProps = {
  selectedInterest: string;
  onInterestChange: (interest: string) => void;
};

const interests = [
  'Oração e espiritualidade',
  'Acção social',
  'Música e louvor',
  'Formação e estudo',
  'Eventos e encontros',
  'Liderança',
];

export default function ReviewForm({
  selectedInterest,
  onInterestChange,
}: ReviewFormProps) {
  return (
    <div className="flex flex-col gap-4 p-2">
      <p className="text-sm text-gray-500">
        Selecione as áreas que mais despertam o seu interesse dentro do MEJ.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {interests.map((interest) => (
          <label
            key={interest}
            className={`flex items-center gap-3 border rounded-md px-3 h-11 cursor-pointer transition-colors ${
              selectedInterest === interest
                ? 'border-amber-500 bg-amber-50'
                : 'border-input hover:border-amber-400'
            }`}
          >
            <input
              type="radio"
              name="interest"
              className="w-4 h-4 accent-amber-600 shrink-0"
              checked={selectedInterest === interest}
              onChange={() => onInterestChange(interest)}
            />

            <span className="text-sm text-orange-950 font-medium">
              {interest}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
