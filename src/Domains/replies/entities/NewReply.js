class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      content, threadId, commentId, owner,
    } = payload;
    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const {
      content, threadId, commentId, owner,
    } = payload;
    if (!content || !threadId || !commentId || !owner) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED');
    }

    if (
      typeof content !== 'string'
      || typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
