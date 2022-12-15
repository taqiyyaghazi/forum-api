const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.addReply = this.addReply.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
  }

  async addReply(request, h) {
    const credential = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const payload = {
      content: request.payload.content,
      threadId,
      commentId,
      userId: credential.id,
    };
    const postReply = this._container.getInstance(AddReplyUseCase.name);
    const addReply = await postReply.execute(payload);

    const addedReply = {
      id: addReply.id,
      content: addReply.content,
      owner: addReply.owner,
    };

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReply(request) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteReply = this._container.getInstance(
      DeleteReplyUseCase.name,
    );
    const payload = {
      replyId, commentId, threadId, owner,
    };
    await deleteReply.execute(payload);
    return {
      status: 'success',
    };
  }
}

module.exports = ReplyHandler;
