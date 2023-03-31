import React from 'react'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [value, setValue] = React.useState<string>('')
  const [prompt, setPrompt] = React.useState<string>('')
  const [completion, setCompletion] = React.useState<string>('')

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    }, [])

  const handleClick = async(e: any) => {
    setPrompt(value);
    setCompletion('Loading...');
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: value }),
    });
    const data = await response.json();
    setValue('');
    setCompletion(data.result.choices[0].text);
  }

  return (
    <div className={styles.main}>
      <div>Input prompt</div>
      <input value={value} onChange={handleInput} />
      <button onClick={handleClick} className={styles.button}>Submit</button>
      <div>Typed Prompt: {prompt}</div>
      <div>Answer: {completion}</div>
    </div>
  )
}

export default Home
