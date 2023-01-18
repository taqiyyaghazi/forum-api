const CommentLikeUseCase = require('../../../../Applications/use_case/commentLikes/CommentLikeUseCase');

class CommentLikeHandler {
  constructor(container) {
    this._container = container;

    this.commentLike = this.commentLike.bind(this);
  }

  async commentLike(request, h) {
    const credential = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const payload = {
      commentId,
      threadId,
      userId: credential.id,
    };
    const putCommentLike = this._container.getInstance(CommentLikeUseCase.name);
    await putCommentLike.execute(payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentLikeHandler;
