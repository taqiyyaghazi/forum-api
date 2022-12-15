/* eslint-disable no-undef */
const NewReply = require('../NewReply');

describe('NewReply Entities', () => {
  it('should throw error when payload not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    expect(() => new NewReply(payload)).toThrowError(
      'REPLY.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when payload not meet data specification ', () => {
    // Arrange
    const payload = {
      content: true,
      threadId: 123,
      commentId: 232,
      owner: 123,
    };

    expect(() => new NewReply(payload)).toThrowError(
      'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should correctly ', () => {
    // Arrange
    const payload = {
      content: 'content-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const newComment = new NewReply(payload);

    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.commentId).toEqual(payload.commentId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
