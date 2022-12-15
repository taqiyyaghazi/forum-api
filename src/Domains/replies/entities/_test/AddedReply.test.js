/* eslint-disable no-undef */
const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    expect(() => new AddedReply(payload)).toThrowError(
      'REPLY.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when paylod not meet data specification', () => {
    const payload = {
      id: true,
      content: 123,
      commentId: true,
      owner: 123,
    };

    expect(() => new AddedReply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'content-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const newReply = new AddedReply(payload);

    expect(newReply.id).toEqual(payload.id);
    expect(newReply.content).toEqual(payload.content);
    expect(newReply.commentId).toEqual(payload.commentId);
    expect(newReply.owner).toEqual(payload.owner);
  });
});
