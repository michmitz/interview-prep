import React from 'react'
import styles from './QuestionCard.module.css'

interface QuestionCardProps {
  readonly response: string
}


export const QuestionCard: React.FC<QuestionCardProps> = ({ response }) => {
  const question = response.split('Advice:')[0]
  const advice = response.split('Advice:')[1]
  const [showAdvice, setShowAdvice] = React.useState<boolean>(false)
  const questionStyles = `${styles.glassEffect} ${styles.question}`
  const adviceStyles = `${styles.glassEffect} ${styles.advice}`

  const handleClick = () => {
    setShowAdvice(true)
  }

  return (
    <>
      <div className={questionStyles}>
        {question}
        <button onClick={handleClick}>Show Advice?</button>
      </div>
      {
        showAdvice &&
        <div className={adviceStyles}>{advice}</div>
      }
    </>
  )
}
