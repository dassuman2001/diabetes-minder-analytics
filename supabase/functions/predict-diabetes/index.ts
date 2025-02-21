
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Python } from "https://deno.land/x/python@0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigree, age } = await req.json();

    // Initialize Python
    const python = new Python();
    
    // Install required packages
    await python.runScript(`
      import sys
      import subprocess
      import pkg_resources

      required = {'pandas', 'numpy', 'scikit-learn', 'shap'}
      installed = {pkg.key for pkg in pkg_resources.working_set}
      missing = required - installed

      if missing:
          subprocess.check_call([sys.executable, '-m', 'pip', 'install', *missing])
    `);

    // Define the Python script for prediction and SHAP values
    const predictionScript = `
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import shap

# Load the training data from Supabase
# This would be your actual data loading logic
data = pd.DataFrame({
    'Pregnancies': [6, 1, 8, 1, 0, 5, 3, 10, 2, 8, 4, 10, 10, 1, 5, 7, 0, 7, 1, 1],
    'Glucose': [148, 85, 183, 89, 137, 116, 78, 115, 197, 125, 110, 168, 139, 189, 166, 100, 118, 107, 103, 115],
    'BloodPressure': [72, 66, 64, 66, 40, 74, 50, 0, 70, 96, 92, 74, 80, 60, 72, 0, 84, 74, 30, 70],
    'SkinThickness': [35, 29, 0, 23, 35, 0, 32, 0, 45, 0, 0, 0, 0, 23, 19, 0, 47, 0, 38, 30],
    'Insulin': [0, 0, 0, 94, 168, 0, 88, 0, 543, 0, 0, 0, 0, 846, 175, 0, 230, 0, 83, 96],
    'BMI': [33.6, 26.6, 23.3, 28.1, 43.1, 25.6, 31.0, 35.3, 30.5, 0.0, 37.6, 38.0, 27.1, 30.1, 25.8, 30.0, 45.8, 29.6, 43.3, 34.6],
    'DiabetesPedigreeFunction': [0.627, 0.351, 0.672, 0.167, 2.288, 0.201, 0.248, 0.134, 0.158, 0.232, 0.191, 0.537, 1.441, 0.398, 0.587, 0.484, 0.551, 0.254, 0.183, 0.529],
    'Age': [50, 31, 32, 21, 33, 30, 26, 29, 53, 54, 30, 34, 57, 59, 51, 32, 31, 31, 33, 32],
    'Outcome': [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1]
})

# Prepare features and target
X = data.drop('Outcome', axis=1)
y = data['Outcome']

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Prepare the input data
input_data = pd.DataFrame({
    'Pregnancies': [${pregnancies}],
    'Glucose': [${glucose}],
    'BloodPressure': [${bloodPressure}],
    'SkinThickness': [${skinThickness}],
    'Insulin': [${insulin}],
    'BMI': [${bmi}],
    'DiabetesPedigreeFunction': [${diabetesPedigree}],
    'Age': [${age}]
})

# Make prediction
probability = model.predict_proba(input_data)[0][1]

# Calculate SHAP values
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(input_data)[1][0]

# Create a dictionary of feature names and their SHAP values
feature_importance = dict(zip(input_data.columns, shap_values))

print(f"{probability}|{feature_importance}")
    `);

    // Run the prediction script
    const result = await python.runScript(predictionScript);
    const [probability, shapValues] = result.split("|");

    return new Response(
      JSON.stringify({
        probability: parseFloat(probability),
        shap_values: JSON.parse(shapValues.replace(/'/g, '"'))
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});
