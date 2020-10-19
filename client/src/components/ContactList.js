// -*- mode: rjsx -*-

import React from "react"
import lodash from "lodash"

const ContactList = props => {
  const { contacts, deleteAction } = props
  return contacts.map(contact => (
    <Contact
      key={contact.id}
      contact={contact}
      deleteAction={deleteAction}
    />
  ))
}

const Contact = props => {
  const {contact, deleteAction} = props

  return (
    <div>
      <span> {contact.name} </span>
      —
      <span> {contact.number} </span>
      <button onClick={lodash.partial(deleteAction, contact)}> delete </button>
    </div>
  )
}

export default ContactList
