import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./HeaderStyles.module.css";
import {
  ArrowLeftOutlined,
  FormOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import { InterviewMode } from "@/pages";
import { useRouter } from "next/router";

export interface HeaderProps {
  readonly headerText: string;
  readonly mode?: InterviewMode;
  readonly onModeClick?: (mode: InterviewMode) => void;
}

const { modeLabel, notesLink } = appStrings.header;

export const Header: React.FC<HeaderProps> = ({
  headerText,
  mode,
  onModeClick,
}) => {
  const router = useRouter();

  const handleNotesClick = () => {
    router.push("/notes");
  };

  const handleReturnHome = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <p className={styles.headerText}>{headerText}</p>

      <div className={styles.labelContainer}>
        {mode && onModeClick ? (
          <>
            <span
              className={styles.labelContainer}
              onClick={() => onModeClick(mode)}
            >
              <p className={styles.label}>
                {modeLabel}: {mode.toUpperCase()}
              </p>
              <SelectOutlined />
            </span>

            <span
              className={styles.labelContainer}
              onClick={() => handleNotesClick()}
            >
              <p className={styles.notesLabel}>{notesLink}</p>
              <FormOutlined />
            </span>
          </>
        ) : (
          <span
            className={styles.labelContainer}
            onClick={() => handleReturnHome()}
          >
            <ArrowLeftOutlined />
            <p className={styles.returnLabel}>Return to Interview</p>
          </span>
        )}
      </div>
    </div>
  );
};
