import React from 'react'
import '../styles/App.css'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const getClassname = () => {
    switch (type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    default:
      return ''
    }
  }
  const className = `notification ${getClassname()}`

  return <div className={className}>{message}</div>
}

export default Notification
