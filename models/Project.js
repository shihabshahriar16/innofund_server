const DB = require('../config/connectDB');
const util = require('util');

// organization_id INT FK,project_status_id INT FK - should we include them now?
//test created_by_id = 88318dab-54fe-4e75-bb39-a36ecbe6b9aa
const createProjectSchema = async () => {
  try {
    sqlQuery = `CREATE TABLE IF NOT EXISTS project(
                id VARCHAR(255) PRIMARY KEY,
                created_by_id VARCHAR(255) REFERENCES user(id),
                project_name VARCHAR(255),  
                project_type VARCHAR(255), 
                project_description TEXT,
                start_date DATE,
                end_date DATE,
                goal DECIMAL(12,2),
                pledged DECIMAL(12,2) DEFAULT 0,
                investors INT DEFAULT 0,
                project_status_id VARCHAR(255),
                project_video_url VARCHAR(255)    
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
    sqlQuery = `SELECT * FROM project WHERE id='${id}'`;
    return await query(sqlQuery);
  } catch (error) {
    console.log(error);
  }
};

const createNewProject = async (newProject, next) => {
  try {
    sqlQuery = `INSERT INTO project SET ?`;
    await DB.pool.query(sqlQuery, newProject);
  } catch (error) {
    console.log(error);
    next(error);
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

const getProjectsByUserId = async (userId) => {
  try {
    const query = util.promisify(DB.pool.query).bind(DB.pool);
    sqlQuery = `SELECT * FROM project WHERE created_by_id='${userId}'`;
    return await query(sqlQuery);
  } catch (error) {
    console.error(error);
  }
};
module.exports.createProjectSchema = createProjectSchema;
module.exports.getAllProjects = getAllProjects;
module.exports.getProjectById = getProjectById;
module.exports.createNewProject = createNewProject;
module.exports.DeleteProjectById = DeleteProjectById;
module.exports.getProjectsByUserId = getProjectsByUserId;
