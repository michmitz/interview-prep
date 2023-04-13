import React from 'react'
import styles from './AnswerField.module.css'

interface AnswerFieldProps {
  readonly onChange: () => void
  readonly onSubmit: () => void
}

export const AnswerField: React.FC<AnswerFieldProps> = ({ onChange, onSubmit }) => {
  return (
    <div className={styles.container}>
      <p>Write Your Answer Here:</p>
    <input className={styles.input} onChange={onChange} />
    <button onClick={onSubmit}>Submit</button>
    </div>
  )
}
