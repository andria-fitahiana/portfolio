import { useEffect, useState } from "react";
import {
  LuCode, LuMonitor, LuServer, LuWrench, LuDatabase, LuListChecks,
} from "react-icons/lu";
import { supabase } from "../services/supabase";
import Reveal from "../components/Reveal";
import { useInView } from "../hooks/useInView";
import { categoryLabels, type Skill, type SkillCategory } from "../types/skill";

const categoryIcons: Record<SkillCategory, React.ReactNode> = {
  langage: <LuCode />,
  frontend: <LuMonitor />,
  backend: <LuServer />,
  outil: <LuWrench />,
  base_de_donnees: <LuDatabase />,
  methode_travail: <LuListChecks />,
};

const levelColor = (level: number) => {
  if (level < 30) return { bar: "linear-gradient(90deg, #ee7d2b, #f6a65b)", text: "#d96a1a" };
  if (level < 50) return { bar: "linear-gradient(90deg, #e9b520, #f3d065)", text: "#b88a0c" };
  if (level < 75) return { bar: "linear-gradient(90deg, #0e7c86, #1a9ca2)", text: "#0f7c86" };
  return { bar: "linear-gradient(90deg, #12875a, #2cc08a)", text: "#12875a" };
};

// Une ligne : nom + pourcentage + barre animée
function SkillRow({ skill, delay }: { skill: Skill; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [shown, setShown] = useState(0);
  const color = levelColor(skill.level);

  // Compteur de 0 jusqu'au pourcentage
  useEffect(() => {
    if (!inView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(skill.level);
      return;
    }

    let raf = 0;
    const start = performance.now() + delay;
    const duration = 1100;

    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(skill.level * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, skill.level, delay]);

  return (
    <div ref={ref} className="skill-row">
      <div className="skill-row-top">
        <span className="skill-name">{skill.name}</span>
        <span className="skill-pct" style={{ color: color.text }}>
          {shown} %
        </span>
      </div>

      <div className="skill-track">
        <div
          className="skill-fill"
          style={{
            width: inView ? `${skill.level}%` : "0%",
            background: color.bar,
            transition: `width 1.1s cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [filter, setFilter] = useState<"all" | SkillCategory>("all");

  useEffect(() => {
    supabase
      .from("skills")
      .select("*")
      .order("level", { ascending: false })
      .then(({ data }) => setItems(data ?? []));
  }, []);

  // Catégories qui contiennent au moins une compétence
  const categories = (Object.keys(categoryLabels) as SkillCategory[]).filter((c) =>
    items.some((s) => s.category === c)
  );
  const visible = filter === "all" ? categories : categories.filter((c) => c === filter);

  return (
    <section id="competences" className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Savoir-faire</p>
          <h2 className="section-title mb-4">Mes compétences</h2>
        </Reveal>

        {/* Filtres */}
        <Reveal delay={100}>
          <div className="skill-filters">
            <button
              className={`filter-pill ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tout
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-pill ${filter === c ? "active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {categoryLabels[c]}
              </button>
            ))}
          </div>

          {/* Légende des couleurs */}
          {/* <div className="d-flex flex-wrap gap-3 small muted mb-4">
            <span><i className="legend-dot" style={{ background: "#ee7d2b" }} /> Débutant</span>
            <span><i className="legend-dot" style={{ background: "#e9b520" }} /> Intermédiaire</span>
            <span><i className="legend-dot" style={{ background: "#1a9ca2" }} /> Avancé</span>
            <span><i className="legend-dot" style={{ background: "#12875a" }} /> Expert</span>
          </div> */}
        </Reveal>

        {/* Cartes par catégorie (la clé rejoue l'animation à chaque filtre) */}
        <div className="row g-4" key={filter}>
          {visible.map((cat, i) => {
            const list = items.filter((s) => s.category === cat);
            return (
              <div key={cat} className="col-md-6 col-lg-4">
                <Reveal delay={i * 120} className="h-100">
                  <div className="skill-card">
                    <div className="skill-head">
                      <span className="skill-ico">{categoryIcons[cat]}</span>
                      <h3>{categoryLabels[cat]}</h3>
                    </div>

                    {list.map((s, j) => (
                      <SkillRow key={s.id} skill={s} delay={j * 120} />
                    ))}
                  </div>
                </Reveal>
              </div>
            );
          })}
          {items.length === 0 && <p className="muted">Aucune compétence pour le moment.</p>}
        </div>
      </div>
    </section>
  );
}