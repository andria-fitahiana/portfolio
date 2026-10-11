import { useEffect, useState } from "react";
import { LuGraduationCap, LuSchool, LuCalendar, LuAward } from "react-icons/lu";
import { supabase } from "../services/supabase";
import Reveal from "../components/Reveal";
import type { Formation } from "../types/formation";

export default function Formations() {
  const [items, setItems] = useState<Formation[]>([]);

  useEffect(() => {
    supabase
      .from("formations")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) =>
        setItems(
          (data ?? []).map((f) => ({
            ...f,
            level: f.level ?? "",
            school: f.school ?? "",
            year: f.year ?? "",
          }))
        )
      );
  }, []);

  return (
    <section id="formations" className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Parcours</p>
          <h2 className="section-title mb-5">Mes formations</h2>
        </Reveal>

        <div className="row g-4">
          {items.map((f, i) => (
            <div key={f.id} className="col-12">
              <Reveal delay={i * 120}>
                <article className="edu-card">
                  <span className="edu-ico">
                    <LuGraduationCap />
                  </span>

                  <div className="edu-body">
                    <h3 className="edu-degree">{f.degree}</h3>

                    {f.school && (
                      <p className="edu-school">
                        <LuSchool /> {f.school}
                      </p>
                    )}

                    {f.level && (
                      <span className="edu-level">
                        <LuAward /> {f.level}
                      </span>
                    )}
                  </div>

                  {f.year && (
                    <span className="year-pill">
                      <LuCalendar /> {f.year}
                    </span>
                  )}
                </article>
              </Reveal>
            </div>
          ))}
          {items.length === 0 && <p className="muted">Aucune formation pour le moment.</p>}
        </div>
      </div>
    </section>
  );
}