import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const fields = [
  { name: "task_type", label: "Task Type", type: "select", options:["Excavation","Electrical" , "Masonry"] },
  { name: "crew_size", label: "Crew Size", type: "number", placeholder: "e.g. 5" },
  { name: "area_of_work", label: "Area of Work (m²)", type: "number" },
  { name: "equipment_type", label: "Equipment Type", type: "select", options:["Excavator","Crane","Hand-tools"] },
  { name: "labour_working_hours", label: "Labour Working Hours", type: "number" },
  { name: "soil_type", label: "Soil Type", type: "select", options:["Clay","Loamy","Rocky", "Sandy"] },
  { name: "temperature", label: "Temperature (°C)", type: "number" },
  { name: "sea_level", label: "Site Elevation (m)", type: "number" }
];

export default function PredictionForm({ setPrediction }) {
  const [formData, setFormData] = useState({
    task_type: "",
    crew_size: "",
    area_of_work: "",
    equipment_type: "",
    labour_working_hours: "",
    soil_type: "",
    temperature: "",
    sea_level: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    try {
      const res = await axios.post("http://localhost:8000/predict", formData);
      setPrediction(res.data.predicted_duration);
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-yellow-400 p-8 rounded-lg shadow-xl max-w-3xl mx-auto transition-all"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map(({ name, label, type, placeholder, options }) => (
  <motion.div
    key={name}
    className="flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <label className="font-semibold mb-1">{label}</label>

    {type === "select" ? (
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="p-3 rounded border border-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
        required
      >
        <option value="" disabled>Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="p-3 rounded border border-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
        required
      />
    )}
  </motion.div>
))}


        <button
          type="submit"
          className="bg-black text-yellow-400 font-bold py-3 px-6 rounded hover:bg-yellow-500 hover:text-black transition-all w-full"
        >
          {loading ? "Estimating..." : "Predict Duration"}
        </button>
      </form>
    </motion.div>
  );
}
