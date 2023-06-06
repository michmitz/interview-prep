import React from "react";
import { InterviewMode } from "@/components/atoms/sidebar/Sidebar";
import { SubjectField } from "@/components/atoms/subject_field/SubjectField";
import { QuestionNotesSection } from "../question_notes_section/QuestionNotesSection";
import { ThinkingRobot } from "../thinking_robot/ThinkingRobot";
import { SpeechBubblePrompt } from "../speech_bubble_prompt/SpeechBubblePrompt";
import { appStrings } from "@/constants/appStrings";
import styles from "./ContentContainer.module.css";
import { ChatCompletionRequestMessage } from "openai";

interface ContentContainerProps {
  readonly mode: InterviewMode;
  readonly completion: string;
  readonly setCompletion: (v: string) => void;
  readonly softwareQuestionType?: string;
  readonly techQuestionSubject: string;
  readonly setTechQuestionSubject: (v: string) => void;
}

const { questionPromptButtonText } = appStrings.speechBubble;
const { jobTitleFieldLabel, jobTitleFieldPlaceholder } =
  appStrings.mode.jobTitle;

export const ContentContainer: React.FC<ContentContainerProps> = ({
  mode,
  completion,
  setCompletion,
  softwareQuestionType,
  techQuestionSubject,
  setTechQuestionSubject,
}) => {
  const jobMode = mode === "job-title";
  const softwareMode = mode === "software";
  const [questionLoading, setQuestionLoading] = React.useState<boolean>(false);
  const [jobTitle, setJobTitle] = React.useState<string>("");
  const [noteResponse, setNoteResponse] = React.useState<string>("");
  const [toggleSubjectField, setToggleSubjectField] =
    React.useState<boolean>(jobMode);
  
  
  const techSubjectQuestions =
    softwareMode && softwareQuestionType === "technical (subject)";
  const generalTechQuestions =
    softwareMode && softwareQuestionType === "technical (general)";
  const softSkillsQuestions =
    softwareMode && softwareQuestionType === "soft skills";
  // const jobQuestionSubject = mode === 'job-title' && jobTitle

  const softwareSubject = generalTechQuestions
    ? "general technical question"
    : softSkillsQuestions
    ? "soft skills question"
    : techSubjectQuestions
    ? techQuestionSubject
    : "technical or soft skills";

  const softwareSystemPrompt = {
    role: "system",
    content: `Pretend you are interviewing me for a software engineer position. Ask me a ${softwareSubject} question, labeled "Q:", then give me a brief example answer, labeled "A:". If my subject is inappropriate, please respond with "Michelle says 'nice try'.".`,
  } as ChatCompletionRequestMessage;

  const jobModeSystemPrompt = {
    role: "system",
    content: `Pretend you are interviewing me for a ${jobTitle} position. Ask me one question, labeled "Q:", then give me a brief example answer, labeled "A:". If my subject is inappropriate, please respond with "Michelle says 'nice try."`,
  } as ChatCompletionRequestMessage;


  const [askedQuestionsArr, setAskedQuestionsArr] = React.useState<string[]>(
    []
  );
  const previouslyAsked = {
    role: "user",
    content: `You have already asked the following questions: ${JSON.stringify(
      askedQuestionsArr
    )}`,
  } as ChatCompletionRequestMessage;

  const [aiConvoMessages, setAiConvoMessages] = React.useState<
    ChatCompletionRequestMessage[]
  >([softwareSystemPrompt]);


  React.useEffect(() => {
    setAiConvoMessages(jobMode ? [jobModeSystemPrompt] : [softwareSystemPrompt])
    setAskedQuestionsArr([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, techQuestionSubject])

  React.useEffect(() => {
    console.log("completion", completion)
    // console.log("job title", jobTitle)
    console.log("aiConvoMessages", aiConvoMessages)
    console.log("previouslyAsked", previouslyAsked)
    // console.log("tech question subj", techQuestionSubject)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completion, aiConvoMessages, jobTitle, techQuestionSubject])

  const handleClick = async (e: any) => {
    setCompletion("");
    setNoteResponse("");
    setQuestionLoading(true);
    setToggleSubjectField(false);

    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: aiConvoMessages, maxTokens: 200 }),
    });

    const data = await response.json();

    if (data) {
      setCompletion(data.response.content);
      const returnedQuestion = data.response.content
        .split("A:")[0]
        .split("Q:")[1];
      // console.log("returned q", returnedQuestion)
      setAskedQuestionsArr([...askedQuestionsArr, returnedQuestion]);

      askedQuestionsArr.length > 1 &&
        setAiConvoMessages([
          jobMode ? jobModeSystemPrompt : softwareSystemPrompt,
          previouslyAsked,
        ]);
    }
    setQuestionLoading(false);
  };

  const onJobTitleChange = (value: string) => {
    setJobTitle(value);
  };

  return (
    <div className={`${styles.container} flexCenter`}>
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
                setJobTitle={setJobTitle}
                setTechQuestionSubject={setTechQuestionSubject}
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
              value={jobTitle}
            />
          ) : techSubjectQuestions ? (
            <SubjectField
              onChange={setTechQuestionSubject}
              label="Enter a technology"
              placeholder="ex. JavaScript"
              onClick={handleClick}
              buttonText={questionPromptButtonText}
              buttonDisabled={questionLoading}
              value={techQuestionSubject}
            />
          ) : (
            <div className={styles.speechBubbleContainer}>
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
            </div>
          )}
        </div>
      ) : (
        <div className={styles.thinkingContainer}>
          <ThinkingRobot />
        </div>
      )}
    </div>
  );
};
