import { AnswerField } from "@/components/atoms/answer_field/AnswerField";
import { QuestionCard } from "@/components/atoms/question_card/QuestionCard";
import React from "react";

export interface QuestionNotesSectionProps {
  readonly aiResponse: string;
}

export const QuestionNotesSection: React.FC<QuestionNotesSectionProps> = ({
  aiResponse,
}) => {
  const [updatedNotes, setUpdatedNotes] = React.useState<any>([]);
  const [noteMessage, setNoteMessage] = React.useState<string>("");
  const [answerInput, setAnswerInput] = React.useState<string>("");

  const handleSubmitNote = async () => {
    const data = {
      question: aiResponse.split("Answer:")[0],
      advice: aiResponse.split("Answer")[1],
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
      setNoteMessage("Uh oh! Note failed");
    }
  };

  return (
    <div>
      <QuestionCard response={aiResponse} />
      <AnswerField
        onChange={(e) => setAnswerInput(e)}
        onSubmit={handleSubmitNote}
      />
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>{noteMessage}</p>
        </div>
      )}
    </div>
  );
};
