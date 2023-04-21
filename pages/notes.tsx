import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import styles from "../styles/Home.module.css";
import prisma from '@/lib/prisma';

export const getServerSideProps: GetServerSideProps = async () => {

  const notes = await prisma.note.findMany({});

  return {
      props: { notes },
  }
}

interface NotesProps {
  readonly notes: any
}

const Notes: NextPage<NotesProps> = ({ notes }) => {
  console.log('notes', notes)
  return (
    <div className={styles.main}>
      Notes Page
    </div>
  )
}

export default Notes;
