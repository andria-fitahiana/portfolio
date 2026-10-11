import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuFolderKanban, LuCode, LuGraduationCap, LuMail } from "react-icons/lu";
import { supabase } from "../../services/supabase";
import type { Message } from "../../types/message";

const countOf = async (table: string) => {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  return count ?? 0;
};

export default function Dashboard() {
  const [counts, setCounts] = useState({ projects: 0, skills: 0, formations: 0, messages: 0 });
  const [recent, setRecent] = useState<Message[]>([]);

  useEffect(() => {
    Promise.all([
      countOf("projects"),
      countOf("skills"),
      countOf("formations"),
      countOf("messages"),
    ]).then(([projects, skills, formations, messages]) =>
      setCounts({ projects, skills, formations, messages })
    );

    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => setRecent(data ?? []));
  }, []);

  const stats = [
    { label: "Projets", value: counts.projects, icon: <LuFolderKanban />, tone: "violet" },
    { label: "Compétences", value: counts.skills, icon: <LuCode />, tone: "pink" },
    { label: "Formations", value: counts.formations, icon: <LuGraduationCap />, tone: "orange" },
    { label: "Messages", value: counts.messages, icon: <LuMail />, tone: "teal" },
  ];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  return (
    <>
      <h1>Tableau de bord</h1>

      <div className="row g-3">
        {/* Colonne gauche : derniers messages */}
        <div className="col-lg-7">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Derniers messages</span>
              <Link to="/admin/messages">Voir tout</Link>
            </div>
            {recent.length === 0 && (
              <p className="text-muted p-4 mb-0">Aucun message pour le moment.</p>
            )}
            {recent.map((m) => (
              <div key={m.id} className="msg-row">
                <div className="text-truncate">
                  <strong>{m.name}</strong>
                  <div className="small text-muted text-truncate">{m.content}</div>
                </div>
                <small className="text-muted text-nowrap">{formatDate(m.created_at)}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne droite : stats + bannière */}
        <div className="col-lg-5">
          <div className="row g-3">
            {stats.map((s) => (
              <div key={s.label} className="col-6">
                <div className="card stat-card">
                  <div className="stat-top">
                    <div className={`stat-icon ${s.tone}`}>{s.icon}</div>
                    <span className="stat-label">{s.label}</span>
                  </div>
                  <div className="stat-value">{s.value}</div>
                </div>
              </div>
            ))}

            <div className="col-12">
              <div className="banner">
                <small>N'oublie pas</small>
                <h3>Mets à jour tes projets</h3>
                <Link to="/admin/projets" className="btn btn-light btn-sm rounded-pill px-3">
                  Gérer mes projets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}