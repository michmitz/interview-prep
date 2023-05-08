import { appStrings } from "@/constants/appStrings";
import { MessageOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./QuestionCard.module.css";
import Image from "next/image";

interface QuestionCardProps {
  readonly response: string;
}

const { showAdviceText } = appStrings;

export const QuestionCard: React.FC<QuestionCardProps> = ({ response }) => {
  const question = response.split("Answer:")[0];
  const advice = response.split("Answer:")[1];
  const [showAdvice, setShowAdvice] = React.useState<boolean>(false);
  const [showAdviceButton, setShowAdviceButton] = React.useState<boolean>(true);

  const handleClick = () => {
    setShowAdvice(true);
    setShowAdviceButton(false);
  };

  return (
    <div className={styles.outerContainer}>
      <Image
        src={"/robot.png"}
        width={45}
        height={45}
        alt="robot"
        className={styles.icon}
      />
      <div className={styles.arrow} />

      <div className={`${styles.contentContainer} lightGlassEffect`}>
        <p className={styles.question}>{question}</p>

        {showAdviceButton && (
          <div className={styles.showAdviceLabel} onClick={handleClick}>
              <p className={styles.showAdviceText}>{showAdviceText}</p>
              <MessageOutlined />
          </div>
        )}

        {showAdvice && <div className={styles.advice}>Example answer: {advice}</div>}
      </div>
    </div>
  );
};
