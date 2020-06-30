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
    res.send('Phonebook has info for ' + people.length + ' people<br /><br />' + Date())
  })

  app.get('/api/people/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = people.find(person => person.id === id)
    
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })

  app.delete('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    people = people.filter(person => person.id !== id)
 
    response.status(204).end()
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

    for (var i = 0; i < people.length; i++) {
      if (people[i].name === body.name) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    people = people.concat(person)
  
    response.json(person)
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })