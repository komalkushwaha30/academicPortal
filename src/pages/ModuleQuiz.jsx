import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ModuleQuiz() {
  const { moduleId } = useParams();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);

  useEffect(() => {
    fetch(`https://opentdb.com/api.php?amount=5&category=18&type=multiple`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((q) => ({
          question: q.question,
          correct: q.correct_answer,
          options: shuffle([q.correct_answer, ...q.incorrect_answers]),
        }));
        setQuestions(formatted);
      });
  }, []);

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const handleAnswer = async (answer) => {
    if (answer === questions[index].correct) {
      setScore((prev) => prev + 1);
    }

    if (index + 1 < questions.length) {
      setIndex((prev) => prev + 1);
    } else {
      setQuizOver(true);
      await saveScore();
    }
  };

  const saveScore = async () => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    const data = docSnap.data();
    const scores = data.quizScores || {};

    await updateDoc(userRef, {
      quizScores: {
        ...scores,
        [moduleId]: score,
      },
    });
  };

  if (questions.length === 0) return <p>Loading quiz...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧠 Quiz - {moduleId.toUpperCase()}</h2>
      {quizOver ? (
        <div className="text-center text-xl font-semibold">
          🎉 Quiz Completed! Your Score: {score}/{questions.length}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{questions[index].question}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {questions[index].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="bg-blue-200 px-4 py-2 rounded hover:bg-blue-300"
              >
                {opt}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">Question {index + 1} of {questions.length}</p>
        </div>
      )}
    </div>
  );
}
