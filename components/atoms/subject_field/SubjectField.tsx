import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./SubjectField.module.css";

interface SubjectFieldProps {
  readonly onChange: (value: string) => void;
}

const { jobTitleFieldLabel, jobTitleFieldPlaceholder } = appStrings.mode.jobTitle;

export const SubjectField: React.FC<SubjectFieldProps> = ({
  onChange,
}) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{jobTitleFieldLabel}</p>
      <input
        className={styles.input}
        onChange={e => onChange(e.target.value)}
        placeholder={jobTitleFieldPlaceholder}
      />
    </div>
  );
};
