import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { QuestionCard } from "@/components/question_card/QuestionCard";
import { appStrings } from "@/constants/appStrings";
import { Header } from "@/components/header/Header";
import { AnswerField } from "@/components/answer_field/AnswerField";
import { SubjectDropdownContainer } from "@/components/subject_dropdown/SubjectDropdownContainer";

const { askQuestionButton, thinking } = appStrings;
const { askQuestionPrompt } = appStrings.aiPrompts;

export type InterviewMode = 'subject' | 'general'

const Home: NextPage = () => {
  const [completion, setCompletion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [answerInput, setAnswerInput] = React.useState<string>("");
  const [mode, setMode] = React.useState<InterviewMode>('general');
  const [subject, setSubject] = React.useState<string>('');

  const handleClick = async (e: any) => {
    const content = subject ? `${askQuestionPrompt} The interview subject is ${subject}.` : askQuestionPrompt;
    setLoading(true);
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: content, maxTokens: 250 }),
    });
    const data = await response.json();
    setCompletion(data.response.content);
    setLoading(false);
  };

  const handleSubmit = () => {
    localStorage.setItem(JSON.stringify(completion), answerInput);
  };

  const handleModeClick = (mode: InterviewMode) => {
    mode === 'general' ? setMode('subject') : setMode('general')
  }

  const onSubjectChange = (value: string) => {
    setSubject(value)
  }

  return (
    <div className={styles.main}>
      <Header mode={mode} onModeClick={handleModeClick} />

      <div className={styles.container}>
        {
          mode === 'subject' && <SubjectDropdownContainer onChange={onSubjectChange} />
        }
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
