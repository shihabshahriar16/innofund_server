const DB = require('../config/connectDB');

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

    return await DB.pool.query(sqlQuery,newComment);
  } catch (error) {
    console.log(error);
  }
};

module.exports.createCommentSchema = createCommentSchema;
module.exports.AddCommentToPost = AddCommentToPost