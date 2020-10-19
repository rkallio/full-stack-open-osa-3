const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const url = process.env.MONGODB_URI

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(result => console.log("connected to MongoDB"))
  .catch(error => console.error("error connecting to MongoDB: ", error.message))

const contactSchema = new mongoose.Schema({
  name: {type:String, required: true, unique:true, minLength: 3},
  number: {type:String, required:true, mingLength: 8}
})

contactSchema.plugin(uniqueValidator)

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Contact = mongoose.model("Contact", contactSchema)

module.exports = Contact
