const oracledb = require('oracledb')
const dbconnect = require('./dbconnect.js')

async function testConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: dbconnect.user,
      password: dbconnect.password,
      connectString: dbconnect.connectionString
    })
  }
  catch (err) {
    console.log('Error in processing:\n', err);
  }
  finally {
    const connectionStatus = "A conexão foi iniciada e" + await closeConnection(connection)
    return connectionStatus
  }
}

async function insertJSON() {
  let connection, soda, tabela, executionStatus;
  console.log('Connected to database...')
  connection = await oracledb.getConnection({
    user: dbconnect.user,
    password: dbconnect.password,
    connectString: dbconnect.connectionString
  })
  //oracledb.autoCommit = true;

  console.log('Create a collection')
  soda = connection.getSodaDatabase()
  tabela = 'carros'
  collection = await soda.createCollection(tabela)

  try {
    console.log('Create index 1')
    await collection.createIndex({
      "name": "modelo_idx",
      "fields": [{ "path": "detalhe.marca", "datatype": "string" }]
    })
    console.log('Create index 2')
    await collection.createIndex({
      "name": "ano_idx",
      "fields": [{ "path": "detalhe.ano", "datatype": "string" }]
    })
  }
  catch (err) {
    console.log(err + ' igonirng the creation step')
    executionStatus = `A tabela ${tabela} já foi criada:\n `
  }
  finally {
    executionStatus += await insertAndGetValuesJSON(collection, connection)
    await closeConnection(connection)
    return executionStatus
  }

}
async function insertSQL() {
  return "nada"
 }


async function closeConnection(conn) {
  if (conn) {
    try {
      await conn.close();
    } catch (err) {
      return ' houve um erro para encerra-la:' + err;
    }
    finally {
      return " encerrada com sucesso"
    }
  }
}

async function insertAndGetValuesJSON(coll, conn) {
  let payload = '{"name": "UNO", "detalhe": { "marca": "FIAT", "ano": "2003" }}'
  try {
    let result = await coll.insertOneAndGet(JSON.parse(payload))
    conn.commit()
    console.log("Registro criado. ID: ", result.key)
    let dataStored = await collection.find().key(result.key).getOne()
    console.log(`Infos do registro: \n Nome: ${dataStored.getContent().name} \n Marca: ${dataStored.getContent().detalhe.marca}`)
    return `\nInfos do registro: \n Nome: ${dataStored.getContent().name} \n Marca: ${dataStored.getContent().detalhe.marca} \nAno: ${dataStored.getContent().detalhe.ano}`
  }
  catch (err) {
    console.log(err)
  }
}

module.exports = { testConnection, insertJSON, insertSQL }