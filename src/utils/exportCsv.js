const escapeCell = (v) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// columns: [{ label, value: (row) => any }]
export const exportCsv = (filename, columns, rows) => {
  const lines = [
    columns.map((c) => escapeCell(c.label)).join(","),
    ...rows.map((r) => columns.map((c) => escapeCell(c.value(r))).join(","))
  ];
  // BOM so Excel opens UTF-8 (accents) correctly
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
