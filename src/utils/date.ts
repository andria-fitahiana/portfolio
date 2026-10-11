export const formatMonth = (m: string) => {
  if (!m) return "";
  // Ancienne valeur saisie à la main : on l'affiche telle quelle
  if (!/^\d{4}-\d{2}$/.test(m)) return m;
  return new Date(`${m}-01`).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
};