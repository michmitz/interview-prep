import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./HeaderStyles.module.css";
import { FormOutlined, SelectOutlined } from "@ant-design/icons";
import { InterviewMode } from "@/pages";
import { useRouter } from "next/router";

export interface HeaderProps {
  readonly mode: InterviewMode;
  readonly onModeClick: (mode: InterviewMode) => void;
}

const { headerText, modeLabel, subjectMode, generalMode, notes } = appStrings.header;

export const Header: React.FC<HeaderProps> = ({ mode, onModeClick }) => {
  const router = useRouter();

  const handleNotesClick = () => {
    router.push("/notes");
  };

  return (
    <div className={styles.container}>
      <p>{headerText}</p>

      <div className={styles.labelContainer}>
      <span
        className={styles.labelContainer}
        onClick={() => onModeClick(mode)}
      >
        <p className={styles.label}>{modeLabel}: {mode.toUpperCase()}</p>
        <SelectOutlined />
      </span>

      <span
        className={styles.labelContainer}
        onClick={() => handleNotesClick()}
      >
        <p className={styles.notesLabel}>{notes}</p>
        <FormOutlined />
      </span>
      </div>
    </div>
  );
};
