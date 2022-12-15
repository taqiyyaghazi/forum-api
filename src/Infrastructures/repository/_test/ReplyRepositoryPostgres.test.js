/* eslint-disable no-undef */
// Layer Infrastructures
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
// DB
const pool = require('../../database/postgres/pool');
// Layer Domains
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const DeletedReply = require('../../../Domains/replies/entities/DeletedReply');
// Layer Commons / Handle error
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
// test
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres interface', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTableReply();
    await CommentsTableTestHelper.cleanTableComment();
    await ThreadsTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add comment and return added reply correctly', async () => {
      //   Arrange
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'lorem ipsum ',
        owner: 'user-123',
      };

      const {
        content, threadId, commentId, owner,
      } = payload;
      const newReply = new NewReply({
        content, threadId, commentId, owner,
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'Title thread',
        body: 'Content body thread',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'lorem ipsum',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const addedReply = await replyRepositoryPostgres.addReply(
        newReply,
      );
      const reply = await RepliesTableTestHelper.getReplyById(
        'reply-123',
      );
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: newReply.content,
          threadId: newReply.threadId,
          commentId: newReply.commentId,
          owner: newReply.owner,
        }),
      );
      expect(reply).toHaveLength(1);
      expect(reply[0].content).toBe(payload.content);
    });
  });

  describe('verifyAvailableReply function', () => {
    it('should throw NotFoundError when replyId not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyAvailableReply('reply-125'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when replyId found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-125',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyAvailableReply('reply-125'),
      ).resolves.not.toThrowError();
    });
  });

  describe('verifyOwnerReply function', () => {
    it('should throw NotFoundError when replyId not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyOwnerReply({
          owner: 'user-123',
          replyId: 'reply-123',
        }),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError when replyId found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-125',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(
        replyRepositoryPostgres.verifyOwnerReply({
          owner: 'user-123',
          replyId: 'reply-125',
        }),
      ).resolves.not.toThrowError();
    });
  });

  describe('deleteReply function', () => {
    it('should not throw error and success soft delete', async () => {
      const payload = {
        replyId: 'reply-125',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-xxxx',
      };

      const deleteReply = new DeletedReply(payload);
      await UsersTableTestHelper.addUser({
        id: 'user-xxx',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-xxx',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-xxx',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-125',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-xxx',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await replyRepositoryPostgres.deleteReply(deleteReply);
      const deletedReply = await RepliesTableTestHelper.getReplyById(
        'reply-125',
      );
      expect(deletedReply[0]).toBeDefined();
      expect(deletedReply[0].id).toEqual('reply-125');
      expect(deletedReply[0].date).toBeDefined();
      expect(deletedReply[0].is_delete).toEqual(true);
    });
  });

  describe('getReplyWithComment function', () => {
    it('should return comment with reply correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-xxx',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-yyyy',
        owner: 'user-xxx',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-zzz',
        threadId: 'thread-yyyy',
        owner: 'user-xxx',
        content: 'lorem ipsum',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-yyy',
        threadId: 'thread-yyyy',
        commentId: 'comment-zzz',
        owner: 'user-xxx',
        content: 'lorem ipsum',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replies = await replyRepositoryPostgres.getReplyWithComment(
        'comment-zzz',
      );

      expect(replies).toHaveLength(1);
      expect(replies[0]).toHaveProperty('id');
      expect(replies[0]).toHaveProperty('username');
      expect(replies[0]).toHaveProperty('date');
      expect(replies[0].id).toEqual('reply-yyy');
      expect(replies[0]).toHaveProperty('username');
      expect(replies[0].username).toEqual('dicoding');
      expect(replies[0].date).toBeDefined();
      expect(replies[0].content).toEqual('lorem ipsum');
      expect(replies[0].is_delete).toEqual(false);
    });
  });
});
