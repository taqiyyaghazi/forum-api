/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/likes endpoint', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTableCommentLikes();
    await CommentsTableTestHelper.cleanTableComment();
    await ThreadsTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const dataUser = {
    username: 'ghazi1',
    password: 'password',
    fullname: 'Ghazi Taqiyya One',
  };

  beforeEach(async () => {
    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: dataUser.username,
        password: dataUser.password,
        fullname: dataUser.fullname,
      },
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: dataUser.username,
        password: dataUser.password,
      },
    });

    const { data } = JSON.parse(response.payload);
    dataUser.accessToken = data.accessToken;
  });

  describe('endpoint /threads/{threadId}/comments/{commentId}/likes', () => {
    const reqBodyThread = {
      title: 'title thread',
      body: 'body thread',
    };

    const reqBodyComment = {
      content: 'body content',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBodyThread,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      reqBodyThread.id = responseThreadJson.data.addedThread.id;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: reqBodyComment,
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      reqBodyComment.id = responseCommentJson.data.addedComment.id;
    });

    it('should response 201 and like comment', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${reqBodyThread.id}/comments/${reqBodyComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
