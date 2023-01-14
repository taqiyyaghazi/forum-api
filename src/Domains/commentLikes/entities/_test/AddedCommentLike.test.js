/* eslint-disable no-undef */
const AddedCommentLike = require('../AddedCommentLike');

describe('AddedCommentLike entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    expect(() => new AddedCommentLike(payload)).toThrowError(
      'COMMENT_LIKE.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when paylod not meet data specification', () => {
    const payload = {
      id: true,
      threadId: 123,
      commentId: true,
      owner: 123,
    };

    expect(() => new AddedCommentLike(payload)).toThrowError(
      'COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should correctly', () => {
    const payload = {
      id: 'comment-like-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const commentLike = new AddedCommentLike(payload);

    expect(commentLike.id).toEqual(payload.id);
    expect(commentLike.threadId).toEqual(payload.threadId);
    expect(commentLike.commentId).toEqual(payload.commentId);
    expect(commentLike.owner).toEqual(payload.owner);
  });
});
