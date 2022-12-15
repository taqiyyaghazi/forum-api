/* eslint-disable no-undef */
const DeletedReply = require('../DeletedReply');

describe('DeletedReply entities', () => {
  it('should throw error when payload not contain property', () => {
    const payload = {
      commentId: 'comment-124',
      replyId: '',
    };

    expect(() => new DeletedReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when payload not meet data specifications', () => {
    const payload = {
      threadId: 'thread-124',
      commentId: 'comment-124',
      replyId: 'reply-123',
      owner: true,
    };

    expect(() => new DeletedReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when payload not meet data specifications', () => {
    const payload = {
      threadId: 'thread-124',
      commentId: 'comment-124',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const deleteReply = new DeletedReply(payload);
    expect(deleteReply.threadId).toEqual(payload.threadId);
    expect(deleteReply.commentId).toEqual(payload.commentId);
    expect(deleteReply.replyId).toEqual(payload.replyId);
    expect(deleteReply.owner).toEqual(payload.owner);
  });
});
