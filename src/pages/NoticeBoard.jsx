import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./NoticeBoard.css"; // Import the CSS file

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const snapshot = await getDocs(collection(db, "notices"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotices(data);
    };
    fetchNotices();
  }, []);

  return (
    <div className="noticeboard-container">
      <h2 className="noticeboard-title">📢 Latest Notices</h2>
      {notices.length === 0 ? (
        <p className="no-notice-text">No notices posted yet.</p>
      ) : (
        <ul className="notice-list">
          {notices.map(notice => (
            <li key={notice.id} className="notice-card">
              <h3 className="notice-title">{notice.title}</h3>
              <p className="notice-body">{notice.body}</p>
              <p className="notice-date">{notice.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
