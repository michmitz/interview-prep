import { RaisedButton } from "@/components/atoms/button/RaisedButton";
import { InterviewMode } from "@/components/atoms/sidebar/Sidebar";
import { SubjectField } from "@/components/atoms/subject_field/SubjectField";
import React from "react";
import { QuestionNotesSection } from "../question_notes_section/QuestionNotesSection";
import { ThinkingRobot } from "../thinking_robot/ThinkingRobot";
import { SpeechBubblePrompt } from "../speech_bubble_prompt/SpeechBubblePrompt";
import { appStrings } from "@/constants/appStrings";

interface ContentContainerProps {
  readonly mode: InterviewMode;
  readonly noteResponse: string;
  readonly setNoteResponse: (v: string) => void;
  readonly completion: string;
  readonly setCompletion: (v: string) => void;
}

const { questionPromptText, questionPromptButtonText } =
  appStrings.speechBubble;
const { getNewQuestion } = appStrings;
const { askQuestionPrompt } = appStrings.aiPrompts;

export const ContentContainer: React.FC<ContentContainerProps> = ({
  mode,
  noteResponse,
  setNoteResponse,
  completion,
  setCompletion
}) => {
  const [questionLoading, setQuestionLoading] = React.useState<boolean>(false);
  const [jobTitle, setJobTitle] = React.useState<string>("");

  const handleClick = async (e: any) => {
    setCompletion("");
    setNoteResponse("");
    const content =
      mode === "job-title"
        ? `Pretend you are interviewing me for a ${jobTitle} position. Ask me one question, then give me an example answer. Label the question and answer.`
        : askQuestionPrompt;
    setQuestionLoading(true);
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: content, maxTokens: 200 }),
    });
    const data = await response.json();
    if (data) {
      setCompletion(data.response.content);
    }
    setQuestionLoading(false);
  };

  const onJobTitleChange = (value: string) => {
    setJobTitle(value);
  };

  return (
    <div>
      {mode === "job-title" ? (
        <>
          <SubjectField onChange={onJobTitleChange} />
          {!completion && (
            <div className="questionButton">
              <RaisedButton
                onClick={handleClick}
                text={questionPromptButtonText}
                height="35px"
                width="200px"
                disabled={questionLoading}
              />
            </div>
          )}
        </>
      ) : (
        !completion &&
        !questionLoading && (
          <SpeechBubblePrompt
            text={questionPromptText}
            onClick={handleClick}
            disableButton={questionLoading}
            buttonText={questionPromptButtonText}
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
          <div className="questionButton">
            <RaisedButton
              onClick={handleClick}
              text={getNewQuestion}
              height="35px"
              width="200px"
              disabled={questionLoading}
            />
          </div>
        </>
      )}
    </div>
  );
};
