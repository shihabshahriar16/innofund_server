const DB = require('../config/connectDB');
const util = require('util')

const createCommentSchema = async () => {
  try {
    sqlQuery = `CREATE TABLE IF NOT EXISTS comment(
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  project_id INT REFERENCES project(id),
                  user_account_id INT REFERENCES user(id),
                  comment_text TEXT,
                  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP                  
              )
          `;

    await DB.pool.query(sqlQuery);
  } catch (error) {
    console.log(error);
  }
};

const AddCommentToPost = async (newComment) => {
  try {
    sqlQuery = `INSERT INTO comment SET ?`;

    return await DB.pool.query(sqlQuery, newComment);
  } catch (error) {
    console.log(error);
  }
};

const GetCommentById = async (commentId, projectId) => {
  try {
    const query = util.promisify(DB.pool.query).bind(DB.pool);
    sqlQuery = `SELECT * FROM comment WHERE id=${commentId} AND project_id=${projectId}`;
    return await query(sqlQuery);
  } catch (error) {
    console.error(error);
  }
};
const DeleteCommentById = async (commentId, projectId) => {
  try {
    sqlQuery = `DELETE FROM comment WHERE id=${commentId} AND project_id=${projectId}`;
    await DB.pool.query(sqlQuery);
  } catch (error) {
    console.error(error);
  }
};



module.exports.createCommentSchema = createCommentSchema;
module.exports.AddCommentToPost = AddCommentToPost;
module.exports.GetCommentById = GetCommentById;
module.exports.DeleteCommentById = DeleteCommentById;
