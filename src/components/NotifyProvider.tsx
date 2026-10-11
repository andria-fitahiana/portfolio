import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { LuCircleCheck, LuCircleX, LuTriangleAlert } from "react-icons/lu";

type NotifyType = "success" | "error";

interface NotifyContextType {
  notify: (type: NotifyType, text: string) => void;
  confirmDialog: (text: string) => Promise<boolean>;
}

const NotifyContext = createContext<NotifyContextType | null>(null);

export function useNotify() {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify doit être utilisé dans NotifyProvider");
  return ctx;
}

export function NotifyProvider({ children }: { children: React.ReactNode }) {
  const [info, setInfo] = useState<{ type: NotifyType; text: string }>({
    type: "success",
    text: "",
  });
  const [infoOpen, setInfoOpen] = useState(false);

  const [confirmText, setConfirmText] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  // Fenêtre de succès / erreur
  const notify = useCallback((type: NotifyType, text: string) => {
    setInfo({ type, text });
    setInfoOpen(true);
  }, []);

  // Fenêtre de confirmation (retourne true ou false)
  const confirmDialog = useCallback((text: string) => {
    setConfirmText(text);
    setConfirmOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const answer = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setConfirmOpen(false);
  };

  return (
    <NotifyContext.Provider value={{ notify, confirmDialog }}>
      {children}

      {/* Succès / erreur */}
      <Modal
        show={infoOpen}
        onHide={() => setInfoOpen(false)}
        centered
        dialogClassName="notify-modal"
      >
        <Modal.Body className="text-center p-4">
          <div className={`notify-icon ${info.type}`}>
            {info.type === "success" ? <LuCircleCheck /> : <LuCircleX />}
          </div>
          <h5 className="mb-1">{info.type === "success" ? "Succès" : "Erreur"}</h5>
          <p className="text-muted mb-4">{info.text}</p>
          <button className="btn btn-primary px-4" onClick={() => setInfoOpen(false)}>
            OK
          </button>
        </Modal.Body>
      </Modal>

      {/* Confirmation */}
      <Modal
        show={confirmOpen}
        onHide={() => answer(false)}
        centered
        dialogClassName="notify-modal"
      >
        <Modal.Body className="text-center p-4">
          <div className="notify-icon warn">
            <LuTriangleAlert />
          </div>
          <h5 className="mb-1">Confirmation</h5>
          <p className="text-muted mb-4">{confirmText}</p>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-light px-4" onClick={() => answer(false)}>
              Annuler
            </button>
            <button className="btn btn-danger px-4" onClick={() => answer(true)}>
              Supprimer
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </NotifyContext.Provider>
  );
}