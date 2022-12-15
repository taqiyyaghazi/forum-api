const DeletedComment = require('../../../Domains/comments/entities/DeletedComment');

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeletedComment(useCasePayload);
    await this._threadRepository.verifyAvailableThread(deleteComment.threadId);
    await this._commentRepository.verifyAvailableComment(
      deleteComment.commentId,
    );
    await this._commentRepository.verifyOwnerComment({
      owner: deleteComment.owner,
      commentId: deleteComment.commentId,
    });

    return this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
