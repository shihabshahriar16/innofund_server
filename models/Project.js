const DB = require('../config/connectDB');
const util = require('util');

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
                pledged DECIMAL(12,2) DEFAULT 0,
                investors INT DEFAULT 0
                
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
    const query = util.promisify(DB.pool.query).bind(DB.pool);
    sqlQuery = `SELECT * FROM project WHERE id=${id}`;
    return await query(sqlQuery);
  } catch (error) {
    console.log(error);
  }
};

const createNewProject = async (newProject) => {
  try {
    sqlQuery = `INSERT INTO project SET ?`;
    await DB.pool.query(sqlQuery, newProject);
  } catch (error) {
    console.log(error);
  }
};

const DeleteProjectById = async (projectId) => {
  try {
    sqlQuery = `DELETE FROM project WHERE id=${projectId}`;
    await DB.pool.query(sqlQuery);
  } catch (error) {
    console.error(error);
  }
};
module.exports.createProjectSchema = createProjectSchema;
module.exports.getAllProjects = getAllProjects;
module.exports.getProjectById = getProjectById;
module.exports.createNewProject = createNewProject;
module.exports.DeleteProjectById = DeleteProjectById;