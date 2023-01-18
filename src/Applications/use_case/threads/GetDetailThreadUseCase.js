/* eslint-disable no-console */
class GetDetailThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comment = await this._commentRepository.getCommentWithThread(
      threadId,
    );

    const mappingComments = comment.map(async (item) => ({
      ...item,
      content: item.is_delete ? '**komentar telah dihapus**' : item.content,
      replies: await this._replyRepository.getReplyWithComment(item.id),
      likeCount: await this._commentLikeRepository.getCommentLikeCount(item.id),
    }));

    const comments = await Promise.all(mappingComments);
    thread.comments = comments.map((item) => ({
      id: item.id,
      username: item.username,
      content: item.content,
      date: item.date,
      likeCount: item.likeCount,
      replies: item.replies.map((reply) => ({
        id: reply.id,
        username: reply.username,
        date: reply.date,
        content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
      })),
    }));

    return thread;
  }
}

module.exports = GetDetailThreadUseCase;
