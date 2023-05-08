import React from "react";
import styles from "./SpeechBubblePrompt.module.css";
import Image from "next/image";
import { NeumorphicButton } from "@/components/atoms/button/NeumorphicButton";

export interface SpeechBubblePromptProps {
  readonly onClick: (val: any | null) => void;
  readonly disableButton: boolean;
}

export const SpeechBubblePrompt: React.FC<SpeechBubblePromptProps> = ({
  onClick,
  disableButton,
}) => {
  return (
    <div className={styles.container}>
      <Image
        src={"/robot.png"}
        width={60}
        height={60}
        alt="robot"
        className={styles.icon}
      />
      <div className={`${styles.speechBubble} lightGlassEffect`}>
        Welcome! I&apos;m a virtual interviewer. Click the button below to get started!
        <div className={styles.button}>
          <NeumorphicButton
          onClick={onClick}
          text="Get Question"
          height="35px"
          width="150px"
          disabled={disableButton}
        />
        </div>
      </div>
    </div>
  );
};
