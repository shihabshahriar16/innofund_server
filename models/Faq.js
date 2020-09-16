const DB = require('../config/connectDB');
const util = require('util');


const createFaqSchema = async () => {
  try {
    sqlQuery = `CREATE TABLE IF NOT EXISTS faq(
                id VARCHAR(255),
                question TEXT,
                answer TEXT  
            )
        `;

    await DB.pool.query(sqlQuery);
  } catch (error) {
    console.log(error);
  }
};

module.exports.createFaqSchema = createFaqSchema;