const CommentLike = require('../../../Domains/commentLikes/entities/CommentLike');

class CommentLikeUseCase {
  constructor({ commentRepository, threadRepository, commentLikeRepository }) {
    this._commentLikeRepository = commentLikeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const {
      commentId, threadId, userId,
    } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const commentLike = new CommentLike({
      commentId, threadId, owner: userId,
    });
    const commentLikeIsAvailable = await this._commentLikeRepository.verifyAvailableCommentLike(
      commentLike,
    );

    if (commentLikeIsAvailable) {
      const isLike = await this._commentLikeRepository.getIsLikeComment(commentLike);
      return this._commentLikeRepository.putIsLikeComment({
        commentId,
        threadId,
        isLike: !isLike,
        owner: userId,
      });
    }
    return this._commentLikeRepository.addCommentLike(commentLike);
  }
}

module.exports = CommentLikeUseCase;
