import React from "react";
import { InterviewMode } from "@/components/atoms/sidebar/Sidebar";
import { SubjectField } from "@/components/atoms/subject_field/SubjectField";
import { QuestionNotesSection } from "../question_notes_section/QuestionNotesSection";
import { ThinkingRobot } from "../thinking_robot/ThinkingRobot";
import { SpeechBubblePrompt } from "../speech_bubble_prompt/SpeechBubblePrompt";
import { appStrings } from "@/constants/appStrings";
import styles from "./ContentContainer.module.css";

interface ContentContainerProps {
  readonly mode: InterviewMode;
  readonly completion: string;
  readonly setCompletion: (v: string) => void;
  readonly softwareQuestionType?: string;
  readonly techQuestionSubject: string;
  readonly onTechQuestionSubjectChange: (v: string) => void;
}

const { questionPromptButtonText } = appStrings.speechBubble;
const { askQuestionPrompt } = appStrings.aiPrompts;
const { jobTitleFieldLabel, jobTitleFieldPlaceholder } =
  appStrings.mode.jobTitle;

export const ContentContainer: React.FC<ContentContainerProps> = ({
  mode,
  completion,
  setCompletion,
  softwareQuestionType,
  techQuestionSubject,
  onTechQuestionSubjectChange,
}) => {
  const jobMode = mode === "job-title";
  const techSubjectQuestions =
    mode === "software" && softwareQuestionType === "technical (subject)";
  const generalTechQuestions =
    mode === "software" && softwareQuestionType === "technical (general)";
  const softSkillsQuestions =
    mode === "software" && softwareQuestionType === "soft skills";
  const [questionLoading, setQuestionLoading] = React.useState<boolean>(false);
  const [jobTitle, setJobTitle] = React.useState<string>("");
  const [toggleSubjectField, setToggleSubjectField] =
    React.useState<boolean>(jobMode);
  const [noteResponse, setNoteResponse] = React.useState<string>("");

  React.useEffect(() => {
    if (jobMode || techSubjectQuestions) {
      setToggleSubjectField(true);
    }
  }, [jobMode, techSubjectQuestions]);

  const generatePrompt = (
    mode: InterviewMode,
    softwareQuestionType: string | undefined
  ): string => {
    const softwareMode = mode === "software";

    if (softwareMode) {
      if (softwareQuestionType === "technical (general)") {
        return "Pretend you are interviewing me for a software engineer position. Ask me one question, then give me an example answer. Label the question and answer. Ask me only technical questions.";
      } else if (softwareQuestionType === "soft skills") {
        return "Pretend you are interviewing me for a software engineer position. Ask me one question, then give me an example answer. Label the question and answer. Ask me only soft skills questions.";
      } else if (
        softwareQuestionType === "technical (subject)" &&
        techQuestionSubject
      ) {
        return `Pretend you are interviewing me for a software engineer position. Ask me one question, then give me an example answer. Label the question and answer. The interview subject is ${techQuestionSubject}`;
      } else {
        return askQuestionPrompt;
      }
    } else {
      return `Pretend you are interviewing me for a ${jobTitle} position. Ask me one question, then give me an example answer. Label the question and answer.`;
    }
  };

  const handleClick = async (e: any) => {
    setToggleSubjectField(false);
    const prompt = generatePrompt(mode, softwareQuestionType);
    setCompletion("");
    setNoteResponse("");
    setQuestionLoading(true);

    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: prompt, maxTokens: 200 }),
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
    <div style={{ width: "100%" }} className="flexCenter">
      {!questionLoading ? (
        <div style={{ width: "100%" }} className="flexCenter">
          {completion && !toggleSubjectField ? (
            <div className={styles.questionNotesSection}>
              <QuestionNotesSection
                aiResponse={completion}
                setNoteResponse={setNoteResponse}
                onSubmit={handleClick}
                questionLoading={questionLoading}
                setToggleSubjectField={setToggleSubjectField}
                allowSubjectField={jobMode || techSubjectQuestions}
                noteSubject={
                  jobMode
                    ? jobTitle
                    : techSubjectQuestions
                    ? techQuestionSubject
                    : softSkillsQuestions
                    ? "Soft Skills"
                    : "General Tech Questions"
                }
              />
              {noteResponse && (
                <div className={styles.noteResponseContainer}>
                  <div className={`${styles.noteResponse} mutedPurpleGradient`}>
                    {noteResponse}
                  </div>
                </div>
              )}
            </div>
          ) : jobMode ? (
            <SubjectField
              onChange={onJobTitleChange}
              label={jobTitleFieldLabel}
              placeholder={jobTitleFieldPlaceholder}
              onClick={handleClick}
              buttonText={questionPromptButtonText}
              buttonDisabled={questionLoading}
            />
          ) : techSubjectQuestions ? (
            <SubjectField
              onChange={onTechQuestionSubjectChange}
              label="Enter a technology"
              placeholder="ex. JavaScript"
              onClick={handleClick}
              buttonText={questionPromptButtonText}
              buttonDisabled={questionLoading}
            />
          ) : (
            <SpeechBubblePrompt
              text={
                softSkillsQuestions
                  ? "Ready to be asked about your soft skills?"
                  : generalTechQuestions
                  ? "Ready for some technical questions?"
                  : "Let's do some software interview questions!"
              }
              onClick={handleClick}
              disableButton={questionLoading}
              buttonText={questionPromptButtonText}
            />
          )}
        </div>
      ) : (
        <ThinkingRobot />
      )}
    </div>
  );
};
