import React from "react";
import { AnswerField } from "@/components/atoms/answer_field/AnswerField";
import { NeumorphicButton } from "@/components/atoms/button/NeumorphicButton";
import { QuestionCard } from "@/components/atoms/question_card/QuestionCard";
import styles from "./QuestionNotesSection.module.css";
import { RaisedButton } from "@/components/atoms/button/RaisedButton";
import { appStrings } from "@/constants/appStrings";
import { DoubleLeftOutlined } from "@ant-design/icons";
import { localStorageService } from "@/lib/localStorage";

export interface QuestionNotesSectionProps {
  readonly aiResponse: string;
  readonly setNoteResponse: (message: string) => void;
  readonly onSubmit: (e: any) => void;
  readonly questionLoading: boolean;
  readonly allowSubjectField: boolean;
  readonly setToggleSubjectField: (v: boolean) => void;
  readonly noteSubject: string;
  readonly setTechQuestionSubject: (v: string) => void;
  readonly setJobTitle: (v: string) => void;
}

const { getNewQuestion } = appStrings;
const { changeSubjectText } = appStrings.mode;

export const QuestionNotesSection: React.FC<QuestionNotesSectionProps> = ({
  aiResponse,
  setNoteResponse,
  onSubmit,
  questionLoading,
  allowSubjectField,
  setToggleSubjectField,
  noteSubject,
  setTechQuestionSubject,
  setJobTitle,
}) => {
  const [answerInput, setAnswerInput] = React.useState<string>("");
  const [noteSaving, setNoteSaving] = React.useState<boolean>(false);
  const [showAnswerField, setShowAnswerField] = React.useState<boolean>(false);
  const [showNotesButton, setShowNotesButton] = React.useState<boolean>(true);

  const handleSubmitNote = async () => {
    setNoteSaving(true);
    const newNote = {
      question: aiResponse.split("A:")[0].split("Q:")[1],
      advice: aiResponse.split("A:")[1],
      note: answerInput,
      subject: noteSubject,
    };

    try {
      const result = localStorageService.saveNote(newNote);
      if (result) {
        setNoteSaving(false);
        setNoteResponse("Note successfully saved!");
        setShowAnswerField(false);
      } else {
        setNoteResponse("Failed to save note");
        setNoteSaving(false);
      }
    } catch (error) {
      setNoteResponse("Failed to save note");
      setNoteSaving(false);
    }
  };

  const handleClearSubject = () => {
    setToggleSubjectField(true);
    setTechQuestionSubject("");
    setJobTitle("");
  };

  return (
    <div className="flexCenter">
      {allowSubjectField && (
        <div className={styles.changeSubjectButtonContainer}>
          <DoubleLeftOutlined className={styles.changeSubjectIcon} />
          <button
            className={styles.changeSubjectButton}
            onClick={handleClearSubject}
          >
            {changeSubjectText}
          </button>
        </div>
      )}
      <QuestionCard response={aiResponse} />
      {showNotesButton && (
        <div className={styles.writeNoteButton}>
          <NeumorphicButton
            onClick={() => {
              setShowAnswerField(true);
              setShowNotesButton(false);
            }}
            text="Write Note"
            height="32px"
            width="100px"
          />
        </div>
      )}
      {showAnswerField && (
        <AnswerField
          onChange={(e) => setAnswerInput(e)}
          onSubmit={handleSubmitNote}
          loading={noteSaving}
          disableButton={noteSaving || !answerInput}
        />
      )}
      <div className="questionButton">
        <RaisedButton
          onClick={onSubmit}
          text={getNewQuestion}
          height="35px"
          width="200px"
          disabled={questionLoading}
        />
      </div>
    </div>
  );
};
