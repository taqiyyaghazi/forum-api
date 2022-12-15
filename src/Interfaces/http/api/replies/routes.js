const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.addReply,
    options: {
      auth: 'api_forum',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReply,
    options: {
      auth: 'api_forum',
    },
  },
];

module.exports = routes;
