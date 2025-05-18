import React from "react";
import { useParams } from "react-router";
import modules from "../data/modules";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import "./ModulePage.css"; // Import the CSS file

export default function ModulePage() {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const module = modules.find((mod) => mod.id === moduleId);

  if (!module) return <div className="module-container">Module not found</div>;

  const handleComplete = async () => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      completedModules: arrayUnion(moduleId),
    });
    alert("Module marked as completed!");
  };

  return (
    <div className="module-container">
      <h2 className="module-title">{module.name}</h2>

      <div className="module-grid">
        {module.resources.map((res, idx) => (
          <div className={`module-card color-${(idx % 6) + 1}`} key={idx}>
            <div className="media-placeholder">
              📸 Paste image / meme / video here
            </div>
            <h3 className="resource-title">{res.title}</h3>
            {res.type === "text" && <p>{res.content}</p>}
            {res.type === "list" && (
              <ul>
                {res.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {res.type === "link" && (
              <a href={res.content} target="_blank" rel="noopener noreferrer">
                Open Khan Academy Path →
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="module-actions">
        <Link to="/quiz" className="btn btn-quiz">Take Quiz</Link>
        <button onClick={handleComplete} className="btn btn-complete">
          Mark as Completed
        </button>
      </div>
    </div>
  );
}
