export type SkillCategory =
  | "langage"
  | "frontend"
  | "backend"
  | "outil"
  | "base_de_donnees"
  | "methode_travail";

export interface Skill {
  id?: number;
  category: SkillCategory;
  name: string;
  level: number;
}

export const categoryLabels: Record<SkillCategory, string> = {
  langage: "Langages",
  frontend: "Frontend",
  backend: "Backend",
  outil: "Outils",
  base_de_donnees: "Bases de données",
  methode_travail: "Méthodes de travail",
};