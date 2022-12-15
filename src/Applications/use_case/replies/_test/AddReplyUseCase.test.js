/* eslint-disable no-undef */
const AddReplyUseCase = require('../AddReplyUseCase');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../../Domains/replies/entities/NewReply');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      content: 'content reply-1234',
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: credential.id,
    };

    const expectedAddReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: credential.id,
    });

    const {
      content, threadId, commentId, userId: owner,
    } = useCasePayload;

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(new AddedReply({
      id: 'reply-123',
      content: 'content reply-1234',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    })));

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */

    const getReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // action
    const replyRepository = await getReplyUseCase.execute(useCasePayload);
    expect(replyRepository).toStrictEqual(expectedAddReply);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        content, threadId, commentId, owner,
      }),
    );
  });
});
