import React from "react";
import { GetServerSideProps, NextPage } from "next";
import styles from "../styles/Home.module.css";
import prisma from "@/lib/prisma";
import { Header } from "@/components/atoms/header/Header";
import { appStrings } from "@/constants/appStrings";
import { getSession, signIn, useSession } from "next-auth/react";

type Note = {
  readonly id: string;
  readonly question: string;
  readonly advice: string;
  readonly authorId: string;
  readonly note: string;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notes = await prisma.note.findMany({
    where: {
      author: { email: session?.user?.email },
    },
  });

  return {
    props: { notes },
  };
};

interface NotesProps {
  readonly notes: ReadonlyArray<Note>;
}

const { notesPage } = appStrings.header;

const Notes: NextPage<NotesProps> = ({ notes }) => {
  const { data: session } = useSession();

  console.log("notes", notes);
  if (!session) {
    return (
      <div>
        Not authorized to view this page
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }
  return (
    <div className={styles.main}>
      <Header headerText={notesPage} />
      Notes Page
      {notes.map((note) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", width: 400, marginBottom: 20 }} key={note.id}>
            <div style={{ padding: 10, backgroundColor: "pink", color: "white" }}>
              {note.question}
            </div>
            <div style={{ padding: 10, backgroundColor: "gray", color: "white" }}>
              Your Note: {note.note}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Notes;
