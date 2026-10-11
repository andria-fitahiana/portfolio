import { useState } from "react";
import {
  LuMail, LuPhone, LuMapPin, LuSend, LuUser,
  LuMessageSquare, LuArrowUpRight, LuCheck,
} from "react-icons/lu";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { supabase } from "../services/supabase";
import { useProfile } from "../hooks/useProfile";
import Reveal from "../components/Reveal";

export default function Contact() {
  const profile = useProfile();
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.from("messages").insert(form);
    if (error) setStatus("error");
    else {
      setStatus("success");
      setForm({ name: "", email: "", content: "" });
    }
  };

  const contacts = [
    {
      icon: <LuMail />,
      label: "Email",
      value: profile?.email,
      href: profile?.email ? `mailto:${profile.email}` : "",
    },
    {
      icon: <LuPhone />,
      label: "Téléphone",
      value: profile?.phone,
      href: profile?.phone ? `tel:${profile.phone.replace(/\s/g, "")}` : "",
    },
    {
      icon: <LuMapPin />,
      label: "Adresse",
      value: profile?.address,
      href: "",
    },
    {
      icon: <FaGithub />,
      label: "GitHub",
      value: profile?.github_url,
      href: profile?.github_url ?? "",
    },
    {
      icon: <FaLinkedinIn />,
      label: "LinkedIn",
      value: profile?.linkedin_url,
      href: profile?.linkedin_url ?? "",
    },
  ].filter((c) => c.value);

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="row g-5 align-items-start">
          {/* Colonne gauche : coordonnées */}
          <div className="col-lg-5">
            <Reveal>
              <p className="eyebrow">Contact</p>
              <h2 className="section-title mb-3">Travaillons ensemble</h2>
              <p className="muted mb-4">
                Une question, un projet ou une opportunité ? N'hésitez pas à m'écrire.
              </p>
            </Reveal>

            {contacts.map((c, i) => {
              const content = (
                <>
                  <span className="contact-ico">{c.icon}</span>
                  <span className="contact-text">
                    <small>{c.label}</small>
                    <strong>{c.value!.replace(/^https?:\/\/(www\.)?/, "")}</strong>
                  </span>
                  {c.href && <LuArrowUpRight className="contact-arrow" />}
                </>
              );

              return (
                <Reveal key={c.label} delay={i * 100}>
                  {c.href ? (
                    <a
                      className="contact-card"
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="contact-card static">{content}</div>
                  )}
                </Reveal>
              );
            })}
          </div>

          {/* Colonne droite : formulaire */}
          <div className="col-lg-7">
            <Reveal delay={150}>
              <div className="contact-form-card">
                {status === "success" ? (
                  <div className="sent">
                    <span className="sent-check">
                      <LuCheck />
                    </span>
                    <h3>Message envoyé !</h3>
                    <p className="muted">
                      Merci pour votre message, je vous répondrai très bientôt.
                    </p>
                    <button
                      className="btn-pill-line"
                      type="button"
                      onClick={() => setStatus("idle")}
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className="form-heading">Envoyez-moi un message</h3>

                    {status === "error" && (
                      <div className="alert alert-danger">
                        Une erreur est survenue, veuillez réessayer.
                      </div>
                    )}

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Nom</label>
                        <div className="field">
                          <LuUser />
                          <input
                            className="form-control"
                            name="name"
                            placeholder="Votre nom"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <div className="field">
                          <LuMail />
                          <input
                            className="form-control"
                            type="email"
                            name="email"
                            placeholder="Votre email"
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Message</label>
                        <div className="field field-area">
                          <LuMessageSquare />
                          <textarea
                            className="form-control"
                            name="content"
                            rows={5}
                            placeholder="Votre message"
                            value={form.content}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-pill-fill send-btn mt-4"
                      type="submit"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
                      <LuSend />
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}