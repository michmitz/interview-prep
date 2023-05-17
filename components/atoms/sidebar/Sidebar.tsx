import { appStrings } from "@/constants/appStrings";
import React from "react";
import styles from "./SidebarStyles.module.css";
import {
  ArrowLeftOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { RaisedButton } from "../button/RaisedButton";
import { ModeDropdown } from "../mode_dropdown/ModeDropdown";

export type InterviewMode = 'general' | 'subject' | 'software'

export interface SidebarProps {
  readonly headerText: string;
  readonly mode?: InterviewMode;
  readonly onModeClick?: (mode: InterviewMode) => void;
  readonly user?: any;
  readonly isLoggedIn?: boolean;
}

const { notesLink } = appStrings.header;

export const Sidebar: React.FC<SidebarProps> = ({
  headerText,
  mode,
  onModeClick,
  user,
  isLoggedIn,
}) => {
  const router = useRouter();

  const handleNotesClick = () => {
    router.push("/notes");
  };

  const handleReturnHome = () => {
    router.push("/");
  };

  const modeValues = ['general', 'subject', 'software'] as ReadonlyArray<InterviewMode>

  return (
    <div className={styles.container}>
      <div>
        {/* <p className={styles.headerText}>{headerText}</p> */}

        {mode && onModeClick ? (
          <div>
            <ModeDropdown
              defaultValue={mode}
              dropdownValues={modeValues}
              onChange={onModeClick}
            />

            <span
              className={styles.labelContainer}
              onClick={() => handleNotesClick()}
            >
              <p className={styles.label}>{notesLink}</p>
              <FormOutlined />
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
