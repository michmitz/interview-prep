import React from 'react'
import styles from './QuestionCard.module.css'

interface QuestionCardProps {
  readonly response: string
}


export const QuestionCard: React.FC<QuestionCardProps> = ({ response }) => {
  const question = response.split('Answer:')[0]
  const advice = response.split('Answer:')[1]
  const [showAdvice, setShowAdvice] = React.useState<boolean>(false)
  const { glassEffect } = styles
  const questionStyles = `${glassEffect} ${styles.question}`
  const adviceStyles = `${glassEffect} ${styles.advice}`

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
