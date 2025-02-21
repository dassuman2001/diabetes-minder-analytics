
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { createClient } from '@supabase/supabase-js';

interface PredictionResultProps {
  data: {
    pregnancies: number;
    glucose: number;
    bloodPressure: number;
    skinThickness: number;
    insulin: number;
    bmi: number;
    diabetesPedigree: number;
    age: number;
  };
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const PredictionResult = ({ data }: PredictionResultProps) => {
  const { toast } = useToast();

  // Query to get prediction and SHAP values
  const { data: predictionData, isLoading } = useQuery({
    queryKey: ['prediction', data],
    queryFn: async () => {
      const { data: result, error } = await supabase.functions.invoke('predict-diabetes', {
        body: JSON.stringify(data)
      });
      
      if (error) throw error;
      return result;
    }
  });

  const riskScore = predictionData?.probability * 100 || 0;
  const riskLevel = riskScore > 70 ? "High" : riskScore > 40 ? "Medium" : "Low";
  const riskColor =
    riskLevel === "High"
      ? "text-danger-500"
      : riskLevel === "Medium"
      ? "text-warning-500"
      : "text-success-500";

  // Transform SHAP values into contributing factors
  const contributingFactors = predictionData?.shap_values
    ? Object.entries(predictionData.shap_values)
        .map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
          value: Math.abs(Number(value) * 100)
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
    : [];

  const handleDownload = () => {
    // Create a new window for the printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow popups to download the report",
        variant: "destructive",
      });
      return;
    }

    // Generate the report content
    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Diabetes Risk Assessment Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .risk-score { font-size: 24px; margin: 20px 0; }
            .section { margin: 20px 0; }
            .recommendations li { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>Diabetes Risk Assessment Report</h1>
          <div class="risk-score">
            Risk Level: ${riskLevel} (${riskScore}%)
          </div>
          <div class="section">
            <h2>Contributing Factors</h2>
            ${contributingFactors
              .map((factor) => `${factor.name}: ${factor.value}%`)
              .join("<br>")}
          </div>
          <div class="section">
            <h2>Recommendations</h2>
            <ul class="recommendations">
              <li>Maintain a balanced diet rich in whole grains, lean proteins, and vegetables</li>
              <li>Engage in regular physical activity, aiming for 150 minutes per week</li>
              <li>Monitor blood glucose levels regularly</li>
              <li>Consider consulting with a healthcare professional for personalized advice</li>
            </ul>
          </div>
          <div class="section">
            <h2>Patient Data</h2>
            ${Object.entries(data)
              .map(([key, value]) => `<strong>${key}:</strong> ${value}<br>`)
              .join("")}
          </div>
          <div style="margin-top: 40px; font-size: 12px;">
            <p>This report was generated on ${new Date().toLocaleDateString()} and is for informational purposes only. 
            Please consult with a healthcare professional for medical advice.</p>
          </div>
        </body>
      </html>
    `;

    // Write the content to the new window and print
    printWindow.document.write(reportContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      toast({
        title: "Success",
        description: "Your report is being downloaded",
      });
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Risk Score */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block"
        >
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Risk Assessment
            </h3>
            <div className="text-4xl font-bold mb-2">
              <span className={riskColor}>{riskLevel} Risk</span>
            </div>
            <div className="text-gray-500">Risk Score: {riskScore.toFixed(1)}%</div>
          </Card>
        </motion.div>
      </div>

      {/* Contributing Factors Chart */}
      <Card className="p-6 glass-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Contributing Factors (SHAP Values)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contributingFactors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#9B87F5"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 glass-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Personalized Recommendations
        </h3>
        <ul className="space-y-3 text-gray-600">
          {riskLevel === "High" && (
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Urgent: Schedule an appointment with a healthcare provider for comprehensive diabetes screening
            </li>
          )}
          <li className="flex items-start">
            <span className="mr-2">•</span>
            {predictionData?.shap_values?.glucose > 0 
              ? "Monitor blood glucose levels regularly and maintain a balanced diet"
              : "Maintain a balanced diet rich in whole grains, lean proteins, and vegetables"}
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            {predictionData?.shap_values?.bmi > 0
              ? "Focus on reaching and maintaining a healthy BMI through diet and exercise"
              : "Engage in regular physical activity, aiming for 150 minutes per week"}
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            {predictionData?.shap_values?.age > 0 || predictionData?.shap_values?.diabetesPedigree > 0
              ? "Due to genetic or age-related factors, maintain regular medical check-ups"
              : "Monitor blood glucose levels regularly"}
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Consider consulting with a healthcare professional for personalized advice
          </li>
        </ul>
      </Card>

      {/* Download Report Button */}
      <div className="flex justify-center">
        <Button 
          className="bg-primary hover:bg-primary-600 text-white"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Detailed Report
        </Button>
      </div>
    </motion.div>
  );
};

export default PredictionResult;
