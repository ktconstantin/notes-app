import React from 'react'

export default function Note({ 
  content,
  important,
  toggleImportance
}) {

  const label = important ?
    'make not important' : 'make important'

  return (
    <li className='note'>
      <span className='note-content'>{content}</span>
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
