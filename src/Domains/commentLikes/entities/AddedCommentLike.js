class AddedCommentLike {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, threadId, commentId, owner,
    } = payload;
    this.id = id;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({
    id, threadId, commentId, owner,
  }) {
    if (!id || !threadId || !commentId || !owner) {
      throw new Error('COMMENT_LIKE.NOT_CONTAIN_NEEDED');
    }
    if (
      typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof owner !== 'string'
      || typeof id !== 'string'
    ) {
      throw new Error('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedCommentLike;
