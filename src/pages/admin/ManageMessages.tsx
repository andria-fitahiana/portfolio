import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNotify } from "../../components/NotifyProvider";
import type { Message } from "../../types/message";

export default function ManageMessages() {
  const { notify, confirmDialog } = useNotify();
  const [items, setItems] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!(await confirmDialog("Supprimer ce message ?"))) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) notify("error", "Erreur lors de la suppression.");
    else {
      notify("success", "Message bien supprimé.");
      if (selected?.id === id) setSelected(null);
      load();
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <h1 className="mb-4">
        Messages <span className="badge bg-secondary fs-6 align-middle">{items.length}</span>
      </h1>

      <div className="row g-3">
        {/* Liste */}
        <div className="col-lg-5">
          <div className="card">
            <div className="list-group list-group-flush">
              {items.length === 0 && (
                <div className="list-group-item text-muted py-4 text-center">
                  Aucun message pour le moment.
                </div>
              )}
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    selected?.id === m.id ? "active" : ""
                  }`}
                  onClick={() => setSelected(m)}
                >
                  <div className="d-flex justify-content-between">
                    <strong>{m.name}</strong>
                    <small>{formatDate(m.created_at)}</small>
                  </div>
                  <div className="text-truncate small">{m.content}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Détail */}
        <div className="col-lg-7">
          {selected ? (
            <div className="card p-4">
              <h2 className="h5">{selected.name}</h2>
              <p className="text-muted mb-3">
                {selected.email} · {formatDate(selected.created_at)}
              </p>
              <p style={{ whiteSpace: "pre-wrap" }}>{selected.content}</p>

              <div className="d-flex gap-2 mt-3">
                <a
                  className="btn btn-primary"
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    "Re: votre message sur mon portfolio"
                  )}`}
                >
                  Répondre
                </a>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(selected.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-4 text-muted">Sélectionne un message pour le lire.</div>
          )}
        </div>
      </div>
    </>
  );
}