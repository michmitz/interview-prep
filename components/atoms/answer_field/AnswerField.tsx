import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./AnswerField.module.css";
import { NeumorphicButton } from "../button/NeumorphicButton";

interface AnswerFieldProps {
  readonly onChange: (e: string) => void;
  readonly onSubmit: () => void;
  readonly loading?: boolean;
  readonly disableButton?: boolean;
}

const { answerField, answerSubmitButton } = appStrings;

export const AnswerField: React.FC<AnswerFieldProps> = ({
  onChange,
  onSubmit,
  loading,
  disableButton,
}) => {
  return (
    <div className={styles.container}>
      <textarea
        className={styles.input}
        onChange={(e) => onChange(e.target.value)}
        placeholder={answerField}
      />
      <NeumorphicButton
        onClick={onSubmit}
        height="25px"
        width="120px"
        text={answerSubmitButton}
        disabled={disableButton || loading}
        loading={loading}
      />
    </div>
  );
};
