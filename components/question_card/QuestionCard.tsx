import React from 'react'

interface QuestionCardProps {
  readonly response: string
}


export const QuestionCard: React.FC<QuestionCardProps> = ({ response }) => {
  return (
    <div>
      {response}
    </div>
  )
}
