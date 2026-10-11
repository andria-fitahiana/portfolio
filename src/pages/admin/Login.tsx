import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuUser, LuMail, LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { supabase } from "../../services/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Email ou mot de passe incorrect");
    else navigate("/admin");
  };

  return (
    <div className="app-bg login-wrap">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-avatar">
          <LuUser />
        </div>

        <h1>Connexion</h1>
        <p className="login-sub">Bienvenue ! Connecte-toi pour continuer.</p>

        <div className="input-icon">
          <LuMail />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-icon">
          <LuLock />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="has-toggle"
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <LuEyeOff /> : <LuEye />}
          </button>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <button className="login-btn" type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}