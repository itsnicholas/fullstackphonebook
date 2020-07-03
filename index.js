require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/people', (request, response) => {
    Person.find({}).then(people => {
      response.json(people)
    })
  })

  app.get('/info', (req, res) => {
    Person.countDocuments({}, function (err, count) {
      res.send('Phonebook has info for ' + count + ' people<br /><br />' + Date())
    })
  })

  app.get('/api/people/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
  })

  app.delete('/api/people/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id to delete' })
    })
  })

  const generateId = () => {
    const maxId = Math.floor(Math.random() * 1000000) + 1
    return maxId
  }
  
  app.post('/api/people', (request, response) => {
    const body = request.body

    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    Person.findOne({name: body.name}, function (err, result) {
      if (err) {
        return response.status(400).json({ 
          error: 'error' 
        })
      }
      if (result) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
      
      const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
      })
    
      //people = people.concat(person)
    
      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
    })
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })