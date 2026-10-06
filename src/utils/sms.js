// Build the booking confirmation text and open the device's SMS app (staff taps Send).
// Normalise a phone number to international format. Supports Philippines (+63) and Macau (+853).
export const toPhNumber = (phone = "") => {
  const raw = String(phone).trim();
  const d = raw.replace(/\D/g, "");
  if (!d) return "";
  if (raw.startsWith("+")) return "+" + d;               // already international
  if (d.startsWith("00")) return "+" + d.slice(2);       // 00853..., 0063...
  if (d.length === 8 && /^[2368]/.test(d)) return "+853" + d;   // Macau local number
  if (d.length === 11 && d.startsWith("853")) return "+" + d;   // 853 + 8 digits
  if (d.length === 12 && d.startsWith("63")) return "+" + d;    // 63 + 10 digits
  if (d.length === 11 && d.startsWith("09")) return "+63" + d.slice(1);
  if (d.length === 10 && d.startsWith("9")) return "+63" + d;
  if (d.startsWith("0")) return "+63" + d.slice(1);
  return "+" + d;
};

export const formatTime = (t = "") => {
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h)) return t;
  return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export const formatDate = (d = "") => {
  const dt = new Date(d + "T00:00:00");
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

export const buildBookingMessage = (apt) => {
  const first = (apt.clientName || "").split(" ")[0] || "there";
  return `Hi ${first}! Confirmed ang booking mo sa Fix Salon sa ${formatDate(apt.date)}, ${formatTime(apt.time)} - ${apt.serviceName} kay ${apt.staffName}. See you! Reply here kung may changes.`;
};

export const smsLink = (phone, body) => `sms:${toPhNumber(phone)}?&body=${encodeURIComponent(body)}`;

// Opens WhatsApp chat with the message prefilled (works for Macau, PH and any country)
export const whatsappLink = (phone, body) => `https://wa.me/${toPhNumber(phone).replace(/\D/g, "")}?text=${encodeURIComponent(body)}`;

export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  }
};
