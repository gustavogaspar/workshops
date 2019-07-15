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
  


  console.log('Create a collection')
  soda = connection.getSodaDatabase()
  tabela = 'carros'
  collection = await soda.createCollection(tabela)
  //collection.drop()

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
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbconnect.user,
      password: dbconnect.password,
      connectString: dbconnect.connectionString
    })


    let createTable = await connection.execute(
      `CREATE TABLE series(
        nome VARCHAR2(50),
        ano VARCHAR2(4),
        temporadas NUMBER
      )`,
    );
    console.log("Create Table: ", createTable)

    let insert = await connection.execute(
      "INSERT INTO series VALUES(:nm,:ano,:temp)",
      { nm : {val: 'A Grande Familia' }, ano : {val: '2001'}, temp: {val: 4} }
    );
    console.log("Insert: ", insert)

    let select = await connection.execute(
      "SELECT * FROM SERIES"
    )
    console.log("Select: ", select.rows)

/*     let dropTable = await connection.execute(
      `DROP TABLE series`,
    );
    console.log("Drop Table: ", dropTable) */



  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    return `A tabela agora contém os seguintes registros ${select.rows}`
  }
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
    return `\nInfos do registro: \n Nome: ${dataStored.getContent().name} 
    \n Marca: ${dataStored.getContent().detalhe.marca} 
    \n Ano: ${dataStored.getContent().detalhe.ano}`
  }
  catch (err) {
    console.log(err)
  }
}

module.exports = { testConnection, insertJSON, insertSQL }