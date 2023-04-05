import React from 'react'
import styles from './HeaderStyles.module.css'

export const Header: React.FC = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>Welcome! I&apos;m a software engineer interviewer bot.</p>
    </div>
  )
}
