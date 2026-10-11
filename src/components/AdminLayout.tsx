import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard, LuUser, LuBriefcase, LuGraduationCap,
  LuCode, LuFolderKanban, LuMail, LuLogOut,
} from "react-icons/lu";
import { supabase } from "../services/supabase";
import { useProfile } from "../hooks/useProfile";
import { NotifyProvider } from "./NotifyProvider";

const links = [
  { to: "/admin", label: "Accueil", icon: <LuLayoutDashboard />, end: true },
  { to: "/admin/profil", label: "Profil", icon: <LuUser /> },
  { to: "/admin/experiences", label: "Expériences", icon: <LuBriefcase /> },
  { to: "/admin/formations", label: "Formations", icon: <LuGraduationCap /> },
  { to: "/admin/competences", label: "Compétences", icon: <LuCode /> },
  { to: "/admin/projets", label: "Projets", icon: <LuFolderKanban /> },
  { to: "/admin/messages", label: "Messages", icon: <LuMail /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const profile = useProfile();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <NotifyProvider>
    <div className="app-bg">
      <div className="admin-shell">
        <aside className="sidebar">
          <div className="brand">Portfolio<span>Admin</span></div>

          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
            >
              {l.icon} {l.label}
            </NavLink>
          ))}

          <button className="logout" onClick={logout}>
            <LuLogOut /> Déconnexion
          </button>
        </aside>

        <div className="admin-main">
          <header className="topbar">
            <p className="welcome">
              Bienvenue{profile?.first_name ? `, ${profile.first_name}` : ""} 👋
            </p>
            <div className="topbar-right">
              <a href="/" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                Voir le site
              </a>
              {profile?.image_url ? (
                <img src={profile.image_url} alt="Avatar" className="avatar" />
              ) : (
                <div className="avatar avatar-fallback">{profile?.first_name?.[0] ?? "A"}</div>
              )}
            </div>
          </header>

          <section className="admin-content">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
    </NotifyProvider>
  );
}