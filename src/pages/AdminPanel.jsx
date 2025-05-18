import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "./AdminPanel.css"; // Import the CSS file

export default function AdminNoticePanel() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchNotices = async () => {
    const snapshot = await getDocs(collection(db, "notices"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotices(data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAdd = async () => {
    if (!title.trim() || !body.trim()) return alert("Both fields are required.");
    await addDoc(collection(db, "notices"), {
      title,
      body,
      date: new Date().toLocaleDateString(),
    });
    setTitle("");
    setBody("");
    fetchNotices();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notices", id));
    fetchNotices();
  };

  const handleEdit = (notice) => {
    setEditId(notice.id);
    setTitle(notice.title);
    setBody(notice.body);
  };

  const handleUpdate = async () => {
    if (!title.trim() || !body.trim()) return alert("Both fields are required.");
    await updateDoc(doc(db, "notices", editId), {
      title,
      body,
    });
    setEditId(null);
    setTitle("");
    setBody("");
    fetchNotices();
  };

  return (
    <div className="admin-notice-panel">
      <h2>📢 Admin Notice Panel</h2>

      <div className="form-group">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notice Title"
          className="input-title"
          type="text"
        />
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Notice Body"
          className="input-body"
          type="text"
        />
        {editId ? (
          <button onClick={handleUpdate} className="btn-update">
            Update Notice
          </button>
        ) : (
          <button onClick={handleAdd} className="btn-add">
            Add Notice
          </button>
        )}
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setTitle("");
              setBody("");
            }}
            className="btn-cancel"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <ul>
        {notices.map((notice) => (
          <li key={notice.id}>
            <div className="notice-info">
              <h3>{notice.title}</h3>
              <p>{notice.body}</p>
              <p className="date">{notice.date}</p>
            </div>
            <div className="actions">
              <button
                onClick={() => handleEdit(notice)}
                className="edit-btn"
                aria-label={`Edit ${notice.title}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(notice.id)}
                className="delete-btn"
                aria-label={`Delete ${notice.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
