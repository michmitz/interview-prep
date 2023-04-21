import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { QuestionCard } from "@/components/atoms/question_card/QuestionCard";
import { appStrings } from "@/constants/appStrings";
import { Header } from "@/components/atoms/header/Header";
import { AnswerField } from "@/components/atoms/answer_field/AnswerField";
import { SubjectField } from "@/components/atoms/subject_field/SubjectField";
import { QuestionNotesSection } from "@/components/molecules/question_notes_section/QuestionNotesSection";

const { askQuestionButton, thinking } = appStrings;
const { askQuestionPrompt } = appStrings.aiPrompts;

export type InterviewMode = "subject" | "general";

const Home: NextPage = () => {
  const [completion, setCompletion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<InterviewMode>("general");
  const [subject, setSubject] = React.useState<string>("JavaScript");

  // const addNote = (note: any) => {
  //   setUpdatedNotes([...updatedNotes, note]);
  // };


  const handleClick = async (e: any) => {
    const content =
      mode === "subject"
        ? `${askQuestionPrompt} The interview subject is ${subject}.`
        : askQuestionPrompt;
    setLoading(true);
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: content, maxTokens: 250 }),
    });
    const data = await response.json();
    if (data) {
      setCompletion(data.response.content);
    }
    setLoading(false);
  };

  const handleModeClick = (mode: InterviewMode) => {
    setCompletion("");
    mode === "general" ? setMode("subject") : setMode("general");
  };

  const onSubjectChange = (value: string) => {
    setSubject(value);
  };

  return (
    <div className={styles.main}>
      <Header mode={mode} onModeClick={handleModeClick} />

      <div className={styles.container}>
        {mode === "subject" && (
          <div>
            <SubjectField onChange={onSubjectChange} />
          </div>
        )}
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
           <QuestionNotesSection aiResponse={completion} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
