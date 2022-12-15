const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const {
      content, threadId, commentId, userId,
    } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const newReply = new NewReply({
      content, threadId, commentId, owner: userId,
    });
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
