const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const GetReply = require('../../Domains/replies/entities/GetReply');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, comment_id, owner',
      values: [
        id,
        newReply.content,
        newReply.threadId,
        newReply.commentId,
        newReply.owner,
        date,
      ],
    };
    const result = await this._pool.query(query);
    const data = {
      commentId: result.rows[0].comment_id,
      ...result.rows[0],
    };

    return new AddedReply(data);
  }

  async verifyAvailableReply(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE ID = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`Reply id ${replyId} tidak ditemukan`);
    }
  }

  async verifyOwnerReply({ owner, replyId }) {
    const query = {
      text: 'SELECT id from replies WHERE owner = $1 AND id = $2',
      values: [owner, replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Balasan bukan milik anda');
    }
  }

  async deleteReply({ replyId }) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async getReplyWithComment(commentId) {
    const query = {
      text: `SELECT replies.*, users.username
      FROM replies LEFT JOIN users ON users.id = replies.owner
      WHERE replies.comment_id = $1
      ORDER BY date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((item) => new GetReply(item));
  }
}

module.exports = ReplyRepositoryPostgres;
