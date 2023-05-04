import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { appStrings } from "@/constants/appStrings";
import { Header } from "@/components/atoms/header/Header";
import { SubjectField } from "@/components/atoms/subject_field/SubjectField";
import { QuestionNotesSection } from "@/components/molecules/question_notes_section/QuestionNotesSection";
import { LoadingOutlined } from "@ant-design/icons";
import { useSession, signIn, signOut } from "next-auth/react";

const { askQuestionButton, thinking } = appStrings;
const { askQuestionPrompt } = appStrings.aiPrompts;
const { welcome } = appStrings.header;

export type InterviewMode = "subject" | "general";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [completion, setCompletion] = React.useState<string>("");
  const [questionLoading, setQuestionLoading] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<InterviewMode>("general");
  const [subject, setSubject] = React.useState<string>("JavaScript");
  const [noteResponse, setNoteResponse] = React.useState<string>("");

  const disabledButtonStyles = `${styles.button} ${styles.disabledButton}`;

  const handleClick = async (e: any) => {
    setCompletion("");
    setNoteResponse("");
    const content =
      mode === "subject"
        ? `${askQuestionPrompt} The interview subject is ${subject}.`
        : askQuestionPrompt;
    setQuestionLoading(true);
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
    setQuestionLoading(false);
  };

  const handleModeClick = (mode: InterviewMode) => {
    setCompletion("");
    mode === "general" ? setMode("subject") : setMode("general");
  };

  const onSubjectChange = (value: string) => {
    setSubject(value);
  };

  if (session) {
    return (
      <div>
        <Header
          headerText={welcome}
          mode={mode}
          onModeClick={handleModeClick}
        />

        <>
          Signed in as {session?.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>

        <div className={styles.container}>
          {mode === "subject" && (
            <div>
              <SubjectField onChange={onSubjectChange} />
            </div>
          )}
          <button
            onClick={handleClick}
            className={questionLoading ? disabledButtonStyles : styles.button}
            disabled={questionLoading}
          >
            {questionLoading ? <LoadingOutlined /> : askQuestionButton}
          </button>
          {questionLoading && (
            <div className={styles.loading}>
              <p className={styles.loadingText}>{thinking}</p>
            </div>
          )}
          {completion && (
            <>
              <QuestionNotesSection
                aiResponse={completion}
                noteResponse={noteResponse}
                setNoteResponse={setNoteResponse}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    </div>
  );
};

export default Home;
