import React from "react";
import styles from "./NoteCard.module.css";
import { AnswerField } from "@/components/atoms/answer_field/AnswerField";
import { UpdatedNote } from "@/pages/notes";
import { appStrings } from "@/constants/appStrings";

interface NoteCardProps {
  readonly question: string;
  readonly note: string;
  readonly noteId: string;
  readonly editCallback: (id: string) => void;
  readonly deleteCallback: (id: string) => void;
  readonly onInputChange: (v: any) => void;
  readonly onSubmit: (id: string) => void;
  readonly disableButtonCallback?: (id: string) => boolean | undefined;
  readonly disableButton?: boolean;
  readonly showEditField: boolean;
  readonly variant: "note" | "tell-me-answer";
}

const { noteHeader, updateButton, deleteButton } = appStrings.notesPage;

export const NoteCard: React.FC<NoteCardProps> = ({
  question,
  note,
  editCallback,
  deleteCallback,
  onInputChange,
  onSubmit,
  disableButtonCallback,
  noteId,
  showEditField,
  variant,
  disableButton,
}) => {
  return (
    <div className={`${styles.container} layeredGlassEffect`}>
      <p className={styles.question}>{question}</p>
      <div className={styles.noteContainer}>
        <div className={`${styles.noteLabel} creamGradient`}>
          {variant === "note" ? noteHeader : "Your Answer"}
          <div>
            <button
              onClick={() => {
                editCallback(noteId);
              }}
              className={`${styles.button} ${styles.updateButton} greenGradient`}
              key={noteId}
            >
              {updateButton}
            </button>
            <button
              onClick={() => deleteCallback(noteId)}
              className={`${styles.button} greenGradient`}
            >
              {deleteButton}
            </button>
          </div>
        </div>
        <p className={styles.note}>{note}</p>
      </div>
      {showEditField && (
        <div className={styles.answerField}>
          <AnswerField
            onChange={(e) => {
              onInputChange(
                variant === "note"
                  ? ({
                      id: noteId,
                      updatedNote: e,
                    } as UpdatedNote)
                  : e
              );
            }}
            onSubmit={() => onSubmit(noteId)}
            disableButton={disableButtonCallback && disableButtonCallback(noteId) || disableButton}
          />
        </div>
      )}
    </div>
  );
};
