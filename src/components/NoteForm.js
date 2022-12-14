import React from 'react'

export default function NoteForm({
  value,
  onSubmit,
  onChange
}) {
  return (
    <form onSubmit={onSubmit}>
      <input 
        value={value}
        onChange={onChange}
      />
      <button type="submit">save</button>
    </form>
  )
}
