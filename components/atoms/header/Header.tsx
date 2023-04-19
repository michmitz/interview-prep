import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./HeaderStyles.module.css";
import { SelectOutlined } from "@ant-design/icons";
import { InterviewMode } from "@/pages";

export interface HeaderProps {
  readonly mode: InterviewMode;
  readonly onModeClick: (mode: InterviewMode) => void;
}

const { header } = appStrings;

export const Header: React.FC<HeaderProps> = ({ mode, onModeClick }) => {
  return (
    <div className={styles.container}>
      <p>{header}</p>
      <span className={styles.modeLabelContainer} onClick={() => onModeClick(mode)}>
        <p className={styles.modeLabel}>Mode: {mode.toUpperCase()}</p>
        <SelectOutlined className={styles.modeIcon} />
      </span>
    </div>
  );
};
