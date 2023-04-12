import { appStrings } from '@/constants/appStrings'
import React from 'react'
import styles from './HeaderStyles.module.css'

const { header } = appStrings

export const Header: React.FC = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>{header}</p>
    </div>
  )
}
