import React from "react";
import styles from "./SubjectField.module.css";
import { RaisedButton } from "../button/RaisedButton";
import { appStrings } from "@/constants/appStrings";

interface SubjectFieldProps {
  readonly label?: string;
  readonly onChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly onClick: (e: any) => void;
  readonly buttonText?: string;
  readonly buttonDisabled: boolean;
  readonly value: string;
}

const { noValue } = appStrings.subjectField;

export const SubjectField: React.FC<SubjectFieldProps> = ({
  label,
  onChange,
  placeholder,
  onClick,
  buttonText,
  buttonDisabled,
  value,
}) => {
  const [showError, setShowError] = React.useState<boolean>(false);

  return (
    <div className={`${styles.container} layeredGlassEffect`}>
      <p className={styles.label}>{label}</p>
      <input
        className={styles.input}
        onChange={(e) => {
          onChange && onChange(e.target.value)
          if (e.target.value) {
            setShowError(false)
          }
        }}
        placeholder={placeholder}
      />
      {showError && <p className={styles.emptyFieldError}>{noValue}</p>}
      <div className="questionButton">
        <RaisedButton
          onClick={(e) => {
            !value ? setShowError(true) : onClick(e)}}
          text={buttonText}
          height="35px"
          width="200px"
          disabled={buttonDisabled}
        />
      </div>
    </div>
  );
};
