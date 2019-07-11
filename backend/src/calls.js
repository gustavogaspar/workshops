const oracledb = require('oracledb');
const dbconnect = require('./dbconnect.js')

const testConnection = () =>
{
    oracledb.getConnection(
        {
          user          : dbconnect.user,
          password      : dbconnect.password,
          connectString : dbconnect.connectionString
        },
        function(err, connection) {
          if (err) {
            console.error(err.message);
            return `Connection failure: ${err.message}`;
          }
          console.log('Connection was successful!');
      
          connection.close(
            function(err) {
              if (err) { 
                console.error(err.message);
                return err.message;
              }
            });
            return 'Connection was successful'
          });
}

async function insertJSON(){
  let conn, collection;

  try {
    let soda, indexSpec, content, doc, key;

    conn = await oracledb.getConnection(dbConfig);

    // Create the parent object for SODA
    soda = conn.getSodaDatabase();

    // Create a new SODA collection and index
    // This will open an existing collection, if the name is already in use.
    collection = await soda.createCollection("mycollection");
    indexSpec = { "name": "TESTE_IDX",
      "fields": [ {
        "path": "endereco.cidade",
        "datatype": "string",
        "order": "asc" } ] };
    await collection.createIndex(indexSpec);

    // Insert a document.
    // A system generated key is created by default.
    payload = {name: "Pedro", endereco: {cidade: "Niteroi"}};
    doc = await collection.insertOneAndGet(content);
    key = doc.key;
    return "The key of the new SODA document is: "+key

  } catch (err) {
    console.error(err);
  } finally {
    if (collection) {
      // Drop the collection
      let res = await collection.drop();
      if (res.dropped) {
        console.log('Collection was dropped');
      }
    }
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
const insertSQL = () => {}

module.exports = {testConnection, insertJSON, insertSQL}