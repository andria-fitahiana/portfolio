import { LuMail } from "react-icons/lu";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useProfile } from "../hooks/useProfile";

export default function Footer() {
  const profile = useProfile();
  const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";

  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-quote">
          Sérieuse, curieuse et déterminée, je suis prête à mettre mes compétences
          au service de votre équipe et à grandir avec vos projets.
        </p>

        <div className="footer-social">
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          )}
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} aria-label="Email">
              <LuMail />
            </a>
          )}
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} {fullName} - Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}