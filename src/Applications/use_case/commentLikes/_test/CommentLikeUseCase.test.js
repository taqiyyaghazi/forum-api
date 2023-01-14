/* eslint-disable no-undef */
const CommentLikeUseCase = require('../CommentLikeUseCase');
const CommentLike = require('../../../../Domains/commentLikes/entities/CommentLike');
const AddedCommentLike = require('../../../../Domains/commentLikes/entities/AddedCommentLike');
const CommentLikeRepository = require('../../../../Domains/commentLikes/CommentLikeRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('CommentLikeUseCase', () => {
  it('should orchestrating the add comment like when comment like is not available action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: credential.id,
    };

    const expectedAddedCommentLike = new AddedCommentLike({
      id: 'comment-like-123',
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
      owner: credential.id,
    });

    const { commentId, threadId, userId: owner } = useCasePayload;

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentLikeRepository.verifyAvailableCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));

    mockCommentLikeRepository.addCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(
        new AddedCommentLike({
          id: 'comment-like-123',
          commentId: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        }),
      ));

    /** creating use case instance */

    const getCommentLikeUseCase = new CommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // action
    const commentLikeRepository = await getCommentLikeUseCase.execute(
      useCasePayload,
    );
    expect(commentLikeRepository).toStrictEqual(expectedAddedCommentLike);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      commentId,
    );
    expect(mockCommentLikeRepository.verifyAvailableCommentLike).toBeCalledWith(
      new CommentLike({ commentId, threadId, owner }),
    );
    expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith(
      new CommentLike({ commentId, threadId, owner }),
    );
  });
  it('should orchestrating the add comment like when comment like is available action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: credential.id,
    };
    const isLikeCommentValue = true;
    const expectedIsLikeComment = false;

    const { commentId, threadId, userId: owner } = useCasePayload;

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentLikeRepository.verifyAvailableCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));

    mockCommentLikeRepository.getIsLikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(isLikeCommentValue));

    mockCommentLikeRepository.putIsLikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));

    /** creating use case instance */

    const getCommentLikeUseCase = new CommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // action
    const commentLikeRepository = await getCommentLikeUseCase.execute(
      useCasePayload,
    );
    expect(commentLikeRepository).toStrictEqual(expectedIsLikeComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      commentId,
    );
    expect(mockCommentLikeRepository.verifyAvailableCommentLike).toBeCalledWith(
      new CommentLike({ commentId, threadId, owner }),
    );
    expect(mockCommentLikeRepository.putIsLikeComment).toBeCalledWith({
      commentId,
      isLikeCommentValue,
    });
  });
});
