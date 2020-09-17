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

const CreateUpdatePledgeAndOptionTrigger = async () => {
    try {
        sqltrigger =`DROP TRIGGER IF EXISTS UpdatePledgeAndOption;
                    CREATE TRIGGER UpdatePledgeAndOption BEFORE INSERT ON project_investor 
                    FOR EACH ROW 
                    BEGIN
                        UPDATE project
                        SET pledged = pledged + NEW.amount
                        WHERE id = NEW.project_id;
                        SET NEW.investment_option = calculateInvestmentOption(NEW.user_id, NEW.project_id);
                    END;   
        `;
        await DB.pool.query(sqltrigger);
        await DB.pool.query(sqlQuery);
    } catch (error) {
        console.log(error);
    }
};

        
const CreateFuncCalculateInvestmentOption = async () => {
    try {
        sqlQuery = `DROP FUNCTION IF EXISTS calculateInvestmentOption;
                    CREATE FUNCTION 
                    calculateInvestmentOption(investor VARCHAR(255), project VARCHAR(255))
                    RETURNS VARCHAR(255)
                    DETERMINISTIC
                    BEGIN
                    DECLARE investment_option VARCHAR(255) default "";
                    DECLARE total_investment decimal(12,2) DEFAULT 0.00;
                    DECLARE user_  VARCHAR(255);
                    DECLARE project_ VARCHAR(255);
                    DECLARE option_ VARCHAR(255);
                    DECLARE min_pledge_ DECIMAL(12,2);
                    DECLARE prev_min DECIMAL(12,2) DEFAULT 0.00;
                    DECLARE pledged_ DECIMAL(12,2);
                    DECLARE result_option VARCHAR(255) DEFAULT "";
                    DECLARE finished INTEGER DEFAULT 0;
                    
                    DECLARE c1 CURSOR FOR select user_id, project_id, pledged  from project_investor;
                    DECLARE c2 CURSOR FOR select project_id, option_name, min_pledge from investment_option;
                    
                    DECLARE CONTINUE HANDLER 
                        FOR NOT FOUND SET finished = 1;
                    
                    
                    OPEN c1;
                    get_data1: LOOP
                        FETCH c1 into user_, project_, pledged_;
                        IF finished = 1 THEN 
                            LEAVE get_data1 ;
                        END IF;
                        IF user_ = investor AND project_ = project THEN
                            SET total_investment = total_investment + pledged_;
                        END IF;
                     
                    END LOOP get_data1;
                     
                    OPEN c2;
                    get_data2: LOOP
                        FETCH c2 into project_, option_, min_pledge_;
                        IF finished = 1 THEN 
                            LEAVE get_data2; 
                        END IF;
                        IF project_ = project AND total_investment > min_pledge_ then
                            IF total_investment > prev_min THEN
                                SET result_option = option_;
                                SET prev_min = min_pledge;
                            END IF;
                        END IF;
                    END LOOP get_data2;
                    CLOSE c1;
                    CLOSE c2;
                    RETURN result_option;
                    END
          `;

        await DB.pool.query(sqlQuery);
    } catch (error) {
        console.log(error);
    }
};



module.exports.createProjectInvestorSchema = createProjectInvestorSchema;
module.exports.CreateUpdatePledgeAndOptionTrigger = CreateUpdatePledgeAndOptionTrigger;
module.exports.createProjectInvestorSchema = createProjectInvestorSchema;
module.exports.CreateFuncCalculateInvestmentOption = CreateFuncCalculateInvestmentOption;
