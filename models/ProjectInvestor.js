const DB = require('../config/connectDB');
const util = require('util');


const createProjectInvestorSchema = async () => {
    try {
        sqlQuery = `CREATE TABLE IF NOT EXISTS project_investor(
                  id VARCHAR(255) PRIMARY KEY,
                  project_id VARCHAR(255) REFERENCES project(id),
                  user_id VARCHAR(255) REFERENCES user(id),  
                  investment_option VARCHAR(255) REFERENCES investment_option(id),
                  amount DECIMAL(12,2),
                  pledgedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
              )
          `;

        await DB.pool.query(sqlQuery);
    } catch (error) {
        console.log(error);
    }
};

const UpdatePledgeTrigger = async () => {
    try {
        // sqlQuery = `Show triggers like 'project_investor'`
        // if(!await DB.pool.query(sqlQuery)){
        sqltrigger =`
            CREATE TRIGGER UpdatePledge BEFORE INSERT ON project_investor 
            FOR EACH ROW 
            BEGIN
                UPDATE project
                SET pledged = pledged + NEW.amount
                WHERE id = NEW.project_id;
            END;   
        `;
        await DB.pool.query(sqltrigger);
        
    } catch (error) {
        console.log(error);
    }
};







module.exports.createProjectInvestorSchema = createProjectInvestorSchema;
module.exports.UpdatePledgeTrigger = UpdatePledgeTrigger;