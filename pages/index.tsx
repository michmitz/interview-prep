import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { appStrings } from "@/constants/appStrings";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { SubjectField } from "@/components/atoms/subject_field/SubjectField";
import { QuestionNotesSection } from "@/components/molecules/question_notes_section/QuestionNotesSection";
import { useSession, signIn } from "next-auth/react";
import { RaisedButton } from "@/components/atoms/button/RaisedButton";
import { SpeechBubblePrompt } from "@/components/molecules/speech_bubble_prompt/SpeechBubblePrompt";
import { ThinkingRobot } from "@/components/molecules/thinking_robot/ThinkingRobot";

const { thinking } = appStrings;
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
      <div className="container">
        <div className="sidebar">
          <Sidebar
            headerText={welcome}
            mode={mode}
            onModeClick={handleModeClick}
            isLoggedIn={true}
            user={session?.user?.email}
          />
        </div>

        <div className="rightContainer">
          {mode === "subject" ? (
            <div>
              <SubjectField onChange={onSubjectChange} />
              <RaisedButton
                onClick={handleClick}
                text="Fetch Question"
                height="35px"
                width="200px"
                disabled={questionLoading}
              />
            </div>
          ) : (
            !completion &&
            !questionLoading && (
              <SpeechBubblePrompt
                onClick={handleClick}
                disableButton={questionLoading}
              />
            )
          )}

          {questionLoading && <ThinkingRobot />}

          {completion && (
            <>
              <QuestionNotesSection
                aiResponse={completion}
                noteResponse={noteResponse}
                setNoteResponse={setNoteResponse}
              />
              <RaisedButton
                onClick={handleClick}
                text="Fetch Question"
                height="35px"
                width="200px"
                disabled={questionLoading}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
};

export default Home;
