import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import styles from "../styles/Home.module.css";
import prisma from '@/lib/prisma';
import { Header } from '@/components/atoms/header/Header';
import { appStrings } from '@/constants/appStrings';
import { getSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notes = await prisma.note.findMany({
    where: {
      author: { email: session?.user?.email },
    }
  });

  return {
      props: { notes },
  }
}

interface NotesProps {
  readonly notes: any
}

const { notesPage } = appStrings.header

const Notes: NextPage<NotesProps> = ({ notes }) => {
  console.log('notes', notes)
  return (
    <div className={styles.main}>
      <Header headerText={notesPage} />
      Notes Page
    </div>
  )
}

export default Notes;
