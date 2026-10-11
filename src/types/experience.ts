export interface Experience {
  id?: number;
  position: string;
  company: string;
  location: string;
  start_date: string; // "2026-03"
  end_date: string;   // "" si poste actuel
  is_current: boolean;
  description: string;
  technologies: string[];
}