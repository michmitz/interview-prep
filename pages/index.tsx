import React from 'react'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { QuestionCard } from '@/components/question_card/QuestionCard'
import { appStrings } from '@/constants/appStrings'

const Home: NextPage = () => {
  const [completion, setCompletion] = React.useState<string>('')

  const handleClick = async (e: any) => {
    setCompletion('Thinking...');
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appStrings.prompt1),
    });
    const data = await response.json();
    setCompletion(data.result.choices[0].text);
  }

  return (
    <div className={styles.main}>
      <button onClick={handleClick} className={styles.button}>Ask me a question</button>
      {completion && <QuestionCard response={completion} />}
    </div>
  )
}

export default Home
