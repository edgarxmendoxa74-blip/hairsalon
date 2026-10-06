import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sliding category pills with arrows/swipe, plus the inline "add category" form.
// items: [{ key, label, count, removable }]; click the active pill again to clear the filter.
const CategorySlider = ({ items, value, onToggle, onRemove, adding, onAdd, onCancelAdd }) => {
  const trackRef = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [name, setName] = useState("");

  const updateEdge = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    updateEdge();
    trackRef.current?.querySelector(".cat-pill.active")?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [value, items.length, updateEdge]);

  useEffect(() => {
    window.addEventListener("resize", updateEdge);
    return () => window.removeEventListener("resize", updateEdge);
  }, [updateEdge]);

  const slideBy = (dir) => trackRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
  };

  return (
    <div className="cat-slider-wrap">
      <div className="cat-slider">
        <button type="button" className="cat-arrow" onClick={() => slideBy(-1)} disabled={edge.start} aria-label="Previous categories">
          <ChevronLeft size={18} />
        </button>

        <div className="cat-track" ref={trackRef} onScroll={updateEdge}>
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              className={`cat-pill ${value === it.key ? "active" : ""}`}
              onClick={() => onToggle(it.key)}
              title={value === it.key ? "Click again to show all" : undefined}
            >
              <span>{it.label}</span>
              <span className="cat-pill-count">{it.count}</span>
              {it.removable && (
                <span role="button" title="Remove empty category" style={{ opacity: 0.7 }} onClick={(e) => { e.stopPropagation(); onRemove(it.key); }}>✕</span>
              )}
            </button>
          ))}
        </div>

        <button type="button" className="cat-arrow" onClick={() => slideBy(1)} disabled={edge.end} aria-label="Next categories">
          <ChevronRight size={18} />
        </button>
      </div>

      {adding && (
        <form onSubmit={submit} style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop: "12px" }}>
          <input
            autoFocus
            type="text"
            className="form-control"
            placeholder="New category name"
            style={{ height: "38px", width: "220px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ height: "38px", fontSize: "13px" }}>Add</button>
          <button type="button" className="btn-secondary" style={{ height: "38px", fontSize: "13px" }} onClick={() => { setName(""); onCancelAdd(); }}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default CategorySlider;
