// Categories created by the user (shared by Services and Staff Management)
const KEY = "glow_salon_serviceCategories";

export const loadCustomCategories = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};

export const saveCustomCategories = (list) => {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
};
