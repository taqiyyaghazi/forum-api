/* eslint-disable no-undef */
const ReplyRepository = require('../ReplyRepository');

describe('comment repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const newReply = new ReplyRepository();
    await expect(newReply.addReply(' ')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newReply.verifyAvailableReply(' ')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newReply.verifyOwnerReply(' ')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newReply.deleteReply(' ')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newReply.getReplyWithComment(' ')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
