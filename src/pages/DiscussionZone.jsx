import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import "./DiscussionZone.css";

export default function DiscussionZone() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [replyInputs, setReplyInputs] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await getDocs(collection(db, "discussions"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
    await addDoc(collection(db, "discussions"), {
      question: newQuestion,
      author: user.email,
      timestamp: new Date(),
      replies: [],
    });
    setNewQuestion("");
    window.location.reload(); // quick refresh
  };

  const handleReply = async (questionId) => {
    const replyText = replyInputs[questionId];
    if (!replyText.trim()) return;

    const questionRef = doc(db, "discussions", questionId);
    const question = questions.find((q) => q.id === questionId);
    const updatedReplies = [
      ...(question.replies || []),
      {
        text: replyText,
        author: user.email,
        timestamp: new Date(),
      },
    ];
    await updateDoc(questionRef, { replies: updatedReplies });
    setReplyInputs({ ...replyInputs, [questionId]: "" });
    window.location.reload(); // update
  };

  return (
    <div className="discussion-zone">
      <h2>💬 Discussion Zone</h2>

      <div className="post-box">
        <textarea
          placeholder="Post a question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button onClick={handlePostQuestion}>Post</button>
      </div>

      <div className="questions-list">
        {questions.map((q) => (
          <div key={q.id} className="question-item">
            <div className="question">
              <strong>{q.author}</strong>: {q.question}
            </div>
            <div className="replies">
              {q.replies?.map((r, i) => (
                <div key={i} className="reply">
                  <span><strong>{r.author}</strong>: {r.text}</span>
                </div>
              ))}
            </div>
            <div className="reply-box">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyInputs[q.id] || ""}
                onChange={(e) =>
                  setReplyInputs({ ...replyInputs, [q.id]: e.target.value })
                }
              />
              <button onClick={() => handleReply(q.id)}>Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
