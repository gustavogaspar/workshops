const express = require('express') //importacao do pacote
const app = express() //instanciando express
const cors = require('cors')
const calls = require('./calls')

app.use(cors())

app.get('/', function (req, res) { 
    res.send(calls.testConnection())
})
app.get('/json/', function (req, res) { 
    res.send(calls.insertJSON())
})
app.get('/plsql/', function (req, res) { 
    res.send('Voce chamou o Insert PLSQL')
})
app.get('/csv/', function (req, res) { 
    res.send('Voce enviou um csv')
})
app.listen(3000) //execucao do servidor