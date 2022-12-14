import React, { useState, useEffect } from 'react'
import Note from './Note';
import NoteForm from './NoteForm'
import Notification from './Notification';
import noteService from '../services/note'
import '../css/app.css'

export default function App({ initialNotes }) {
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [isError, setIsError] = useState(undefined)

  // get initial notes from server on initial component render
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
        displayNotification(
          false,
          'successfully loaded notes from server',
          initialNotes
        )
      })
      .catch(error => {
        displayNotification(
          true,
          'unable to load notes from server',
          error
        )
      })
  }, [])

  // filter notes based on showing all or only important
  const notesToShow = showAll ? 
    notes : notes.filter(note => note.important)

  // HTTP POST for adding new note
  const addNote = event => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(createdNote => {
        setNotes(notes.concat(createdNote))
        setNewNote('')
        displayNotification(
          false,
          `added note "${noteObject.content}"`,
          createdNote
        )
      })
      .catch(error => {
        displayNotification(
          true,
          `unable to add note "${noteObject.content}"`,
          error
        )
      })
  }

  // update newNote state with input field change
  const handleNoteChange = event => {
    setNewNote(event.target.value)
  }

  // handle clicking button to change note importance
  const toggleImportanceOf = id => {
    const note = notes.find(note => note.id === id)
    const toggledNote = {...note, important: !note.important}

    console.log('note', note)
    console.log('toggled note', toggledNote)
    console.log('id', id)

    noteService
      .update(id, toggledNote)
      .then(updatedNote => {
        setNotes(notes.map(note => {
          return note.id !== id ? note : updatedNote
        }))
      })
      .catch(error => {
        displayNotification(
          true,
          `unable to change importance of note "${note.content}"`,
          error
        )
      })
  }

  const displayNotification = (isError, message, response) => {
    console.log(response)

    if (isError) {
      setIsError(true)
    } else {
      setIsError(false)
    }

    setNotificationMessage(message)

    setTimeout(() => {
      setIsError(undefined)
      setNotificationMessage(null)
    }, 3000)
  }

  return (
    <div className="App">
      <h1>Notes</h1>
      <Notification
        isError={isError}
        message={notificationMessage}
      />
      <div>
        <p>
          Currently showing {showAll ? 'all' : 'important only'}
        </p>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      {notesToShow.map(note => (
        <Note 
          key={note.id}
          content={note.content}
          important={note.important}
          toggleImportance={() => toggleImportanceOf(note.id)}
        />
      ))}
      <NoteForm
        value={newNote}
        onSubmit={addNote}
        onChange={handleNoteChange}
      />
    </div>
  );
}