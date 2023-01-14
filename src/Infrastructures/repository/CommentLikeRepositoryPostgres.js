const AddedCommentLike = require('../../Domains/commentLikes/entities/AddedCommentLike');
const CommentLikeRepository = require('../../Domains/commentLikes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentLike(commentLike) {
    const id = `comment-like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4) RETURNING id, comment_id, thread_id, owner',
      values: [
        id,
        commentLike.commentId,
        commentLike.threadId,
        commentLike.owner,
      ],
    };
    const { rows } = await this._pool.query(query);
    const data = {
      id: rows[0].id,
      threadId: rows[0].thread_id,
      commentId: rows[0].comment_id,
      owner: rows[0].owner,
    };

    return new AddedCommentLike(data);
  }

  async verifyAvailableCommentLike(commentLike) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND thread_id = $2 AND owner = $3',
      values: [
        commentLike.commentId,
        commentLike.threadId,
        commentLike.owner,
      ],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return false;
    }
    return true;
  }

  async getIsLikeComment(commentLike) {
    const query = {
      text: `SELECT is_like FROM comment_likes 
             WHERE comment_id = $1 
             AND thread_id = $2 
             AND owner = $3`,
      values: [
        commentLike.commentId,
        commentLike.threadId,
        commentLike.owner,
      ],
    };
    const result = await this._pool.query(query);

    return result.rows[0].is_like;
  }

  async putIsLikeComment({
    commentId, threadId, owner, isLike,
  }) {
    const query = {
      text: `UPDATE comment_likes SET is_like = $1
             WHERE comment_id = $2 AND thread_id = $3 AND owner = $4
             RETURNING is_like`,
      values: [isLike, commentId, threadId, owner],
    };
    const result = await this._pool.query(query);

    return result.rows[0].is_like;
  }

  async getCommentLikeCount(commentId) {
    const query = {
      text: `SELECT COUNT(*) as like_count FROM comment_likes 
             WHERE comment_id = $1 
             AND is_like = true`,
      values: [commentId],
    };
    const result = await this._pool.query(query);

    return parseInt(result.rows[0].like_count, 10);
  }
}

module.exports = CommentLikeRepositoryPostgres;
