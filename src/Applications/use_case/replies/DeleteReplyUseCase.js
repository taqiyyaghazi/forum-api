const DeletedReply = require('../../../Domains/replies/entities/DeletedReply');

class DeleteReplyUseCase {
  constructor({ commentRepository, replyRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      replyId, commentId, threadId, owner,
    } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._replyRepository.verifyAvailableReply(replyId);
    await this._replyRepository.verifyOwnerReply({
      owner,
      replyId,
    });
    const deleteReply = new DeletedReply({
      replyId,
      commentId,
      threadId,
      owner,
    });

    return this._replyRepository.deleteReply(deleteReply);
  }
}

module.exports = DeleteReplyUseCase;
