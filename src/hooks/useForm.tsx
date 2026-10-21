import { useState } from "react";

export default function useForm(steps: React.ReactNode[]) {
  const [currentStep, setCurrentStep] = useState(0);

  function changeStep(i: number, e?: React.FormEvent) {
    if(e) e.preventDefault();

    if (i < 0 || i >= steps.length) return;

    setCurrentStep(i);
  }

  return {
    currentStep,
    currentComponent: steps[currentStep],
    changeStep,
    isLastStep: currentStep + 1 === steps.length ? true : false,
    isFirstStep: currentStep === 0 ? true : false,
  };
}