import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { QuestionCard } from "@/components/question_card/QuestionCard";
import { appStrings } from "@/constants/appStrings";
import { Header } from "@/components/header/Header";
import { AnswerField } from "@/components/answer_field/AnswerField";
import { SubjectField } from "@/components/subject_field/SubjectField";

const { askQuestionButton, thinking } = appStrings;
const { askQuestionPrompt } = appStrings.aiPrompts;

export type InterviewMode = "subject" | "general";

const Home: NextPage = () => {
  const [completion, setCompletion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [answerInput, setAnswerInput] = React.useState<string>("");
  const [mode, setMode] = React.useState<InterviewMode>("general");
  const [subject, setSubject] = React.useState<string>("JavaScript");
  const [updatedNotes, setUpdatedNotes] = React.useState<any>([]);
  const [noteMessage, setNoteMessage] = React.useState<string>("");

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

  const handleSubmitNote = async () => {
    const data = {
      question: completion.split("Answer:")[0],
      advice: completion.split("Answer")[1],
      note: answerInput,
    };

    const response = await fetch("/api/note/create_note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      console.log("Response", response);
      console.log("data", data);
      setNoteMessage("Note successfully created");
      setUpdatedNotes([...updatedNotes, data]);
    } else {
      setNoteMessage("Note failed")
    }
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
            <QuestionCard response={completion} />
            <AnswerField
              onChange={(e) => setAnswerInput(e)}
              onSubmit={handleSubmitNote}
            />
          </>
        )}
        {/* Temporary success note */}
        {noteMessage && (
          <div
            style={{
              width: 200,
              height: 50,
              backgroundColor: "gray",
              color: "black",
              marginTop: 10,
              padding: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p>{noteMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
