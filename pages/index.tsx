import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { QuestionCard } from "@/components/question_card/QuestionCard";
import { appStrings } from "@/constants/appStrings";
import { Header } from "@/components/header/Header";

const { askQuestionButton, thinking } = appStrings;

const Home: NextPage = () => {
  const [completion, setCompletion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleClick = async (e: any) => {
    setLoading(true);
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: appStrings.prompt1 }),
    });
    const data = await response.json();
    setCompletion(data.response.content);
    setLoading(false);
  };

  return (
    <div className={styles.main}>
      <Header />
      <button onClick={handleClick} className={styles.button}>
        {askQuestionButton}
      </button>
      {loading && (
        <div className={styles.loading}>
          <p className={styles.loadingText}>{thinking}</p>
        </div>
      )}
      {completion && <QuestionCard response={completion} />}
    </div>
  );
};

export default Home;
