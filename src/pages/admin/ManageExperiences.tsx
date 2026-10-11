import { useEffect, useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { supabase } from "../../services/supabase";
import { useNotify } from "../../components/NotifyProvider";
import type { Experience } from "../../types/experience";
import MonthPicker from "../../components/MonthPicker";
import { formatMonth } from "../../utils/date";

const empty: Experience = {
  position: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
  technologies: [],
};


export default function ManageExperiences() {
  const { notify, confirmDialog } = useNotify();
  const [items, setItems] = useState<Experience[]>([]);
  const [form, setForm] = useState<Experience>(empty);
  const [techText, setTechText] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("start_date", { ascending: false });

    setItems(
      (data ?? []).map((e) => ({
        ...e,
        location: e.location ?? "",
        end_date: e.end_date ?? "",
        description: e.description ?? "",
        technologies: e.technologies ?? [],
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

  // Ajouter ou modifier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.is_current && form.end_date && form.end_date < form.start_date) {
      notify("error", "La date de fin doit être après la date de début.");
      return;
    }

    const { id, ...rest } = form;
    const values = {
      ...rest,
      end_date: form.is_current ? null : form.end_date || null,
      technologies: techText.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const { error } = id
      ? await supabase.from("experiences").update(values).eq("id", id)
      : await supabase.from("experiences").insert(values);

    if (error) {
      notify("error", "Erreur lors de l'enregistrement.");
      return;
    }
    notify("success", id ? "Expérience bien modifiée." : "Expérience bien ajoutée.");
    reset();
    load();
  };

  // Supprimer
  const handleDelete = async (id: number) => {
    if (!(await confirmDialog("Supprimer cette expérience ?"))) return;
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) notify("error", "Erreur lors de la suppression.");
    else {
      notify("success", "Expérience bien supprimée.");
      if (form.id === id) reset();
      load();
    }
  };

  const startEdit = (x: Experience) => {
    setForm(x);
    setTechText(x.technologies.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <h1 className="mb-4">Expériences</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <h2 className="h5 mb-3">
          {form.id ? "Modifier l'expérience" : "Ajouter une expérience"}
        </h2>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Fonction</label>
            <input
              className="form-control"
              name="position"
              placeholder="Ex : Stagiaire, Développeur..."
              value={form.position}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nom de l'entreprise</label>
            <input
              className="form-control"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <MonthPicker
              label="Date de début"
              value={form.start_date}
              onChange={(v) => setForm({ ...form, start_date: v })}
              required
            />
          </div>
          <div className="col-md-4">
            <MonthPicker
              label="Date de fin"
              value={form.end_date}
              onChange={(v) => setForm({ ...form, end_date: v })}
              disabled={form.is_current}
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="is_current"
                checked={form.is_current}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_current: e.target.checked,
                    end_date: e.target.checked ? "" : form.end_date,
                  })
                }
              />
              <label className="form-check-label" htmlFor="is_current">
                Poste actuel
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Lieu</label>
            <input
              className="form-control"
              name="location"
              placeholder="Ex : Antananarivo, Madagascar"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Technologies (séparées par des virgules)</label>
            <input
              className="form-control"
              placeholder="React, TypeScript, PostgreSQL"
              value={techText}
              onChange={(e) => setTechText(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {form.id ? "Mettre à jour" : "Ajouter"}
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
                <th>Poste</th>
                <th>Période</th>
                <th>Lieu</th>
                <th>Technologies</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    Aucune expérience pour le moment.
                  </td>
                </tr>
              )}
              {items.map((x) => (
                <tr key={x.id}>
                  <td>
                    <div className="fw-semibold">{x.position}</div>
                    <small className="text-muted">{x.company}</small>
                  </td>
                  <td className="text-nowrap">
                    {formatMonth(x.start_date)} -{" "}
                    {x.is_current ? "Aujourd'hui" : formatMonth(x.end_date)}
                  </td>
                  <td>{x.location || "-"}</td>
                  <td>
                    {x.technologies.map((t) => (
                      <span key={t} className="badge bg-light text-dark border me-1">
                        {t}
                      </span>
                    ))}
                  </td>
                  <td className="text-end text-nowrap">
                    <button
                      className="btn btn-sm btn-outline-primary icon-btn me-2"
                      title="Modifier"
                      aria-label="Modifier"
                      onClick={() => startEdit(x)}
                    >
                      <LuPencil />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger icon-btn"
                      title="Supprimer"
                      aria-label="Supprimer"
                      onClick={() => handleDelete(x.id!)}
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