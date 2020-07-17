const mysql = require("mysql2/promise");


const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: process.env.DBLIMIT,
    database: process.env.DB
});

const testConnection = async () => {
    try {
        sqlConnect = await pool.getConnection()
        console.log(`Connected host ${sqlConnect.config.host} port ${sqlConnect.config.port} user ${sqlConnect.config.user} database ${sqlConnect.config.database}`)
        sqlConnect.release()
    }
    catch (err) {
        console.log(err)
    }
}
module.exports.pool = pool
module.exports.testConnection = testConnection


