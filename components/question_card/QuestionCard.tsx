import { appStrings } from "@/constants/appStrings";
import { WechatOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  readonly response: string;
}

const { showAdviceText } = appStrings

export const QuestionCard: React.FC<QuestionCardProps> = ({ response }) => {
  const question = response.split("Answer:")[0];
  const advice = response.split("Answer:")[1];
  const [showAdvice, setShowAdvice] = React.useState<boolean>(false);
  const { glassEffect } = styles;
  const questionStyles = `${glassEffect} ${styles.question}`;
  const adviceStyles = `${glassEffect} ${styles.advice}`;

  const handleClick = () => {
    setShowAdvice(true);
  };

  return (
    <>
      <div className={questionStyles}>
        {question}
        <div className={styles.showAdvice}>
          <WechatOutlined onClick={handleClick} />
          <p>{showAdviceText}</p>
        </div>
      </div>
      {showAdvice && <div className={adviceStyles}>{advice}</div>}
    </>
  );
};
