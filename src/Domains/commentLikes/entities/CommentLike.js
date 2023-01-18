class CommentLike {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      threadId, commentId, owner,
    } = payload;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({
    threadId, commentId, owner,
  }) {
    if (!threadId || !commentId || !owner) {
      throw new Error('COMMENT_LIKE.NOT_CONTAIN_NEEDED');
    }
    if (
      typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentLike;
