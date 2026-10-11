import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNotify } from "../../components/NotifyProvider";
import type { Profile } from "../../types/profile";

const empty: Profile = {
  first_name: "", last_name: "", specialty: "", description: "",
  image_url: "", cv_url: "", email: "", phone: "",
  address: "", github_url: "", linkedin_url: "",
};

const fields: { name: keyof Profile; label: string; type?: string }[] = [
  { name: "last_name", label: "Nom" },
  { name: "first_name", label: "Prénom" },
  { name: "specialty", label: "Spécialité" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Téléphone" },
  { name: "address", label: "Adresse" },
  { name: "github_url", label: "GitHub (lien)" },
  { name: "linkedin_url", label: "LinkedIn (lien)" },
];

export default function ManageProfile() {
  const { notify } = useNotify();
  const [form, setForm] = useState<Profile>(empty);
  const [uploading, setUploading] = useState(false);

  // Charger le profil existant
  useEffect(() => {
    supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const clean = Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, v ?? ""])
          ) as unknown as Profile;
          setForm(clean);
        }
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // Envoyer un fichier dans le bucket "portfolio"
  const uploadFile = async (file: File, folder: "images" | "cv") => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
  };

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: "images" | "cv",
    field: "image_url" | "cv_url"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, folder);
      setForm((prev) => ({ ...prev, [field]: url }));
      notify("success", "Fichier envoyé. Clique sur Enregistrer pour valider.");
    } catch {
      notify("error", "Échec de l'envoi du fichier.");
    }
    setUploading(false);
  };

  // Enregistrer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...values } = form;

    if (id) {
      const { error } = await supabase.from("profile").update(values).eq("id", id);
      if (error) notify("error", "Erreur lors de l'enregistrement.");
      else notify("success", "Profil bien enregistré.");
    } else {
      const { data, error } = await supabase
        .from("profile")
        .insert(values)
        .select()
        .single();
      if (error) notify("error", "Erreur lors de l'enregistrement.");
      else {
        setForm({ ...form, id: data.id });
        notify("success", "Profil bien enregistré.");
      }
    }
  };

  return (
    <>
      <h1 className="mb-4">Profil</h1>

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="row g-3">
          {fields.map((f) => (
            <div key={f.name} className="col-md-6">
              <label className="form-label">{f.label}</label>
              <input
                className="form-control"
                type={f.type ?? "text"}
                name={f.name}
                value={String(form[f.name] ?? "")}
                onChange={handleChange}
                required={f.name === "first_name" || f.name === "last_name"}
              />
            </div>
          ))}

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Photo</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e, "images", "image_url")}
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

          <div className="col-md-6">
            <label className="form-label">CV (PDF)</label>
            <input
              className="form-control"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFile(e, "cv", "cv_url")}
            />
            {form.cv_url && (
              <a href={form.cv_url} target="_blank" rel="noreferrer" className="d-block mt-2">
                Voir le CV actuel
              </a>
            )}
          </div>
        </div>

        <button className="btn btn-primary mt-4" type="submit" disabled={uploading}>
          {uploading ? "Envoi en cours..." : "Enregistrer"}
        </button>
      </form>
    </>
  );
}