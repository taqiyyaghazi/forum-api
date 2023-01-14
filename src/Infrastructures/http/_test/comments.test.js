/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/comments endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTableComment();
    await ThreadsTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const dataUser = {
    username: 'ghazi',
    password: 'password',
    fullname: 'Ghazi Taqiyya',
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

  describe('endpoint /threads/{threadId}/comments', () => {
    const reqBodyThread = {
      title: 'title thread',
      body: 'body thread',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBodyThread,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      reqBodyThread.id = responseJson.data.addedThread.id;
    });

    it('should response 201 and new thread', async () => {
      const payload = {
        content: 'body content',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(payload.content);
    });

    it('should throw error 400 when request payload not contain needed property', async () => {
      const payload = {};

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada',
      );
    });
    it('should throw error 400 when request payload not meet data type specification', async () => {
      const payload = {
        content: [123, 'lorem'],
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai',
      );
    });
  });

  describe('endpoint /threads/{threadId}/comments/{commentId}', () => {
    const threadPayload = {
      title: 'Title Thread',
      body: 'description thread',
    };
    const commentPayload = {
      content: 'Description content',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: threadPayload,
      });

      const responseThreadJson = JSON.parse(threadResponse.payload);
      threadPayload.id = responseThreadJson.data.addedThread.id;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: commentPayload,
      });

      const responseCommentJson = JSON.parse(commentResponse.payload);
      commentPayload.id = responseCommentJson.data.addedComment.id;
    });

    it('should throw error 401 when if not contain access token', async () => {
      const threadId = threadPayload.id;
      const commentId = commentPayload.id;

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });
      const result = await CommentsTableTestHelper.getCommentById(commentId);
      expect(response.statusCode).toEqual(401);
      expect(result[0].is_delete).toEqual(false);
    });

    it('should response 200 and delete comment correctly', async () => {
      const threadId = threadPayload.id;
      const commentId = commentPayload.id;

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });
      const result = await CommentsTableTestHelper.getCommentById(commentId);
      expect(response.statusCode).toEqual(200);
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe('endpoint /threads/{threadId} or detail thread with comments', () => {
    const threadPayload = {
      title: 'Title Thread',
      body: 'description thread',
    };
    const commentPayload = {
      content: 'Description content',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: threadPayload,
      });

      const responseJson = JSON.parse(threadResponse.payload);
      threadPayload.id = responseJson.data.addedThread.id;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: commentPayload,
      });

      const responseCommentJson = JSON.parse(commentResponse.payload);
      commentPayload.id = responseCommentJson.data.addedComment.id;
    });

    it('should response 200 and get detail thread', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadPayload.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.username).toEqual('ghazi');
    });
  });
});
