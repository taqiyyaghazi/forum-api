/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const addCommentLike = async ({
  id = 'comment-like-123',
  commentId = 'comment-123',
  threadId = 'thread-123',
  owner = 'user-123',
}) => {
  const query = {
    text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4) RETURNING id, comment_id, thread_id, owner',
    values: [
      id,
      commentId,
      threadId,
      owner,
    ],
  };
  await pool.query(query);
};

const getCommentLikeById = async (id) => {
  const query = {
    text: 'SELECT * FROM comment_likes where id = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows;
};

const putCommentLikeById = async ({ isLike, id }) => {
  const query = {
    text: 'UPDATE comment_likes SET is_like = $1 where id = $2',
    values: [isLike, id],
  };

  const result = await pool.query(query);
  return result.rows;
};

const cleanTableCommentLikes = async () => {
  await pool.query('DELETE FROM comments WHERE 1=1');
};

const CommentTableTestHelper = {
  addCommentLike,
  getCommentLikeById,
  putCommentLikeById,
  cleanTableCommentLikes,
};

module.exports = CommentTableTestHelper;
