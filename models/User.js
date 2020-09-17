const DB = require('../config/connectDB')
const util = require('util');

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

const CreateFuncGenerateUserID = async () => {
    try {
        sqlQuery = `DROP FUNCTION IF EXISTS GenerateUserID;
                    CREATE FUNCTION GenerateUserID()
                    RETURNS VARCHAR(255)
                    DETERMINISTIC
                    BEGIN
                    DECLARE ID VARCHAR(255);
                    DECLARE DATE INT;
                    DECLARE XXX INT;
                    
                    SET DATE=CURRENT_DATE();
                    SET DATE=SUBSTR(DATE,3,6);
                    SELECT COUNT(id) into XXX from user WHERE id LIKE CONCAT(DATE, '%');
                    IF (XXX IS NULL) THEN
                        SET XXX = 0;
                    END IF;
                    
                    SET XXX = XXX+1;
                    
                    SET ID = DATE;
                    SET ID = CONCAT(ID, LPAD(XXX, 3, '0'));
                    RETURN ID;
                    END
                    `;

        await DB.pool.query(sqlQuery);
    }
    catch (error) {
        console.log(error);
    }
};

const CreateTrigUpdateUserID = async () => {
    try {
        sqlQuery = `DROP TRIGGER IF EXISTS updateUserID;
                    CREATE TRIGGER updateUserID 
                    BEFORE INSERT ON user
                    FOR EACH ROW
                    BEGIN
                    SET NEW.id = GenerateUserID();
                    END; 
          `;

        await DB.pool.query(sqlQuery);
    }
    catch (error) {
        console.log(error);
    }
};

const createFuncCalculateTotalInvestment = async () => {
    try {
        sqlQuery = `DROP FUNCTION IF EXISTS calculateTotalInvestment;
            CREATE FUNCTION
            calculateTotalInvestment(investor VARCHAR(255))
            RETURNS DECIMAL(12,2)
            DETERMINISTIC
            BEGIN
            DECLARE total_investment DECIMAL (12,2) DEFAULT 0.00;
            SELECT SUM(pledged) INTO total_investment FROM project_investor
            WHERE user_id = investor;
            RETURN total_investment;
            END
          `;

        await DB.pool.query(sqlQuery);
    }
    catch (error) {
        console.log(error);
    }
};

const calculateTotalInvestment = async (investor) => {
    try {
        sqlQuery = `calculateTotalInvestment('${investor}')`;
        return await DB.pool.query(sqlQuery);
    }
    catch (error) {
        console.log(error);
    }
};

const getUserById = async (id) => {
    try {
    console.log(id)
      const query = util.promisify(DB.pool.query).bind(DB.pool);
      sqlQuery = `SELECT * FROM user WHERE id='${id}'`;
      return await query(sqlQuery);
    } catch (error) {
      console.log(error);
    }
  };

module.exports.CreateUserSchema = CreateUserSchema;
module.exports.CreateFuncGenerateUserID = CreateFuncGenerateUserID;
module.exports.CreateTrigUpdateUserID = CreateTrigUpdateUserID;
module.exports.createFuncCalculateTotalInvestment = createFuncCalculateTotalInvestment;
module.exports.calculateTotalInvestment = calculateTotalInvestment;
module.exports.getUserById = getUserById;