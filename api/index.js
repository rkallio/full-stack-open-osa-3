require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const path = require("path")

const Contact = require("./src/models/contact")
const mongoose = require("mongoose")

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body)
})

const app = express()
const api = express.Router()
const persons = express.Router()
const info = express.Router()
app.use(cors())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(express.static(path.join(__dirname, "build")))
app.use("/api/", api)
api.use(express.json())
api.use("/persons", persons)
api.use("/info", info)

persons.get("/", (request, response) => {
  const promise = Contact.find({})
  promise
    .then(contacts => {
      response.json(contacts)
    })
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
})

persons.get("/:id", (request, response, next) => {
  const {id} = request.params
  const promise = Contact.findById(id)
  promise
    .then(contact => {
      if(contact) {
        response.json(contact)
      } else {
        response.sendStatus(404)
      }
    })
    .catch(err => next(err))
})

persons.delete("/:id", (request, response, next) => {
  const {id} = request.params

  Contact.findByIdAndRemove(id)
    .then(result => {
      response.sendStatus(204)
    })
    .catch(error => next(error))
})

persons.post("/", (request, response, next) => {
  const {name, number} = request.body
  const contact = new Contact({name, number})
  contact.save()
    .then(saved => response.json(saved))
    .catch(error => next(error))
})

persons.put("/:id", (req, res, next) => {
  const {id} = req.params
  const {name, number} = req.body
  const contact = {name, number}

  Contact.findByIdAndUpdate(id, contact, {new:true})
    .then(updated => {
      res.json(updated)
    })
    .catch(err => next(err))
})

info.get("/", (request, response) => {
  response.set("Content-Type", "text/plain")
  const promise = Contact.estimatedDocumentCount()
  promise
    .then(count => {
      const str = `\
Phonebook has info for ${count} people

${new Date().toLocaleString()}`
      response.send(str)
    })
    .catch(err => {
      console.error(err)
      response.sendStatus(500)
    })
})

const unknown = (req, res) => {
  res.status(404).json({error:"unknown endpoint"})
}

app.use(unknown)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if(err.name === "CastError") {
    return res.status(400).send({error: err.message})
  } else if(err.name === "ValidationError") {
    return res.status(400).json({error: err.message})
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
const server = app.listen(PORT, () => console.log(`Server on ${PORT}`))

server.on("close", () => {
  console.log("Closing server")
  mongoose.connection.close()
})

const cleanup = () => {
  if(server.listening) {
    server.close()
  }
}

process.on("SIGINT", cleanup)
process.on("SIGUSR2", cleanup)
