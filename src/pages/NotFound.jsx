import React from "react";

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center", padding: "3rem 0" }}>
      <h1 style={{ fontSize: "3rem", color: "#1e3a8a" }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a href="/dashboard" style={{ color: "#2563eb", textDecoration: "underline" }}>Go to Dashboard</a>
    </div>
  );
}