import React from "react";
import { GetServerSideProps, NextPage } from "next";
import styles from "../styles/Home.module.css";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { appStrings } from "@/constants/appStrings";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NoteCard } from "@/components/molecules/note_card/NoteCard";
import { sortArrByKey } from "@/utils/utils";
import { LoadingOutlined } from "@ant-design/icons";
import { SignedOut } from "@/components/molecules/signed_out/SignedOut";

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

export type TellMeAnswer = {
  readonly id: string;
  readonly promptAnswer: string;
};

export type UpdatedTellMeAnswer = {
  id: string;
  updatedTellMeAnswer: string;
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

  const tellMeAnswer = await prisma.tellMePrompt.findFirst({
    where: {
      author: { email: session?.user?.email },
    },
  });

  return {
    props: { notes, tellMeAnswer },
  };
};

interface NotesProps {
  readonly notes: ReadonlyArray<Note>;
  readonly tellMeAnswer: TellMeAnswer;
}

const { notesPage } = appStrings.header;
const { tellMeHeader } = appStrings.notesPage;

const Notes: NextPage<NotesProps> = ({ notes, tellMeAnswer }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const pageLoading = status === "loading";
  const [noteResponse, setNoteResponse] = React.useState<string>("");
  const [notesToEdit, setNotesToEdit] = React.useState<ReadonlyArray<string>>([
    "",
  ]);
  const [notesWithUpdatedAnswers, setNotesWithUpdatedAnswers] = React.useState<
    UpdatedNote[] | []
  >([]);
  const [showTellMeEditField, setShowTellMeEditField] =
    React.useState<boolean>(false);
  const [tellMeInput, setTellMeInput] = React.useState<string>("");

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

  const handleSubmitTellMeAnswer = async (id: string) => {
    const data = {
      promptAnswer: tellMeInput,
    };

    console.log("data", data);

    const response = await fetch(`/api/tell_me_prompt/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      setShowTellMeEditField(false);
      refreshData();
    } else {
      console.log("failed");
    }
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

  const onTellMeChange = (v: string) => {
    setTellMeInput(v);
  };

  const handleDeleteTellMeAnswer = async (id: string) => {
    const response = await fetch(`/api/tell_me_prompt/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      refreshData();
    } else {
      console.log("delete failed");
    }
  };

  const disableButton = (noteId: string) => {
    const updatedNote = notesWithUpdatedAnswers.find((x) => x.id === noteId);
    return updatedNote?.updatedNote === "" ? true : !updatedNote ? true : false;
  };

  const sortedNotes = sortArrByKey([...notes], "subject");

  if (session) {
    return (
      <main className="lightGlassEffect">
        <div className="container">
          <div className="sidebar">
            <Sidebar
              headerText={notesPage}
              isLoggedIn={true}
              user={session?.user?.email}
            />
          </div>

          <div className="rightContainer">
            {tellMeAnswer && (
              <div className={`${styles.tellMeContainer} flexCenter fadeIn`}>
                <div className={`${styles.notesSubject} mutedPurpleGradient`}>
                  {tellMeHeader}
                </div>
                <NoteCard
                  question="Tell Me About Yourself Prompt"
                  note={tellMeAnswer.promptAnswer}
                  noteId={tellMeAnswer.id}
                  onInputChange={onTellMeChange}
                  editCallback={() => setShowTellMeEditField(true)}
                  deleteCallback={handleDeleteTellMeAnswer}
                  showEditField={showTellMeEditField}
                  disableButton={false}
                  onSubmit={handleSubmitTellMeAnswer}
                  variant="tell-me-answer"
                />
              </div>
            )}
            {sortedNotes.length === 0 && (
              <h2 className={styles.noNotes}>No notes yet.</h2>
            )}
            {!sortedNotes ? (
              <LoadingOutlined />
            ) : (
              sortedNotes.map((noteArr, i) => {
                return (
                  <div key={`${noteArr}-${i}`} className="flexCenter fadeIn">
                    <div
                      className={`${styles.notesSubject} mutedPurpleGradient`}
                    >
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
                            showEditField={notesToEdit.includes(id)}
                            disableButtonCallback={disableButton}
                            onInputChange={handleSetAnswerInputs}
                            onSubmit={handleSubmitNote}
                            variant="note"
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    );
  }

  if (!session && pageLoading) {
    return <></>;
  }

  return <SignedOut />;
};

export default Notes;
