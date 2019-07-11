const express = require('express') //importacao do pacote
const app = express() //instanciando express
const cors = require('cors')

app.use(cors())

app.get('/', function (req, res) { 
    res.send('Voce testou a conexão com o banco')
})
app.get('/json/', function (req, res) { 
    res.send('Voce chamou o Insert JSON')
})
app.get('/plsql/', function (req, res) { 
    res.send('Voce chamou o Insert PLSQL')
})
app.get('/csv/', function (req, res) { 
    res.send('Voce enviou um csv')
})
app.listen(3000) //execucao do servidor