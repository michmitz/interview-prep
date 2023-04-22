import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./AnswerField.module.css";
import { LoadingOutlined } from "@ant-design/icons";
interface AnswerFieldProps {
  readonly onChange: (e: string) => void;
  readonly onSubmit: () => void;
  readonly loading: boolean;
}

const { answerField, answerSubmitButton } = appStrings;

export const AnswerField: React.FC<AnswerFieldProps> = ({
  onChange,
  onSubmit,
  loading,
}) => {
  return (
    <div className={styles.container}>
      <textarea
        className={styles.input}
        onChange={(e) => onChange(e.target.value)}
        placeholder={answerField}
      />
      <button onClick={onSubmit} className={styles.button} disabled={loading}>
        {loading ? <LoadingOutlined /> : answerSubmitButton}
      </button>
    </div>
  );
};
