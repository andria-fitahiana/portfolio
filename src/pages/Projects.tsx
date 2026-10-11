import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { LuArrowUpRight, LuFolderKanban, LuX } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";
import { supabase } from "../services/supabase";
import Reveal from "../components/Reveal";
import type { Project } from "../types/project";

const MAX_CHIPS = 4; // technologies visibles sur la carte

export default function Projects() {
  const [items, setItems] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("projects")
      .select("id, title, description, detailed_description, image_url, link, github_url, technologies")
      .order("id", { ascending: false })
      .then(({ data }) =>
        setItems(
          (data ?? []).map((p) => ({
            ...p,
            description: p.description ?? "",
            detailed_description: p.detailed_description ?? "",
            image_url: p.image_url ?? "",
            link: p.link ?? "",
            github_url: p.github_url ?? "",
            technologies: p.technologies ?? [],
          }))
        )
      );
  }, []);

  const openProject = (p: Project) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <section id="projets" className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Projets sélectionnés</p>
          <h2 className="section-title mb-5">Ce que j'ai réalisé</h2>
        </Reveal>

        <div className="row g-4">
          {items.map((p, i) => (
            <div key={p.id} className="col-md-6 col-lg-4">
              <Reveal delay={i * 120} className="h-100">
                <article
                  className="project-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => openProject(p)}
                  onKeyDown={(e) => e.key === "Enter" && openProject(p)}
                >
                  <div className="project-thumb">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} />
                    ) : (
                      <div className="thumb-fallback">
                        <LuFolderKanban />
                      </div>
                    )}
                  </div>

                  <div className="project-info">
                    <h3 className="project-name">{p.title}</h3>
                    <p className="project-desc">{p.description}</p>
                    <div>
                      {p.technologies.slice(0, MAX_CHIPS).map((t) => (
                        <span key={t} className="tech-chip">{t}</span>
                      ))}
                      {p.technologies.length > MAX_CHIPS && (
                        <span className="tech-chip">+{p.technologies.length - MAX_CHIPS}</span>
                      )}
                    </div>
                  </div>

                  <div className="project-foot">
                    {p.github_url ? (
                      <a
                        className="gh-link"
                        href={p.github_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaGithub /> GitHub
                      </a>
                    ) : (
                      <span />
                    )}
                    <span className="see-more">
                      Voir détails <LuArrowUpRight />
                    </span>
                  </div>
                </article>
              </Reveal>
            </div>
          ))}
          {items.length === 0 && <p className="muted">Aucun projet pour le moment.</p>}
        </div>
      </div>

      {/* Fenêtre de détails */}
      <Modal
        show={open}
        onHide={() => setOpen(false)}
        size="xl"
        centered
        dialogClassName="site-modal project-modal"
      >
        <button className="modal-close" onClick={() => setOpen(false)} aria-label="Fermer">
          <LuX />
        </button>

        {selected && (
          <div className="project-detail">
            <div className="row g-4 g-lg-5 align-items-center">
              {selected.image_url && (
                <div className="col-lg-6 project-visual">
                  <img src={selected.image_url} alt={selected.title} />
                </div>
              )}

              <div className={selected.image_url ? "col-lg-6" : "col-12"}>
                <div className="project-text">
                  <p className="project-label">Projet</p>
                  <h3 className="project-title">{selected.title}</h3>

                  <div>
                    {selected.technologies.map((t) => (
                      <span key={t} className="tech-chip">{t}</span>
                    ))}
                  </div>

                  <p className="project-long">
                    {selected.detailed_description || selected.description}
                  </p>

                  <div className="d-flex flex-wrap gap-3">
                    {selected.github_url && (
                      <a
                        className="btn-pill-line"
                        href={selected.github_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaGithub /> Code source
                      </a>
                    )}
                    {selected.link && (
                      <a
                        className="btn-pill-fill"
                        href={selected.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Voir le projet <LuArrowUpRight />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}