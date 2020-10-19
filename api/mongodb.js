const mongoose = require("mongoose")

const [password, name, number] = process.argv.slice(2)

if(!password) {
  console.log("Give password")
  process.exit(1)
}

const connectionString = `mongodb+srv://roni:${password}@cluster0.g7dy6.mongodb.net/contact-app?retryWrites=true&w=majority`

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model("Contact", contactSchema)

if(!name || !number) {
  Contact
    .find({})
    .then(contacts => {
      console.log("phonebook:")
      contacts.forEach(contact => console.log(`${contact.name} ${contact.number}`))
      mongoose.connection.close()
    })
} else {
  const contact = new Contact({name, number})
  contact.save().then(res => {
    console.log(res)
    mongoose.connection.close()
  })
}
