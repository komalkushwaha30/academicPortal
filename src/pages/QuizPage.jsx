import React, { useEffect, useState } from "react";
import "./QuizPage.css"; // Import the CSS

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=18&type=multiple")
      .then(res => res.json())
      .then(data => {
        const formatted = data.results.map((q) => ({
          question: q.question,
          correct: q.correct_answer,
          options: shuffle([q.correct_answer, ...q.incorrect_answers]),
        }));
        setQuestions(formatted);
      });
  }, []);

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  const handleAnswer = (option) => {
    if (option === questions[index].correct) {
      setScore(score + 1);
    }
    const next = index + 1;
    if (next < questions.length) {
      setIndex(next);
    } else {
      setCompleted(true);
    }
  };

  if (!questions.length) return <div className="quiz-container">Loading quiz...</div>;

  if (completed) {
    return (
      <div className="quiz-container result">
        <h2>🎉 Quiz Completed!</h2>
        <p>Your Score:</p>
        <div className="score-box">{score} / {questions.length}</div>
        <p className="message">{score >= 3 ? "Great job! 🧠" : "Keep practicing! 💪"}</p>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div className="quiz-container">
      <h2 className="question-number">Question {index + 1}</h2>
      <p
        className="question-text"
        dangerouslySetInnerHTML={{ __html: current.question }}
      ></p>
      <div className="options">
        {current.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option)}
            className="option-btn"
            dangerouslySetInnerHTML={{ __html: option }}
          />
        ))}
      </div>
    </div>
  );
}
