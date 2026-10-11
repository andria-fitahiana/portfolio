import { useEffect, useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { supabase } from "../../services/supabase";
import { useNotify } from "../../components/NotifyProvider";
import type { Project } from "../../types/project";

const empty: Project = {
  title: "",
  description: "",
  detailed_description: "",
  image_url: "",
  link: "",
  github_url: "",
  technologies: [],
};

export default function ManageProjects() {
  const { notify, confirmDialog } = useNotify();
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(empty);
  const [techText, setTechText] = useState(""); // "React, TypeScript, Supabase"
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("projects")
      .select("id, title, description, detailed_description, image_url, link, github_url, technologies")
      .order("id", { ascending: false });

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
    );
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm(empty);
    setTechText("");
  };

  // Envoyer l'image dans le bucket "portfolio"
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `projects/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, file);

    if (error) {
      notify("error", "Échec de l'envoi de l'image.");
    } else {
      const url = supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
      setForm((prev) => ({ ...prev, image_url: url }));
    }
    setUploading(false);
  };

  // Ajouter ou modifier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...rest } = form;
    const values = {
      ...rest,
      technologies: techText.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const { error } = id
      ? await supabase.from("projects").update(values).eq("id", id)
      : await supabase.from("projects").insert(values);

    if (error) {
      notify("error", "Erreur lors de l'enregistrement.");
      return;
    }
    notify("success", id ? "Projet bien modifié." : "Projet bien ajouté.");
    reset();
    load();
  };

  // Supprimer
  const handleDelete = async (id: number) => {
    if (!(await confirmDialog("Supprimer ce projet ?"))) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) notify("error", "Erreur lors de la suppression.");
    else {
      notify("success", "Projet bien supprimé.");
      if (form.id === id) reset();
      load();
    }
  };

  const startEdit = (p: Project) => {
    setForm(p);
    setTechText(p.technologies.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <h1 className="mb-4">Projets</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <h2 className="h5 mb-3">{form.id ? "Modifier le projet" : "Ajouter un projet"}</h2>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nom du projet</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Lien du projet</label>
            <input
              className="form-control"
              name="link"
              placeholder="https://..."
              value={form.link}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Lien GitHub</label>
            <input
              className="form-control"
              name="github_url"
              placeholder="https://github.com/..."
              value={form.github_url}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Technologies (séparées par des virgules)</label>
            <input
              className="form-control"
              placeholder="React, TypeScript, Supabase"
              value={techText}
              onChange={(e) => setTechText(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description courte</label>
            <input
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description détaillée</label>
            <textarea
              className="form-control"
              name="detailed_description"
              rows={5}
              value={form.detailed_description}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Image</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Aperçu"
                className="img-thumbnail mt-2"
                style={{ maxHeight: 150 }}
              />
            )}
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={uploading}>
            {uploading ? "Envoi de l'image..." : form.id ? "Mettre à jour" : "Ajouter"}
          </button>
          {form.id && (
            <button className="btn btn-outline-secondary" type="button" onClick={reset}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Liste */}
      <div className="card">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Image</th>
                <th>Projet</th>
                <th>Technologies</th>
                <th>Liens</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    Aucun projet pour le moment.
                  </td>
                </tr>
              )}
              {items.map((p) => (
                <tr key={p.id}>
                  <td style={{ width: 90 }}>
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        style={{ width: 70, height: 50, objectFit: "cover", borderRadius: 6 }}
                      />
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="fw-semibold">{p.title}</div>
                    <small className="text-muted">{p.description}</small>
                  </td>
                  <td>
                    {p.technologies.map((t) => (
                      <span key={t} className="badge bg-light text-dark border me-1">
                        {t}
                      </span>
                    ))}
                  </td>
                  <td className="text-nowrap">
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="me-2">
                        Projet
                      </a>
                    )}
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}
                    {!p.link && !p.github_url && "-"}
                  </td>
                  <td className="text-end text-nowrap">
                    <button
                      className="btn btn-sm btn-outline-primary icon-btn me-2"
                      title="Modifier"
                      aria-label="Modifier"
                      onClick={() => startEdit(p)}
                    >
                      <LuPencil />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger icon-btn"
                      title="Supprimer"
                      aria-label="Supprimer"
                      onClick={() => handleDelete(p.id!)}
                    >
                      <LuTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}