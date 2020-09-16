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

const AddNewFaq = async (newFaqEntry) => {
    try {
      sqlQuery = `INSERT INTO faq SET ?`;
  
      await DB.pool.query(sqlQuery, newFaqEntry);
    } catch (error) {
      console.log(error);
    }
  };

  const GetAllFAQEntries = async () => {
    try {
      sqlQuery = `SELECT * FROM faq`;
      return await DB.pool.query(sqlQuery);
    } catch (error) {
      console.log(error);
    }
  };

module.exports.createFaqSchema = createFaqSchema;
module.exports.AddNewFaq = AddNewFaq;
module.exports.GetAllFAQEntries = GetAllFAQEntries;
