import React from "react";

// Report table using the same design as the Sales & POS register, with an optional totals row.
const ExcelSheet = ({ columns, rows, totals, rowKey = "id" }) => (
  <div className="custom-table-container no-stack compact-table">
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((c) => <th key={c.key} className={[c.num ? "num" : "", c.hideMd ? "hide-md" : "", c.hideSm ? "hide-sm" : ""].join(" ").trim()}>{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[rowKey]}>
            {columns.map((c) => (
              <td key={c.key} className={[c.num ? "num" : "", c.hideMd ? "hide-md" : "", c.hideSm ? "hide-sm" : ""].join(" ").trim()} style={c.style}>{c.render ? c.render(r) : r[c.key]}</td>
            ))}
          </tr>
        ))}
        {totals && (
          <tr className="table-total-row">
            {columns.map((c, i) => (
              <td key={c.key} className={[c.num ? "num" : "", c.hideMd ? "hide-md" : "", c.hideSm ? "hide-sm" : ""].join(" ").trim()}>{totals[c.key] ?? (i === 0 ? "TOTAL" : "")}</td>
            ))}
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ExcelSheet;
