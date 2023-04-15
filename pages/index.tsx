import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { QuestionCard } from "@/components/question_card/QuestionCard";
import { appStrings } from "@/constants/appStrings";
import { Header } from "@/components/header/Header";
import { AnswerField } from "@/components/answer_field/AnswerField";

const { askQuestionButton, thinking } = appStrings;
const { askQuestionPrompt } = appStrings.aiPrompts;

const Home: NextPage = () => {
  const [completion, setCompletion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [answerInput, setAnswerInput] = React.useState<string>("");

  const handleClick = async (e: any) => {
    setLoading(true);
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: askQuestionPrompt, maxTokens: 250 }),
    });
    const data = await response.json();
    setCompletion(data.response.content);
    setLoading(false);
  };

  const handleSubmit = () => {
    localStorage.setItem(JSON.stringify(completion), answerInput);
  };

  return (
    <div className={styles.main}>
      <Header />

      <div className={styles.container}>
        <button onClick={handleClick} className={styles.button}>
          {askQuestionButton}
        </button>
        {loading && (
          <div className={styles.loading}>
            <p className={styles.loadingText}>{thinking}</p>
          </div>
        )}
        {completion && (
          <>
            <QuestionCard response={completion} />
            <AnswerField
              onChange={(e) => setAnswerInput(e)}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
