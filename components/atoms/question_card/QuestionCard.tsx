import { appStrings } from "@/constants/appStrings";
import { MessageOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  readonly response: string;
}

const { showAdviceText } = appStrings;

export const QuestionCard: React.FC<QuestionCardProps> = ({ response }) => {
  const question = response.split("Answer:")[0];
  const advice = response.split("Answer:")[1];
  const [showAdvice, setShowAdvice] = React.useState<boolean>(false);
  const questionStyles = `${styles.question} lightGlassEffect`;
  const adviceStyles = `${styles.advice}`;

  const handleClick = () => {
    setShowAdvice(true);
  };

  return (
    <>
      <div className={questionStyles}>
        {question}
        <div className={styles.showAdviceLabel} onClick={handleClick}>
          <p className={styles.showAdviceText}>{showAdviceText}</p>
          <MessageOutlined />
        </div>
      </div>
      {showAdvice && <div className={adviceStyles}>{advice}</div>}
    </>
  );
};
