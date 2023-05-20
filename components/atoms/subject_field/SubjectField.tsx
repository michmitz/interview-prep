import React from "react";
import styles from "./SubjectField.module.css";
import { RaisedButton } from "../button/RaisedButton";

interface SubjectFieldProps {
  readonly label?: string;
  readonly onChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly onClick: (e: any) => void;
  readonly buttonText?: string;
  readonly buttonDisabled: boolean;
}

export const SubjectField: React.FC<SubjectFieldProps> = ({
  label,
  onChange,
  placeholder,
  onClick,
  buttonText,
  buttonDisabled,
}) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
      <input
        className={styles.input}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className="questionButton">
        <RaisedButton
          onClick={onClick}
          text={buttonText}
          height="35px"
          width="200px"
          disabled={buttonDisabled}
        />
      </div>
    </div>
  );
};
