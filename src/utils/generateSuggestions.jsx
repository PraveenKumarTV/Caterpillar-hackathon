import { GoogleGenerativeAI } from "@google/generative-ai";

// Use officially supported model name
const genAI = new GoogleGenerativeAI("AIzaSyA_OvST9z3_7658rYsIKZMimSXq47MsVaM");

export async function generateSuggestions(predictedDuration, formData = {}) {
  if (!formData.task_type) {
    return "No input data to generate suggestions.";
  }

  // ✅ Log the full form data to the console
  console.log("Generating suggestions for the following data:", formData);

  const promptText = `
Based on the following construction task details:
- Predicted Duration: ${predictedDuration} days
- Task Type: ${formData.task_type}
- Crew Size: ${formData.crew_size}
- Equipment Type: ${formData.equipment_type}
- Labour Hours: ${formData.labour_working_hours}
- Area: ${formData.area_of_work} m²
- Soil Type: ${formData.soil_type}
- Temperature: ${formData.temperature}°C
- Elevation: ${formData.sea_level}m

Provide 5 actionable suggestions to reduce construction time. give suggestions in a concise bullet point format, each suggestion should be a single line. Focus on practical strategies that can be implemented immediately.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(promptText);

    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Failed to get AI suggestions.";
  }
}
