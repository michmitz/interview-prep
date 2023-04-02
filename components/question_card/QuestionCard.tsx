import React from 'react'

interface QuestionCardProps {
  readonly response: string
}


export const QuestionCard: React.FC<QuestionCardProps> = ({ response }) => {
  const question = response.split('Advice:')[0]
  const advice = response.split('Advice:')[1]
  const [showAdvice, setShowAdvice] = React.useState<boolean>(false)

  const handleClick = () => {
    setShowAdvice(true)
  }

  return (
    <>
      <div>
        {question}
        <button onClick={handleClick}>Show Advice?</button>
      </div>
      {
        showAdvice &&
        <div>{advice}</div>
      }
    </>
  )
}
