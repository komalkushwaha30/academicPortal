import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const logoUrl = "data:image/png;base64,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"; // or your logo path

export default function Navbar() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => signOut(auth);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong while logging out.");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <span className="brand">
          <img
            src={logoUrl}
            alt="NavGurukul Logo"
            style={{ height: "40px", verticalAlign: "middle" }}
          />
        </span>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/notices" onClick={() => setMenuOpen(false)}>Notice Board</Link>
          <Link to="/quiz" onClick={() => setMenuOpen(false)}>Quiz Page</Link>
          <Link to="/discussion" onClick={() => setMenuOpen(false)}>Discussion Zone</Link>
          {role === "admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          )}
          {user && (
            <>
              <div className="profile-info">
                <span className="profile-icon" title={user.email}>
                  {/* Simple user icon SVG */}
                  <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24" style={{ verticalAlign: "middle", marginRight: "4px" }}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/>
                  </svg>
                  <span style={{ fontSize: "0.95em" }}>{user.email}</span>
                </span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
