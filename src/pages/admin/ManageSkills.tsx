import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNotify } from "../../components/NotifyProvider";
import { categoryLabels, type Skill, type SkillCategory } from "../../types/skill";
import { LuPencil, LuTrash2 } from "react-icons/lu";

const empty: Skill = { category: "langage", name: "", level: 50 };

export default function ManageSkills() {
  const { notify, confirmDialog } = useNotify();
  const [items, setItems] = useState<Skill[]>([]);
  const [form, setForm] = useState<Skill>(empty);

  const load = async () => {
    const { data } = await supabase.from("skills").select("*").order("name");
    setItems(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  // Ajouter ou modifier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...values } = form;

    const { error } = id
      ? await supabase.from("skills").update(values).eq("id", id)
      : await supabase.from("skills").insert(values);

    if (error) {
      notify("error", "Erreur lors de l'enregistrement.");
      return;
    }
    notify("success", id ? "Compétence bien modifiée." : "Compétence bien ajoutée.");
    // On garde la catégorie pour pouvoir en ajouter plusieurs d'affilée
    setForm({ category: form.category, name: "", level: 50 });
    load();
  };

  // Supprimer
  const handleDelete = async (id: number) => {
    if (!(await confirmDialog("Supprimer cette compétence ?"))) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) notify("error", "Erreur lors de la suppression.");
    else {
      notify("success", "Compétence bien supprimée.");
      if (form.id === id) setForm(empty);
      load();
    }
  };

  return (
    <>
      <h1 className="mb-4">Compétences</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <h2 className="h5 mb-3">{form.id ? "Modifier la compétence" : "Ajouter une compétence"}</h2>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Catégorie</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as SkillCategory })}
            >
              {(Object.keys(categoryLabels) as SkillCategory[]).map((c) => (
                <option key={c} value={c}>{categoryLabels[c]}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Nom</label>
            <input
              className="form-control"
              placeholder="Ex : TypeScript"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Niveau : {form.level} %</label>
            <input
              className="form-range"
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
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

      {/* Liste regroupée par catégorie */}
      <div className="row g-3">
        {(Object.keys(categoryLabels) as SkillCategory[]).map((cat) => {
          const list = items.filter((s) => s.category === cat);
          return (
            <div key={cat} className="col-md-6">
              <div className="card h-100">
                <div className="card-header fw-semibold">
                  {categoryLabels[cat]}
                  <span className="badge bg-secondary ms-2">{list.length}</span>
                </div>
                <ul className="list-group list-group-flush">
                  {list.length === 0 && (
                    <li className="list-group-item text-muted">Aucune compétence.</li>
                  )}
                  {list.map((s) => (
                    <li
                      key={s.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {s.name} <span className="badge bg-primary ms-1">{s.level} %</span>
                      </span>
                      <span className="text-nowrap">
                        <button
                          className="btn btn-sm btn-outline-primary icon-btn me-2"
                          title="Modifier"
                          aria-label="Modifier"
                          onClick={() => {
                            setForm(s);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <LuPencil />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger icon-btn"
                          title="Supprimer"
                          aria-label="Supprimer"
                          onClick={() => handleDelete(s.id!)}
                        >
                          <LuTrash2 />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}