
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HealthFormProps {
  onSubmit: (data: any) => void;
}

const HealthForm = ({ onSubmit }: HealthFormProps) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    bmi: "",
    bloodPressure: "",
    glucose: "",
    insulin: "",
    skinThickness: "",
    familyHistory: false,
    physicalActivity: "moderate",
    smoking: false,
    alcohol: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
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
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-input-wrapper">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your age"
                  required
                />
              </div>

              <div className="form-input-wrapper">
                <Label>Gender</Label>
                <RadioGroup
                  defaultValue="male"
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Health Metrics</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-input-wrapper">
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  name="bmi"
                  type="number"
                  value={formData.bmi}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your BMI"
                  required
                />
              </div>

              <div className="form-input-wrapper">
                <Label htmlFor="bloodPressure">Blood Pressure (mm Hg)</Label>
                <Input
                  id="bloodPressure"
                  name="bloodPressure"
                  type="number"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter blood pressure"
                  required
                />
              </div>

              <div className="form-input-wrapper">
                <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
                <Input
                  id="glucose"
                  name="glucose"
                  type="number"
                  value={formData.glucose}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter glucose level"
                  required
                />
              </div>

              <div className="form-input-wrapper">
                <Label htmlFor="insulin">Insulin Level (mu U/ml)</Label>
                <Input
                  id="insulin"
                  name="insulin"
                  type="number"
                  value={formData.insulin}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter insulin level"
                  required
                />
              </div>
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Lifestyle Factors
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-input-wrapper">
                <Label>Physical Activity Level</Label>
                <Select
                  value={formData.physicalActivity}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, physicalActivity: value }))
                  }
                >
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="smoking">Smoking</Label>
                  <Switch
                    id="smoking"
                    checked={formData.smoking}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, smoking: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="alcohol">Alcohol Consumption</Label>
                  <Switch
                    id="alcohol"
                    checked={formData.alcohol}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, alcohol: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="familyHistory">Family History of Diabetes</Label>
                  <Switch
                    id="familyHistory"
                    checked={formData.familyHistory}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, familyHistory: checked }))
                    }
                  />
                </div>
              </div>
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
