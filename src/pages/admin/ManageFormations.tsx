import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNotify } from "../../components/NotifyProvider";
import type { Formation } from "../../types/formation";
import { LuPencil, LuTrash2 } from "react-icons/lu";

const empty: Formation = { degree: "", level: "", school: "", year: "" };

export default function ManageFormations() {
  const { notify, confirmDialog } = useNotify();
  const [items, setItems] = useState<Formation[]>([]);
  const [form, setForm] = useState<Formation>(empty);

  const load = async () => {
    const { data } = await supabase
      .from("formations")
      .select("*")
      .order("id", { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Ajouter ou modifier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...values } = form;

    const { error } = id
      ? await supabase.from("formations").update(values).eq("id", id)
      : await supabase.from("formations").insert(values);

    if (error) {
      notify("error", "Erreur lors de l'enregistrement.");
      return;
    }
    notify("success", id ? "Formation bien modifiée." : "Formation bien ajoutée.");
    setForm(empty);
    load();
  };

  // Supprimer
  const handleDelete = async (id: number) => {
    if (!(await confirmDialog("Supprimer cette formation ?"))) return;
    const { error } = await supabase.from("formations").delete().eq("id", id);
    if (error) notify("error", "Erreur lors de la suppression.");
    else {
      notify("success", "Formation bien supprimée.");
      if (form.id === id) setForm(empty);
      load();
    }
  };

  return (
    <>
      <h1 className="mb-4">Formations</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <h2 className="h5 mb-3">{form.id ? "Modifier la formation" : "Ajouter une formation"}</h2>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Diplôme</label>
            <input
              className="form-control"
              name="degree"
              placeholder="Ex : Licence en Informatique"
              value={form.degree}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Niveau</label>
            <input
              className="form-control"
              name="level"
              placeholder="Ex : Bac+3"
              value={form.level}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Où (établissement)</label>
            <input
              className="form-control"
              name="school"
              value={form.school}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Année</label>
            <input
              className="form-control"
              name="year"
              placeholder="Ex : 2023 - 2026"
              value={form.year}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {form.id ? "Mettre à jour" : "Ajouter"}
          </button>
          {form.id && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setForm(empty)}
            >
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
                <th>Diplôme</th>
                <th>Niveau</th>
                <th>Établissement</th>
                <th>Année</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    Aucune formation pour le moment.
                  </td>
                </tr>
              )}
              {items.map((f) => (
                <tr key={f.id}>
                  <td>{f.degree}</td>
                  <td>{f.level}</td>
                  <td>{f.school}</td>
                  <td>{f.year}</td>
                  <td className="text-end text-nowrap">
                    <button
                      className="btn btn-sm btn-outline-primary icon-btn me-2"
                      title="Modifier"
                      aria-label="Modifier"
                      onClick={() => {
                        setForm(f);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <LuPencil />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger icon-btn"
                      title="Supprimer"
                      aria-label="Supprimer"
                      onClick={() => handleDelete(f.id!)}
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