import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./SidebarStyles.module.css";
import { useRouter } from "next/router";
import { RaisedButton } from "../button/RaisedButton";
import { Dropdown } from "../dropdown/Dropdown";

export type InterviewMode = "job-title" | "software";

interface SidebarProps {
  readonly headerText: string;
  readonly mode?: InterviewMode;
  readonly onModeClick?: (mode: InterviewMode) => void;
  readonly isLoggedIn: boolean;
  readonly softwareQuestionType?: string;
  readonly setSoftwareQuestionType?: (v: string) => void;
}

const { notesLink, about, interviewTips, tellMePage } = appStrings.sidebar;

export const Sidebar: React.FC<SidebarProps> = ({
  headerText,
  mode,
  onModeClick,
  isLoggedIn,
  softwareQuestionType,
  setSoftwareQuestionType,
}) => {
  const router = useRouter();
  const [notesLoading, setNotesLoading] = React.useState<boolean>(false);
  const [tellMePageLoading, setTellMePageLoading] = React.useState<boolean>(false);

  const handleNavigate = (path: string) => {
    if (path === "/notes") {
      setNotesLoading(true);
      router.push(path);
      if (router.pathname === "/notes" && router.isReady) {
        setNotesLoading(false);
      }
    } else if (path === "/tell-me-about-yourself") {
      setTellMePageLoading(true);
      router.push(path);
      if (router.pathname === "/tell-me-about-yourself" && router.isReady) {
        setTellMePageLoading(false);
      }
    } else {
      router.push(path);
    }
  };

  const modeValues = ["job-title", "software"] as ReadonlyArray<InterviewMode>;
  const softwareQuestionTypes = [
    "any",
    "technical (general)",
    "technical (subject)",
    "soft skills",
  ] as ReadonlyArray<string>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerText}>{headerText}</p>
        {mode && onModeClick && (
          <div className={styles.modeContainer}>
            <Dropdown
              defaultValue={mode}
              dropdownValues={modeValues}
              onChange={onModeClick}
              variant="mode"
            />
            {mode === "software" && softwareQuestionType && setSoftwareQuestionType && (
              <div className={styles.softwareQuestionType}>
                <Dropdown
                  defaultValue={softwareQuestionType}
                  dropdownValues={softwareQuestionTypes}
                  onChange={setSoftwareQuestionType}
                  variant="software-question-types"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.navContainer}>
        <div className={styles.navItem}>
          <RaisedButton
            onClick={() => handleNavigate("/")}
            text="Home"
            height="35px"
            width="200px"
          />
        </div>
        <div className={styles.navItem}>
          <RaisedButton
            onClick={() => handleNavigate("/notes")}
            text={notesLoading ? "Loading..." : "Notes"}
            height="35px"
            width="200px"
            disabled={notesLoading}
          />
        </div>
        <div className={styles.navItem}>
          <RaisedButton
            onClick={() => handleNavigate("/tell-me-about-yourself")}
            text={tellMePageLoading ? "Loading..." : "Tell Me About Yourself"}
            height="35px"
            width="200px"
            disabled={tellMePageLoading}
          />
        </div>
        <div className={styles.navItem}>
          <RaisedButton
            onClick={() => handleNavigate("/about")}
            text="About"
            height="35px"
            width="200px"
          />
        </div>
      </div>
    </div>
  );
};
