class AddedReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, commentId, owner,
    } = payload;
    this.id = id;
    this.content = content;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({
    id, content, commentId, owner,
  }) {
    if (!id || !content || !commentId || !owner) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED');
    }
    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof commentId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedReply;
