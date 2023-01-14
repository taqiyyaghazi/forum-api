/* eslint-disable no-undef */
const CommentLikeRepository = require('../CommentLikeRepository');

describe('comment like repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const newCommentLike = new CommentLikeRepository();
    await expect(newCommentLike.addCommentLike(' ')).rejects.toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newCommentLike.verifyAvailableCommentLike(' ')).rejects.toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newCommentLike.getIsLikeComment(' ')).rejects.toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newCommentLike.putIsLikeComment(' ')).rejects.toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newCommentLike.getCommentLikeCount(' ')).rejects.toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
