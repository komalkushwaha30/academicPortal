import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, role, loading } = useAuth(); // 👈 add loading

  // 🧭 Redirect once user and role are known
  useEffect(() => {
    if (!loading && user && role) {
      if (role === "admin") navigate("/admin");
      else if (role === "student") navigate("/dashboard");
    }
  }, [user, role, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === "admin") navigate("/admin");
        else if (role === "student") navigate("/dashboard");
        else setError("No valid role assigned.");
      } else {
        setError("User role not found.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Check credentials.");
    }
  };

  // ⏳ Show nothing or a loader while auth state is loading
  if (loading) {
    return <div className="container">Checking session...</div>;
  }

  // 🛑 If already logged in, don't show login page (handled by redirect above)
  if (user && role) return null;

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p>Please login to your account</p>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-msg">{error}</p>}
        </form>
        <p className="register-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
