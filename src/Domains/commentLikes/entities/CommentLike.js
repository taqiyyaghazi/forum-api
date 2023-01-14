class CommentLike {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      threadId, commentId, id, owner,
    } = payload;
    this.id = id;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({
    threadId, commentId, id, owner,
  }) {
    if (!threadId || !commentId || !id || !owner) {
      throw new Error('COMMENT_LIKE.NOT_CONTAIN_NEEDED');
    }
    if (
      typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof id !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentLike;
