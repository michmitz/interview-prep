import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./AnswerField.module.css";
import { LoadingOutlined } from "@ant-design/icons";

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
  const disabledButtonStyles = `${styles.button} ${styles.disabledButton}`
  return (
    <div className={styles.container}>
      <textarea
        className={styles.input}
        onChange={(e) => onChange(e.target.value)}
        placeholder={answerField}
      />
      <button onClick={onSubmit} className={disableButton ? disabledButtonStyles : styles.button} disabled={disableButton}>
        {loading ? <LoadingOutlined /> : answerSubmitButton}
      </button>
    </div>
  );
};
