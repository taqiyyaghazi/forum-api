class GetCountCommentLike {
  constructor(payload) {
    this._verifyPayload(payload);
    const { likeCount } = payload;
    this.likeCount = likeCount;
  }

  _verifyPayload({ likeCount }) {
    if (!likeCount) {
      throw new Error('COMMENT_LIKE.NOT_CONTAIN_NEEDED');
    }
    if (
      typeof likeCount !== 'number'
    ) {
      throw new Error('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCountCommentLike;
