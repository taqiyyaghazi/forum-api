/* eslint-disable no-undef */
const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyOwnerReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ status: 'success' }));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const deleteReply = await deleteReplyUseCase.execute(useCasePayload);
    expect(deleteReply).toStrictEqual({ status: 'success' });
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(
      useCasePayload.replyId,
    );
    expect(mockReplyRepository.verifyOwnerReply).toBeCalledWith({
      owner: useCasePayload.owner,
      replyId: useCasePayload.replyId,
    });
    expect(mockReplyRepository.deleteReply).toBeCalledWith({
      owner: useCasePayload.owner,
      replyId: useCasePayload.replyId,
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
    });
  });
});
