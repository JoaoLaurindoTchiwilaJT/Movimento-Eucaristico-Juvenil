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
        Selecione a área que mais desperta o seu interesse dentro do MEJ.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {interests.map((interest) => (
          <label
            key={interest}
            className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 transition-colors ${
              selectedInterest === interest
                ? 'border-amber-500 bg-amber-50'
                : 'border-input hover:border-amber-400'
            }`}
          >
            <input
              type="radio"
              name="interest"
              value={interest}
              className="h-4 w-4 shrink-0 accent-amber-600"
              checked={selectedInterest === interest}
              onChange={() => onInterestChange(interest)}
            />

            <span className="text-sm font-medium text-orange-950">
              {interest}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
