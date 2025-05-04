import { Select } from "antd";
import { useEffect, useState } from "react";
import { getServices } from "../api";

export default function ServiceSelector({ value, onChange }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getServices().then((res) =>
      setOptions(
        res.data.map((s) => ({
          label: s.name,
          value: s._id,                // <‑‑ change here
          minutes: s.duration_minutes
        }))
      )
    );
  }, []);


  return (
    <Select
      placeholder="اختَر الخدمة"
      options={options}
      value={value}
      style={{ width: 250 }}
      onChange={(v) => onChange(v, options.find((o) => o.value === v))}
    />
  );
}
