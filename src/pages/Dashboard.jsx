import React, { useEffect, useState } from "react";
import modules from "../data/modules";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Dashboard.css"; // New CSS file

export default function Dashboard() {
  const [completed, setCompleted] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setCompleted(data.completedModules || []);
      }
    };
    fetchProgress();
  }, [user]);

  const progress = Math.round((completed.length / modules.length) * 100);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📘 Your Learning Modules</h2>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-text">Progress: {progress}%</p>

      {/* Module Grid */}
      <div className="module-grid">
        {modules.map((mod) => (
          <Link key={mod.id} to={`/module/${mod.id}`} className="module-card">
            <h3>
              {mod.name}
              {completed.includes(mod.id) && (
                <span className="completed-label">✔ Completed</span>
              )}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
