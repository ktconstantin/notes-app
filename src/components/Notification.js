import React from 'react'

export default function Notification({ isError, message }) {
  if (!message) {
    return null
  }

  const className = isError ?
    'error-notification' : 'success-notification'

  return (
    <div className={className}>{message}</div>
  )
}
