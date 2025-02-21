
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/pages/Index";

interface HealthFormProps {
  onSubmit: (data: FormData) => void;
}

const HealthForm = ({ onSubmit }: HealthFormProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Health Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="pregnancies">Number of Pregnancies</Label>
              <Input
                id="pregnancies"
                name="pregnancies"
                type="number"
                value={formData.pregnancies}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
              <Input
                id="glucose"
                name="glucose"
                type="number"
                value={formData.glucose}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="bloodPressure">Blood Pressure (mm Hg)</Label>
              <Input
                id="bloodPressure"
                name="bloodPressure"
                type="number"
                value={formData.bloodPressure}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="skinThickness">Skin Thickness (mm)</Label>
              <Input
                id="skinThickness"
                name="skinThickness"
                type="number"
                value={formData.skinThickness}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="insulin">Insulin Level (mu U/ml)</Label>
              <Input
                id="insulin"
                name="insulin"
                type="number"
                value={formData.insulin}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="bmi">BMI (kg/m²)</Label>
              <Input
                id="bmi"
                name="bmi"
                type="number"
                step="0.1"
                value={formData.bmi}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="diabetesPedigree">Diabetes Pedigree Function</Label>
              <Input
                id="diabetesPedigree"
                name="diabetesPedigree"
                type="number"
                step="0.001"
                value={formData.diabetesPedigree}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-600 text-white"
          >
            Get Prediction
          </Button>
        </div>
      </motion.div>
    </form>
  );
};

export default HealthForm;
