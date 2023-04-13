import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./AnswerField.module.css";
interface AnswerFieldProps {
  readonly onChange: (e: string) => void;
  readonly onSubmit: () => void;
}

const { answerField, answerSubmitButton } = appStrings;

export const AnswerField: React.FC<AnswerFieldProps> = ({
  onChange,
  onSubmit,
}) => {
  return (
    <div className={styles.container}>
      <textarea
        className={styles.input}
        onChange={e => onChange(e.target.value)}
        placeholder={answerField}
      />
      <button onClick={onSubmit} className={styles.button}>{answerSubmitButton}</button>
    </div>
  );
};
