import React from "react";
import { Download } from "lucide-react";
import { exportCsv } from "../utils/exportCsv";

const ExportButton = ({ filename, columns, rows, label = "Export CSV", small = false }) => (
  <button
    type="button"
    className={`btn-secondary${small ? " btn-export-sm" : ""}`}
    disabled={!rows.length}
    title={rows.length ? `Download ${rows.length} row(s) as CSV` : "Nothing to export"}
    onClick={() => exportCsv(filename, columns, rows)}
  >
    <Download size={small ? 13 : 16} /> {label}
  </button>
);

export default ExportButton;
