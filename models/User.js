const DB = require('../config/connectDB')


const CreateUserSchema = async () => {
    try {
        sqlQuery = `CREATE TABLE IF NOT EXISTS user(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            emailVerify BOOLEAN NOT NULL DEFAULT TRUE,
            password VARCHAR(255),
            organization VARCHAR(100),
            position VARCHAR(100),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        await DB.pool.query(sqlQuery)
    }
    catch (err) {
        console.log(err)
    }
}


module.exports.CreateUserSchema = CreateUserSchema