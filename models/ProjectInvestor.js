const DB = require('../config/connectDB');
const util = require('util');


const createProjectInvestorSchema = async () => {
    try {
        sqlQuery = `CREATE TABLE IF NOT EXISTS project_investor(
                  id VARCHAR(255) PRIMARY KEY,
                  project_id VARCHAR(255) REFERENCES project(id),
                  user_id VARCHAR(255) REFERENCES user(id),  
                  investment_option VARCHAR(255) REFERENCES investment_option(id),
                  pledged DECIMAL(12,2),
                  pledgedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
              )
          `;

        await DB.pool.query(sqlQuery);
    } catch (error) {
        console.log(error);
    }
};

module.exports.createProjectInvestorSchema = createProjectInvestorSchema;