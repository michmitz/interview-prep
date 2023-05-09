import React from "react";
import styles from "./NoteCard.module.css";
import { AnswerField } from "@/components/atoms/answer_field/AnswerField";
import { UpdatedNote } from "@/pages/notes";

interface NoteCardProps {
  readonly question: string;
  readonly note: string;
  readonly noteId: string;
  readonly editCallback: (id: string) => void;
  readonly deleteCallback: (id: string) => void;
  readonly answerInputsCallback: (updatedNote: UpdatedNote) => void;
  readonly submitNoteCallback: (id: string) => void;
  readonly disableButtonCallback: (id: string) => boolean | undefined;
  readonly responseMessage?: string;
  readonly showEditField: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  question,
  note,
  editCallback,
  deleteCallback,
  answerInputsCallback,
  submitNoteCallback,
  disableButtonCallback,
  noteId,
  responseMessage,
  showEditField,
}) => {
  return (
      <div className={`${styles.container} lightGlassEffect`}>
        <p className={styles.question}>{question}</p>
        <div className={styles.noteContainer}>
          <div className={styles.noteLabel}>
            Note:
            <div>
              <button
                onClick={() => {
                  editCallback(noteId);
                }}
                key={noteId}
              >
                Update Note?
              </button>
              <button onClick={() => deleteCallback(noteId)}>Delete</button>
            </div>
          </div>
          <p className={styles.note}>{note}</p>
        </div>
        {showEditField && (
          <div className={styles.answerField}>
            <AnswerField
              onChange={(e) => {
                answerInputsCallback({
                  id: noteId,
                  updatedNote: e,
                } as UpdatedNote);
              }}
              onSubmit={() => submitNoteCallback(noteId)}
              disableButton={disableButtonCallback(noteId)}
            />
          </div>
        )}
      </div>
     
  );
};
