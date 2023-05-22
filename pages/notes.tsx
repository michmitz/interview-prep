import React from "react";
import { GetServerSideProps, NextPage } from "next";
import styles from "../styles/Home.module.css";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { appStrings } from "@/constants/appStrings";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NoteCard } from "@/components/molecules/note_card/NoteCard";
import { SpeechBubblePrompt } from "@/components/molecules/speech_bubble_prompt/SpeechBubblePrompt";
import { sortArrByKey } from "@/utils/utils";

export type Note = {
  readonly id: string;
  readonly question: string;
  readonly advice: string;
  readonly authorId: string;
  readonly note: string;
  readonly subject: string;
};

export type UpdatedNote = {
  id: string;
  updatedNote: string;
};

const { notSignedInText, signInButtonText } = appStrings.speechBubble;

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
  const router = useRouter();
  const { data: session } = useSession();
  const [noteResponse, setNoteResponse] = React.useState<string>("");
  const [notesToEdit, setNotesToEdit] = React.useState<ReadonlyArray<string>>([
    "",
  ]);
  const [notesWithUpdatedAnswers, setNotesWithUpdatedAnswers] = React.useState<
    UpdatedNote[] | []
  >([]);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleShowEditNote = (noteId: string) => {
    setNotesToEdit([...notesToEdit, noteId]);
  };

  const handleSetAnswerInputs = (note: UpdatedNote) => {
    const updatedNoteIndex = notesWithUpdatedAnswers.findIndex(
      (e) => e.id === note.id
    );
    const notesCopy = [...notesWithUpdatedAnswers];

    if (notesWithUpdatedAnswers.length === 0) {
      setNotesWithUpdatedAnswers([note]);
    }

    if (updatedNoteIndex === -1) {
      setNotesWithUpdatedAnswers([...notesCopy, note]);
    } else {
      notesCopy.splice(updatedNoteIndex, 1, note);
      setNotesWithUpdatedAnswers(notesCopy);
    }
  };

  const handleSubmitNote = async (id: string) => {
    const updatedNote = notesWithUpdatedAnswers.find((x) => x.id === id);

    const data = {
      note: updatedNote?.updatedNote,
    };

    const response = await fetch(`/api/note/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      refreshData();
    } else {
      setNoteResponse("Note update failed");
    }

    // Hide note edit input
    const indexOfNoteToRemove = notesToEdit.findIndex((id) => id === id);
    const notesToEditCopy = [...notesToEdit];
    setNotesToEdit([...notesToEditCopy.splice(indexOfNoteToRemove, 1)]);
  };

  const handleDeleteNote = async (id: string) => {
    const response = await fetch(`/api/note/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      refreshData();
    } else {
      setNoteResponse("Delete failed");
    }
  };

  const disableButton = (noteId: string) => {
    const updatedNote = notesWithUpdatedAnswers.find((x) => x.id === noteId);
    return updatedNote?.updatedNote === "" ? true : !updatedNote ? true : false;
  };

  const sortedNotes = sortArrByKey([...notes], "subject");

  console.log("Sorted notes", sortedNotes);

  if (session) {
    return (
      <div className="container">
        <div className="sidebar">
          <Sidebar
            headerText={notesPage}
            isLoggedIn={true}
            user={session?.user?.email}
          />
        </div>

        <div className="rightContainer">
          {sortedNotes.map((noteArr, i) => {
            return (
              <div key={`${noteArr}-${i}`} className="flexCenter">
                <div className={`${styles.notesSubject} blueGradient`}>
                  {noteArr[0] === "null" ? "Unsorted" : noteArr[0]}
                </div>
                {noteArr[1].map((note: Note) => {
                  const { id } = note;

                  return (
                    <div className={styles.noteContainer} key={id}>
                      <NoteCard
                        question={note.question}
                        note={note.note}
                        noteId={id}
                        editCallback={handleShowEditNote}
                        deleteCallback={handleDeleteNote}
                        responseMessage={noteResponse}
                        showEditField={notesToEdit.includes(id)}
                        disableButtonCallback={disableButton}
                        answerInputsCallback={handleSetAnswerInputs}
                        submitNoteCallback={handleSubmitNote}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="signedOut">
      <SpeechBubblePrompt
        text={notSignedInText}
        onClick={() => signIn()}
        buttonText={signInButtonText}
      />
    </div>
  );
};

export default Notes;
