/* eslint-disable no-undef */
// Layer Infrastructures
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
// DB
const pool = require('../../database/postgres/pool');
// Layer Domains
const AddedCommentLike = require('../../../Domains/commentLikes/entities/AddedCommentLike');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentLike = require('../../../Domains/commentLikes/entities/CommentLike');
const DeletedComment = require('../../../Domains/comments/entities/DeletedComment');
// Layer Commons / Handle error
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
// test
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');

describe('CommentLikeRepositoryPostgres interface', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTableCommentLikes();
    await CommentsTableTestHelper.cleanTableComment();
    await ThreadsTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentLike function', () => {
    it('should persist add comment like and return added comment like correctly', async () => {
      //   Arrange
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      };
      const { commentId, threadId, owner } = { ...payload };
      const commentLike = new CommentLike({ commentId, threadId, owner });

      const fakeIdGenerator = () => '123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner,
        title: 'Title thread',
        body: 'Content body thread',
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'ini adalah komen',
        threadId,
        owner,
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      const addedCommentLike = await commentLikeRepositoryPostgres.addCommentLike(commentLike);
      const newCommentLike = await CommentLikesTableTestHelper.getCommentLikeById(
        'comment-like-123',
      );

      expect(addedCommentLike).toStrictEqual(
        new AddedCommentLike({
          id: 'comment-like-123',
          commentId: newCommentLike[0].comment_id,
          threadId: newCommentLike[0].thread_id,
          owner: newCommentLike[0].owner,
        }),
      );
      expect(newCommentLike).toHaveLength(1);
      expect(newCommentLike[0].is_like).toStrictEqual(true);
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should return true when commentLikeId found', async () => {
      const currentDate = new Date().toISOString();
      const fakeIdGenerator = () => '234';
      const payload = {
        threadId: 'thread-234',
        commentId: 'comment-234',
        owner: 'user-234',
      };
      const { commentId, threadId, owner } = { ...payload };
      const commentLike = new CommentLike({ commentId, threadId, owner });

      await UsersTableTestHelper.addUser({
        id: owner,
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner,
        currentDate,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner,
        currentDate,
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-234',
        commentId,
        threadId,
        owner,
      });
      expect(
        await commentLikeRepositoryPostgres.verifyAvailableCommentLike(
          commentLike,
        ),
      ).toStrictEqual(true);
    });

    it('should return false when commentLikeId not found', async () => {
      const payload = {
        threadId: 'thread-543',
        commentId: 'comment-543',
        owner: 'user-543',
      };
      const commentLike = new CommentLike(payload);
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {},
      );
      expect(
        await commentLikeRepositoryPostgres.verifyAvailableCommentLike(
          commentLike,
        ),
      ).toStrictEqual(false);
    });
  });

  describe('getIsLikeComment function', () => {
    it('should return isLike from a comment', async () => {
      //   Arrange
      const payload = {
        threadId: 'thread-345',
        commentId: 'comment-345',
        owner: 'user-345',
      };
      const { commentId, threadId, owner } = { ...payload };
      const commentLike = new CommentLike({ commentId, threadId, owner });

      const fakeIdGenerator = () => '345';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner,
        title: 'Title thread',
        body: 'Content body thread',
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'ini adalah komen',
        threadId,
        owner,
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-345',
        commentId,
        threadId,
        owner,
      });

      const isLikeComment = await commentLikeRepositoryPostgres.getIsLikeComment(commentLike);

      expect(isLikeComment).toBeDefined();
      expect(isLikeComment).toStrictEqual(true);
    });
  });

  describe('putIsLikeComment function', () => {
    it('should return isLike equal to false when put function success', async () => {
      //   Arrange
      const payload = {
        threadId: 'thread-456',
        commentId: 'comment-456',
        owner: 'user-456',
      };
      const { commentId, threadId, owner } = { ...payload };

      const fakeIdGenerator = () => '456';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner,
        title: 'Title thread',
        body: 'Content body thread',
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'ini adalah komen',
        threadId,
        owner,
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-456',
        commentId,
        threadId,
        owner,
      });
      const isLikeComment = await commentLikeRepositoryPostgres.putIsLikeComment({
        commentId,
        threadId,
        owner,
        isLike: false,
      });

      expect(isLikeComment).toBeDefined();
      expect(isLikeComment).toStrictEqual(false);
    });
  });

  describe('getCommentLikeCount function', () => {
    it('should return like count from comment by comment id', async () => {
      //   Arrange
      const userId = 'user-567';
      const threadId = 'thread-567';
      const commentId = 'comment-567';
      const userIdOne = 'user-678';
      const userIdTwo = 'user-789';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {},
      );

      await UsersTableTestHelper.addUser({ id: userId, username: 'cobasatu' });
      await UsersTableTestHelper.addUser({ id: userIdOne, username: 'cobadua' });
      await UsersTableTestHelper.addUser({ id: userIdTwo, username: 'cobatiga' });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
        title: 'Title thread',
        body: 'Content body thread',
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'ini adalah komen',
        threadId,
        owner: userId,
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-567',
        commentId,
        threadId,
        owner: userId,
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-678',
        commentId,
        threadId,
        owner: userIdOne,
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-789',
        commentId,
        threadId,
        owner: userIdTwo,
      });

      const commentLikeCount = await commentLikeRepositoryPostgres.getCommentLikeCount(
        'comment-567',
      );

      expect(commentLikeCount).toBeDefined();
      expect(commentLikeCount).toStrictEqual(3);
    });

    it('should return correctly when user dislike comment', async () => {
      const userId = 'user-567';
      const threadId = 'thread-567';
      const commentId = 'comment-567';
      const userIdOne = 'user-678';
      const userIdTwo = 'user-789';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {},
      );

      await UsersTableTestHelper.addUser({ id: userId, username: 'cobasatu' });
      await UsersTableTestHelper.addUser({ id: userIdOne, username: 'cobadua' });
      await UsersTableTestHelper.addUser({ id: userIdTwo, username: 'cobatiga' });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
        title: 'Title thread',
        body: 'Content body thread',
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'ini adalah komen',
        threadId,
        owner: userId,
        currentDate: '2023-01-14T04:51:21.510Z',
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-567',
        commentId,
        threadId,
        owner: userId,
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-678',
        commentId,
        threadId,
        owner: userIdOne,
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-789',
        commentId,
        threadId,
        owner: userIdTwo,
      });

      await CommentLikesTableTestHelper.putCommentLikeById({ isLike: false, id: 'comment-like-789' });

      const commentLikeCount = await commentLikeRepositoryPostgres.getCommentLikeCount(
        'comment-567',
      );

      expect(commentLikeCount).toBeDefined();
      expect(commentLikeCount).toStrictEqual(2);
    });
  });
});
