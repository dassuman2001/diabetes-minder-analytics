import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import HealthForm from "@/components/HealthForm";
import PredictionResult from "@/components/PredictionResult";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface FormData {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigree: number;
  age: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    pregnancies: 0,
    glucose: 0,
    bloodPressure: 0,
    skinThickness: 0,
    insulin: 0,
    bmi: 0,
    diabetesPedigree: 0,
    age: 0,
  });

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
              AI-Powered Health Analysis
            </span>
            <h1 className="text-4xl font-display font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Diabetes Risk Assessment
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Get personalized insights and recommendations based on your health data
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="max-w-3xl mx-auto overflow-hidden glass-card">
            {currentStep === 1 ? (
              <div className="p-6 sm:p-8">
                <HealthForm onSubmit={handleFormSubmit} />
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <PredictionResult data={formData} />
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="hover:bg-gray-50"
                  >
                    Start New Assessment
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Features Section */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="relative floating-card"
            >
              <Card className="p-6 h-full glass-card">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-50 text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.description}</p>
                <div className="absolute bottom-6 right-6">
                  <ArrowRight className="w-5 h-5 text-primary-600" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "AI-Powered Analysis",
    description:
      "Our advanced AI model analyzes your health data to provide accurate risk assessments.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Personalized Reports",
    description:
      "Get detailed PDF reports with personalized health recommendations and insights.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
  },
  {
    title: "Data Visualization",
    description:
      "Interactive charts and graphs help you understand your health metrics better.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
  },
];

export default Index;
