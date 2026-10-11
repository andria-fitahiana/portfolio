import { useEffect, useState } from "react";

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

interface Props {
  label: string;
  value: string; // "2026-06" ou ""
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function MonthPicker({ label, value, onChange, disabled, required }: Props) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  // Synchroniser avec la valeur du formulaire
  useEffect(() => {
    if (value) {
      const [y = "", m = ""] = value.split("-");
      setYear(y);
      setMonth(m);
    } else if (year && month) {
      setYear("");
      setMonth("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 32 }, (_, i) => String(thisYear + 1 - i));

  const update = (y: string, m: string) => {
    setYear(y);
    setMonth(m);
    onChange(y && m ? `${y}-${m}` : "");
  };

  return (
    <>
      <label className="form-label">{label}</label>
      <div className="d-flex gap-2">
        <select
          className="form-select"
          value={month}
          disabled={disabled}
          required={required}
          onChange={(e) => update(year, e.target.value)}
        >
          <option value="">Mois</option>
          {months.map((name, i) => (
            <option key={name} value={String(i + 1).padStart(2, "0")}>
              {name}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={year}
          disabled={disabled}
          required={required}
          onChange={(e) => update(e.target.value, month)}
        >
          <option value="">Année</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}