/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const addReply = async ({
  id = 'reply-123',
  content = 'lorem ipsum',
  threadId = 'thread-123',
  commentId = 'comment-123',
  owner = 'user-123',
}) => {
  const date = new Date().toISOString();
  const query = {
    text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6)',
    values: [id, content, threadId, commentId, owner, date],
  };
  const result = await pool.query(query);
  return result;
};

const getReplyById = async (id) => {
  const query = {
    text: 'SELECT * FROM replies where id = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows;
};

const cleanTableReply = async () => {
  await pool.query('DELETE FROM replies WHERE 1=1');
};

const ReplyTableTestHelper = {
  addReply,
  getReplyById,
  cleanTableReply,
};

module.exports = ReplyTableTestHelper;
