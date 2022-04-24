const {db} = require('../config.json')
const {connect, connection} = require('mongoose')

const assertConnection = async function(){
    if (connection.readyState == 1) return connection;
    try{
        await connect(process.env.DB_CONNECTION_STRING|| db.url,  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        console.log(`connected to ${process.env.DB_CONNECTION_STRING|| db.url}`);
    }
    catch(err){
        console.error(err);
        process.exit();
    }
}

module.exports = assertConnection