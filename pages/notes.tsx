import React from "react";
import styles from "../styles/Home.module.css";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { appStrings } from "@/constants/appStrings";
import { NoteCard } from "@/components/molecules/note_card/NoteCard";
import { sortArrByKey } from "@/utils/utils";
import { LoadingOutlined } from "@ant-design/icons";
import { localStorageService, Note, TellMePrompt } from "@/lib/localStorage";

export type UpdatedNote = {
  id: string;
  updatedNote: string;
};

export type UpdatedTellMeAnswer = {
  id: string;
  updatedTellMeAnswer: string;
};

const Notes: React.FC = () => {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [tellMeAnswer, setTellMeAnswer] = React.useState<TellMePrompt | null>(null);
  const [notesWithUpdatedAnswers, setNotesWithUpdatedAnswers] = React.useState<UpdatedNote[]>([]);
  const [showTellMeEditField, setShowTellMeEditField] = React.useState<boolean>(false);
  const [tellMeUpdatedAnswer, setTellMeUpdatedAnswer] = React.useState<string>("");
  const [apiResponse, setAPIResponse] = React.useState<string>("");

  React.useEffect(() => {
    // Load data from localStorage
    setNotes(localStorageService.getNotes());
    setTellMeAnswer(localStorageService.getTellMePrompt());
  }, []);

  const onNoteChange = (noteId: string, updatedNote: string) => {
    const existingNote = notesWithUpdatedAnswers.find((x) => x.id === noteId);
    if (existingNote) {
      const filteredNotes = notesWithUpdatedAnswers.filter((x) => x.id !== noteId);
      setNotesWithUpdatedAnswers([
        ...filteredNotes,
        { id: noteId, updatedNote },
      ]);
    } else {
      setNotesWithUpdatedAnswers([
        ...notesWithUpdatedAnswers,
        { id: noteId, updatedNote },
      ]);
    }
  };

  const onTellMeChange = (updatedAnswer: string) => {
    setTellMeUpdatedAnswer(updatedAnswer);
  };

  const handleSubmitNote = async (noteId: string) => {
    const updatedNote = notesWithUpdatedAnswers.find((x) => x.id === noteId);
    if (!updatedNote) return;

    const result = localStorageService.updateNote(noteId, updatedNote.updatedNote);
    if (result) {
      setNotes(localStorageService.getNotes());
      setNotesWithUpdatedAnswers(notesWithUpdatedAnswers.filter((x) => x.id !== noteId));
      setAPIResponse("Note successfully updated!");
    } else {
      setAPIResponse("Failed to update note.");
    }
  };

  const handleSubmitTellMeAnswer = async () => {
    if (!tellMeAnswer) return;

    const result = localStorageService.updateTellMePrompt(tellMeAnswer.id, tellMeUpdatedAnswer);
    if (result) {
      setTellMeAnswer(result);
      setShowTellMeEditField(false);
      setAPIResponse("Answer successfully updated!");
    } else {
      setAPIResponse("Failed to update answer.");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const success = localStorageService.deleteNote(noteId);
    if (success) {
      setNotes(localStorageService.getNotes());
      setAPIResponse("Note successfully deleted!");
    } else {
      setAPIResponse("Failed to delete note.");
    }
  };

  const handleDeleteTellMeAnswer = async () => {
    if (!tellMeAnswer) return;

    const success = localStorageService.deleteTellMePrompt();
    if (success) {
      setTellMeAnswer(null);
      setAPIResponse("Answer successfully deleted!");
    } else {
      setAPIResponse("Failed to delete answer.");
    }
  };

  const disableButton = (noteId: string) => {
    const updatedNote = notesWithUpdatedAnswers.find((x) => x.id === noteId);
    return updatedNote?.updatedNote === "" ? true : !updatedNote ? true : false;
  };

  const sortedNotes = sortArrByKey([...notes], "subject");

  return (
    <main className="lightGlassEffect">
      <div className="container">
        <div className="sidebar">
          <Sidebar
            headerText={appStrings.notesPage}
            isLoggedIn={true}
            user="Local User"
          />
        </div>

        <div className="rightContainer">
          {tellMeAnswer && (
            <div className={`${styles.tellMeContainer} flexCenter fadeIn`}>
              <div className={`${styles.notesSubject} mutedPurpleGradient`}>
                {appStrings.tellMePage.header}
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
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              question={note.question}
              note={note.note}
              noteId={note.id}
              onInputChange={onNoteChange}
              editCallback={() => {}}
              deleteCallback={handleDeleteNote}
              showEditField={true}
              disableButton={disableButton(note.id)}
              onSubmit={handleSubmitNote}
              variant="note"
            />
          ))}

          {apiResponse && (
            <div className="noteResponseContainer">
              <div className={`noteResponse mutedPurpleGradient`}>
                {apiResponse}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Notes;
