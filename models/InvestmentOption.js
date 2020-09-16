const DB = require('../config/connectDB');
const util = require('util');


const createInvestmentOptionSchema = async () => {
    try {
        sqlQuery = `CREATE TABLE IF NOT EXISTS investment_option(
                  id VARCHAR(255) PRIMARY KEY,
                  project_id VARCHAR(255) REFERENCES project(id),
                  option_name VARCHAR(255),
                  option_description VARCHAR(255),   
                  min_pledge DECIMAL(12,2)
              )
          `;

        await DB.pool.query(sqlQuery);
    } catch (error) {
        console.log(error);
    }
};

module.exports.createInvestmentOptionSchema = createInvestmentOptionSchema;