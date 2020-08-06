const DB = require('../config/connectDB');

// organization_id INT FK,project_status_id INT FK - should we include them now?
const createProjectSchema = async () => {
  try {
    sqlQuery = `CREATE TABLE IF NOT EXISTS project(
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_name VARCHAR(255),  
                user_account_id INT REFERENCES user(id),
                project_description TEXT,
                project_location TEXT,
                start_date DATE,
                end_date DATE,
                goal DECIMAL(12,2),
                pledeged DECIMAL(12,2),
                investors INT
                
            )
        `;

    await DB.pool.query(sqlQuery);
  } catch (error) {
    console.log(error);
  }
};

const getAllProjects = async () => {
  try {
    sqlQuery = `SELECT * FROM project`;
    return await DB.pool.query(sqlQuery);
  } catch (error) {
    console.log(error);
  }
};

const getProjectById = async (id) => {
  try {
    sqlQuery = `SELECT * FROM project WHERE id=${id}`;
    return await DB.pool.query(sqlQuery);
  } catch (error) {
    console.log(error);
  }
};

module.exports.createProjectSchema = createProjectSchema;
module.exports.getAllProjects = getAllProjects;
module.exports.getProjectById = getProjectById;
