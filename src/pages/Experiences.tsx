import { useEffect, useState } from "react";
import { LuMapPin, LuCalendar } from "react-icons/lu";
import { supabase } from "../services/supabase";
import type { Experience } from "../types/experience";
import { formatMonth } from "../utils/date";


export default function Experiences() {
  const [items, setItems] = useState<Experience[]>([]);

  useEffect(() => {
    supabase
      .from("experiences")
      .select("*")
      .order("start_date", { ascending: false })
      .then(({ data }) =>
        setItems(
          (data ?? []).map((e) => ({
            ...e,
            location: e.location ?? "",
            end_date: e.end_date ?? "",
            description: e.description ?? "",
            technologies: e.technologies ?? [],
          }))
        )
      );
  }, []);

  return (
    <section id="experiences" className="section">
      <div className="container">
        <p className="eyebrow">Parcours professionnel</p>
        <h2 className="section-title mb-5">Mes expériences</h2>

        <div className="timeline">
          {items.map((x) => (
            <div key={x.id} className="timeline-item">
              <div className="soft-card">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                  <div>
                    <h3 className="mt-0 mb-1">{x.position}</h3>
                    <p className="fw-semibold mb-0" style={{ color: "var(--teal)" }}>
                      {x.company}
                    </p>
                  </div>
                  {x.is_current && <span className="year-pill">En cours</span>}
                </div>

                <div className="d-flex flex-wrap gap-3 small muted my-3">
                  <span className="d-inline-flex align-items-center gap-1">
                    <LuCalendar />
                    {formatMonth(x.start_date)} -{" "}
                    {x.is_current ? "Aujourd'hui" : formatMonth(x.end_date)}
                  </span>
                  {x.location && (
                    <span className="d-inline-flex align-items-center gap-1">
                      <LuMapPin /> {x.location}
                    </span>
                  )}
                </div>

                {x.description && (
                  <p className="mb-3" style={{ whiteSpace: "pre-wrap" }}>
                    {x.description}
                  </p>
                )}

                {x.technologies.map((t) => (
                  <span key={t} className="tech-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="muted">Aucune expérience pour le moment.</p>}
        </div>
      </div>
    </section>
  );
}