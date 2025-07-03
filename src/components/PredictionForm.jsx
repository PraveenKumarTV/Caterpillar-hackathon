import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaHardHat,
  FaUsers,
  FaRulerCombined,
  FaTruckMoving,
  FaClock,
  FaMountain,
  FaThermometerHalf,
  FaGlobeAmericas
} from "react-icons/fa";

const fields = [
  {
    name: "task_type",
    label: "Task Type",
    icon: <FaHardHat />,
    type: "select",
    options: ["Excavation", "Electrical", "Masonry"],
  },
  {
    name: "crew_size",
    label: "Crew Size",
    icon: <FaUsers />,
    type: "number",
    placeholder: "e.g. 5",
  },
  {
    name: "area_of_work",
    label: "Area of Work (m²)",
    icon: <FaRulerCombined />,
    type: "number",
  },
  {
    name: "equipment_type",
    label: "Equipment Type",
    icon: <FaTruckMoving />,
    type: "select",
    options: ["Excavator", "Crane", "Hand-tools"],
  },
  {
    name: "labour_working_hours",
    label: "Labour Working Hours",
    icon: <FaClock />,
    type: "number",
  },
  {
    name: "soil_type",
    label: "Soil Type",
    icon: <FaMountain />,
    type: "select",
    options: ["Clay", "Loamy", "Rocky", "Sandy"],
  },
  {
    name: "temperature",
    label: "Temperature (°C)",
    icon: <FaThermometerHalf />,
    type: "number",
  },
  {
    name: "sea_level",
    label: "Site Elevation (m)",
    icon: <FaGlobeAmericas />,
    type: "number",
  },
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
      className="form-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map(({ name, label, type, placeholder, options, icon }) => (
          <motion.div
            key={name}
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="field-label">
              <span className="inline-flex items-center gap-2">
                {icon} {label}
              </span>
            </label>

            {type === "select" ? (
              <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="custom-select"
                required
              >
                <option value="" disabled>
                  Select {label}
                </option>
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
                className="custom-input"
                required
              />
            )}
          </motion.div>
        ))}

        <button type="submit" className="submit-btn">
          {loading ? "Estimating..." : "Predict Duration"}
        </button>
      </form>
    </motion.div>
  );
}
