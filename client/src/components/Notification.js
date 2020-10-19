// -*- mode: rjsx -*-

import React from "react"

const Notification = props => {
  const {style, message} = props
  return message ? (<div style={style}>{message}</div>) : null
}

export default Notification
