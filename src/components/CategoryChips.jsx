import React from "react";

// Row of category filter buttons with counts. options: [{ key, label, count }]
const CategoryChips = ({ label, options, value, onChange }) => (
  <div className="category-chips">
    {label && <span className="category-chips-label">{label}</span>}
    {options.map((o) => (
      <button
        key={o.key}
        type="button"
        className={`btn-secondary ${value === o.key ? "btn-primary" : ""}`}
        style={{ height: "34px", fontSize: "12.5px" }}
        onClick={() => onChange(o.key)}
      >
        {o.label}
        {o.count !== undefined && <span className="category-count">{o.count}</span>}
      </button>
    ))}
  </div>
);

// Build [{key,label,count}] with an "All" option first.
export const buildOptions = (items, keyOf, extra = []) => {
  const counts = {};
  items.forEach((i) => { const k = keyOf(i); if (k) counts[k] = (counts[k] || 0) + 1; });
  return [
    { key: "ALL", label: "All", count: items.length },
    ...extra,
    ...Object.keys(counts).sort().map((k) => ({ key: k, label: k, count: counts[k] }))
  ];
};

export default CategoryChips;
