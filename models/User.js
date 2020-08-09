const DB = require('../config/connectDB')


const CreateUserSchema = async () => {
    try {
        sqlQuery = `CREATE TABLE IF NOT EXISTS user(
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            emailVerify BOOLEAN NOT NULL DEFAULT TRUE,
            password VARCHAR(255),
            organization VARCHAR(255),
            position VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        await DB.pool.query(sqlQuery)
    }
    catch (err) {
        console.log(err)
    }
}


module.exports.CreateUserSchema = CreateUserSchema