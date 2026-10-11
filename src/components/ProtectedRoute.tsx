import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLogged(!!data.session);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Chargement...</p>;
  return logged ? <>{children}</> : <Navigate to="/admin/login" replace />;
}