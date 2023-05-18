import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./SubjectField.module.css";

interface SubjectFieldProps {
  readonly label: string;
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
}

export const SubjectField: React.FC<SubjectFieldProps> = ({
  label,
  onChange,
  placeholder,
}) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
      <input
        className={styles.input}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
