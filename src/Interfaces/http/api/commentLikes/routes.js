const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.commentLike,
    options: {
      auth: 'api_forum',
    },
  },
];

module.exports = routes;
