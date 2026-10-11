import { LuArrowRight, LuUser, LuDownload } from "react-icons/lu";
import { useProfile } from "../hooks/useProfile";

export default function Home() {
  const profile = useProfile();

  return (
    <section id="accueil" className="section hero d-flex align-items-center">
      <span className="blob blob-1" />
      <span className="blob blob-2" />

      <div className="container position-relative">
        {!profile ? (
          <p className="muted">Chargement...</p>
        ) : (
          <div className="row align-items-center g-5">
            <div className="col-lg-7 order-2 order-lg-1">
              <p className="hero-hello reveal d1">Bonjour, je suis</p>

              <h1 className="hero-title reveal d2">
                <span className="accent">
                  {profile.last_name} {profile.first_name} 
                </span>
              </h1>

              <p className="hero-role reveal d3">{profile.specialty}</p>
              <p className="hero-desc reveal d4">{profile.description}</p>

              <div className="d-flex flex-wrap gap-3 mt-4 reveal d5">
                <a href="#projets" className="btn-pill-fill">
                  Voir mes projets <LuArrowRight />
                </a>
                <a href="#formations" className="btn-pill-line">
                  Mon parcours <LuUser />
                </a>
              </div>
            </div>

            <div className="col-lg-5 order-1 order-lg-2">
              <div className="hero-photo">
                <span className="photo-ring" />

                {profile.image_url && (
                  <img
                    src={profile.image_url}
                    alt={`${profile.first_name} ${profile.last_name}`}
                  />
                )}

                {profile.cv_url && (
                  <div className="glass-card">
                    <p className="glass-label">Curriculum Vitae</p>
                    <p className="glass-text">Découvre mon parcours et mes compétences.</p>
                    <hr />
                    <a href={`${profile.cv_url}?download=CV.pdf`} className="glass-link">
                      <span className="arrow-btn">
                        <LuDownload />
                      </span>
                      Télécharger mon CV
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}