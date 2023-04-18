import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./SubjectField.module.css";

interface SubjectFieldProps {
  readonly onChange: (value: string) => void;
}

const { subjectField, subjectFieldPlaceholder } = appStrings;

export const SubjectField: React.FC<SubjectFieldProps> = ({
  onChange,
}) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{subjectField}</p>
      <input
        className={styles.input}
        onChange={e => onChange(e.target.value)}
        placeholder={subjectFieldPlaceholder}
      />
    </div>
  );
};
