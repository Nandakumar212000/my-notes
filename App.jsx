import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";
import {
  handleCreatAccount,
  authendicateUser,
  notesCollection,
} from "./firebase.js";
import { onSnapshot } from "firebase/firestore";

export default function App() {
  const [loginInfo, setLoginInfo] = useState({});
  const [logIn, setLogIn] = useState(false);
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState(notes[0]?.id || "");

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapShot) {
      const notesArr = snapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  function newAccount() {
    handleCreatAccount(loginInfo);
  }

  function authLogin() {
    authendicateUser(loginInfo, setLogIn);
  }

  function updateLoginInfo(e) {
    setLoginInfo((previnfo) => {
      return {
        ...previnfo,
        [e.target.name]: e.target.value,
      };
    });
  }

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes((oldNotes) => {
      const newArray = [];
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          // Put the most recently-modified note at the top
          newArray.unshift({ ...oldNote, body: text });
        } else {
          newArray.push(oldNote);
        }
      }
      return newArray;
    });
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes((oldNotes) => oldNotes.filter((note) => note.id !== noteId));
  }

  return (
    <>
      {!logIn ? (
        <div className="LoginBox">
          <button className="google">Sign in with Google Account</button>
          <input
            name="email"
            className="Field"
            type="text"
            placeholder="Username"
            onChange={(e) => updateLoginInfo(e)}
          />
          <input
            name="password"
            className="Field"
            type="password"
            placeholder="Password"
            onChange={(e) => updateLoginInfo(e)}
          />
          <input
            className="btn"
            type="button"
            value="Login"
            onClick={authLogin}
          />

          <input
            className="btn"
            type="button"
            value="Create Account"
            onClick={newAccount}
          />
        </div>
      ) : (
        <main>
          {notes.length > 0 ? (
            <Split sizes={[30, 70]} direction="horizontal" className="split">
              <Sidebar
                notes={notes}
                currentNote={currentNote}
                setCurrentNoteId={setCurrentNoteId}
                newNote={createNewNote}
                deleteNote={deleteNote}
              />
              {currentNoteId && notes.length > 0 && (
                <Editor currentNote={currentNote} updateNote={updateNote} />
              )}
            </Split>
          ) : (
            <div className="no-notes">
              <h1>You have no notes</h1>
              <button className="first-note" onClick={createNewNote}>
                Create one now
              </button>
            </div>
          )}
        </main>
      )}
    </>
  );
}
