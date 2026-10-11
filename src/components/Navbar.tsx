import { useEffect, useState } from "react";
import { LuArrowUpRight, LuMenu, LuX } from "react-icons/lu";
import { useProfile } from "../hooks/useProfile";

const links = [
  { id: "accueil", label: "Accueil" },
  { id: "projets", label: "Projets" },
  { id: "competences", label: "Compétences" },
  { id: "experiences", label: "Expériences" },
  { id: "formations", label: "Formations" },
];

export default function Navbar() {
  const profile = useProfile();
  const [active, setActive] = useState("accueil");
  const [open, setOpen] = useState(false);

  // Met en évidence le lien de la section visible à l'écran
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const initials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <header className="site-nav">
      <div className="container inner">
        <a href="#accueil" className="logo-mark">
          {initials || "Portfolio"}
          <span>.</span>
        </a>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn-pill-fill nav-cta" onClick={() => setOpen(false)}>
            Me contacter <LuArrowUpRight />
          </a>
        </nav>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <LuX /> : <LuMenu />}
        </button>
      </div>
    </header>
  );
}