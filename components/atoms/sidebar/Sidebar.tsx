import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./SidebarStyles.module.css";
import {
  ArrowLeftOutlined,
  FormOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { RaisedButton } from "../button/RaisedButton";
import { Dropdown } from "../dropdown/Dropdown";

export type InterviewMode = "job-title" | "software";

export interface SidebarProps {
  readonly headerText: string;
  readonly mode?: InterviewMode;
  readonly onModeClick?: (mode: InterviewMode) => void;
  readonly user?: any;
  readonly isLoggedIn?: boolean;
  readonly softwareQuestionType?: string;
  readonly setSoftwareQuestionType?: (v: string) => void;
}

const { notesLink } = appStrings.header;

export const Sidebar: React.FC<SidebarProps> = ({
  headerText,
  mode,
  onModeClick,
  user,
  isLoggedIn,
  softwareQuestionType,
  setSoftwareQuestionType,
}) => {
  const [notesLoading, setNotesLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const handleNotesClick = () => {
    setNotesLoading(true);
    router.push("/notes");
    if (router.pathname === "/notes" && router.isReady) {
      setNotesLoading(false);
    }
  };

  const handleReturnHome = () => {
    router.push("/");
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
      <div>
        <p className={styles.headerText}>{headerText}</p>

        {mode && onModeClick ? (
          <div>
            <Dropdown
              defaultValue={mode}
              dropdownValues={modeValues}
              onChange={onModeClick}
              variant="mode"
            />

            {mode === "software" && (
              <div className={styles.softwareQuestionType}>
                <Dropdown
                  defaultValue={softwareQuestionType}
                  dropdownValues={softwareQuestionTypes}
                  onChange={setSoftwareQuestionType}
                  variant="software-question-types"
                />
              </div>
            )}

            <span
              className={styles.labelContainer}
              onClick={() => handleNotesClick()}
            >
              <p
                className={
                  notesLoading
                    ? `${styles.loadingLabel} ${styles.label}`
                    : styles.label
                }
              >
                {notesLink}
              </p>
              {notesLoading ? <LoadingOutlined /> : <FormOutlined />}
            </span>
          </div>
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

      {isLoggedIn && (
        <div>
          <p className={styles.signedInLabel}> Signed in as {user}</p>
          <RaisedButton
            onClick={() => signOut()}
            text="Sign Out"
            height="25px"
            width="110px"
            customBackground="greenGradient"
          />
        </div>
      )}
    </div>
  );
};
