import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { useOnboarding } from "@/app/contexts/OnboardingContext";
import { Button } from "@/app/components/ui/button";

const steps = [
  {
    title: "Bem-vindo ao COOPERCARNE",
    description: "Seu aplicativo para gerenciar pedidos, abates e relacionamento com o frigorífico.",
    image: "🏭",
  },
  {
    title: "Faça Pedidos Rapidamente",
    description: "Crie e acompanhe seus pedidos de carne com apenas alguns toques.",
    image: "📋",
  },
  {
    title: "Agende Abates",
    description: "Visualize disponibilidade e agende seus abates de forma simples e rápida.",
    image: "📅",
  },
  {
    title: "Acompanhe Preços",
    description: "Receba alertas de mudanças de preço e histórico comparativo de cotações.",
    image: "💰",
  },
  {
    title: "Modo Escuro",
    description: "Alterne entre tema claro e escuro no seu perfil para melhor conforto visual.",
    image: "🌙",
  },
];

export function Onboarding() {
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep] || steps[0];

  const nextStep = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  if (!showOnboarding) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-gray-200"
        >
          <button
            onClick={completeOnboarding}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{currentStepData.image}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600">
              {currentStepData.description}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-[#c51d1f]"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1"
              >
                Anterior
              </Button>
            )}
            <Button
              onClick={nextStep}
              className="flex-1 bg-[#c51d1f] hover:bg-[#a01517]"
            >
              {isLastStep ? (
                "Começar"
              ) : (
                <>
                  Próximo <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          <button
            onClick={completeOnboarding}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Pular tutorial
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
