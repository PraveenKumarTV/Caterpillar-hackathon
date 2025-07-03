import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHardHat,
  FaUsers,
  FaRulerCombined,
  FaTruckMoving,
  FaClock,
  FaMountain,
  FaThermometerHalf,
  FaGlobeAmericas,
  FaEye,
} from "react-icons/fa";

const fields = [
  {
    name: "task_type",
    label: "Task Type",
    icon: <FaHardHat />,
    type: "select",
    options: ["Excavation", "Electrical", "Masonry"],
    info: "Select the type of construction task being performed.",
  },
  {
    name: "crew_size",
    label: "Crew Size",
    icon: <FaUsers />,
    type: "number",
    placeholder: "Enter number of crew members",
    info: "Number of workers involved in the task.",
  },
  {
    name: "area_of_work",
    label: "Area of Work (km²)",
    icon: <FaRulerCombined />,
    type: "number",
    placeholder: "e.g. 1.5",
    info: "Total area of the site being worked on.",
  },
  {
    name: "equipment_type",
    label: "Equipment Type",
    icon: <FaTruckMoving />,
    type: "select",
    options: ["Excavator", "Crane", "Hand-tools"],
    info: "Select the primary equipment used.",
  },
  {
    name: "labour_working_hours",
    label: "Labour Working Hours/day",
    icon: <FaClock />,
    type: "number",
    placeholder: "e.g. 8",
    info: "Total labor hours scheduled for the task.",
  },
  {
    name: "soil_type",
    label: "Soil Type",
    icon: <FaMountain />,
    type: "select",
    options: ["Clay", "Loamy", "Rocky", "Sandy"],
    info: "Select the soil type of the site.",
  },
  {
    name: "temperature",
    label: "Temperature (°C)",
    icon: <FaThermometerHalf />,
    type: "number",
    placeholder: "e.g. 28",
    info: "Temperature at the site during work.",
  },
  {
    name: "sea_level",
    label: "Site Elevation (m)",
    icon: <FaGlobeAmericas />,
    type: "number",
    placeholder: "e.g. 300",
    info: "Height of the site above sea level.",
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
  const [tooltip, setTooltip] = useState({ visible: false, field: null, x: 0, y: 0 });
  const iconRefs = useRef({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const toggleTooltip = (fieldName) => {
    const icon = iconRefs.current[fieldName];
    if (!icon) return;

    const rect = icon.getBoundingClientRect();
    const offsetX = 10;
    const offsetY = 10;

    if (tooltip.visible && tooltip.field === fieldName) {
      setTooltip({ visible: false, field: null, x: 0, y: 0 });
    } else {
      setTooltip({
        visible: true,
        field: fieldName,
        x: rect.right + offsetX + window.scrollX,
        y: rect.top + offsetY + window.scrollY,
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (tooltip.visible && tooltip.field) {
        toggleTooltip(tooltip.field); // re-trigger to update position
      }
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [tooltip]);

  return (
    <motion.div
      className="form-container relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {fields.reduce((rows, field, index) => {
  if (index % 2 === 0) {
    rows.push([field]);
  } else {
    rows[rows.length - 1].push(field);
  }
  return rows;
}, []).map((pair, rowIndex) => (
  <div key={rowIndex} className="form-row">
    {pair.map(({ name, label, type, placeholder, options, icon, info }) => (
      <motion.div
        key={name}
        className="form-field"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-1">
          <label className="font-semibold flex items-center gap-2">
            {icon} {label}
            <button
              type="button"
              ref={(el) => (iconRefs.current[name] = el)}
              className="eye-icon ml-2"
              onClick={() => toggleTooltip(name)}
            >
              <FaEye />
            </button>
          </label>
        </div>

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

        <AnimatePresence>
          {tooltip.visible && tooltip.field === name && (
            <motion.div
              className="info-tooltip fixed"
              style={{ top: tooltip.y, left: tooltip.x }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {info}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    ))}
  </div>
))}
<button type="submit" className="submit-btn">
    {loading ? "Estimating..." : "Predict Duration"}
  </button>
      </form>
    </motion.div>
  );
}
