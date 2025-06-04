export interface Note {
  id: string;
  question: string;
  advice?: string;
  note: string;
  subject?: string;
}

export interface TellMePrompt {
  id: string;
  promptAnswer: string;
}

const NOTES_KEY = 'interview_notes';
const TELL_ME_KEY = 'tell_me_prompt';

export const localStorageService = {
  // Notes
  getNotes: (): Note[] => {
    if (typeof window === 'undefined') return [];
    const notes = localStorage.getItem(NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  },

  saveNote: (note: Omit<Note, 'id'>): Note => {
    const notes = localStorageService.getNotes();
    const newNote = {
      ...note,
      id: crypto.randomUUID(),
    };
    localStorage.setItem(NOTES_KEY, JSON.stringify([...notes, newNote]));
    return newNote;
  },

  updateNote: (id: string, note: string): Note | null => {
    const notes = localStorageService.getNotes();
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex === -1) return null;

    const updatedNote = { ...notes[noteIndex], note };
    notes[noteIndex] = updatedNote;
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return updatedNote;
  },

  deleteNote: (id: string): boolean => {
    const notes = localStorageService.getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    localStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
    return true;
  },

  // Tell Me Prompt
  getTellMePrompt: (): TellMePrompt | null => {
    if (typeof window === 'undefined') return null;
    const prompt = localStorage.getItem(TELL_ME_KEY);
    return prompt ? JSON.parse(prompt) : null;
  },

  saveTellMePrompt: (promptAnswer: string): TellMePrompt => {
    const prompt: TellMePrompt = {
      id: crypto.randomUUID(),
      promptAnswer,
    };
    localStorage.setItem(TELL_ME_KEY, JSON.stringify(prompt));
    return prompt;
  },

  updateTellMePrompt: (id: string, promptAnswer: string): TellMePrompt | null => {
    const prompt = localStorageService.getTellMePrompt();
    if (!prompt || prompt.id !== id) return null;

    const updatedPrompt = { ...prompt, promptAnswer };
    localStorage.setItem(TELL_ME_KEY, JSON.stringify(updatedPrompt));
    return updatedPrompt;
  },

  deleteTellMePrompt: (): boolean => {
    localStorage.removeItem(TELL_ME_KEY);
    return true;
  },
}; 