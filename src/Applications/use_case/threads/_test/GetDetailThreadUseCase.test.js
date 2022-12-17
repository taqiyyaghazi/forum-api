/* eslint-disable no-undef */
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const GetThread = require('../../../../Domains/threads/entities/GetThread');
const GetComment = require('../../../../Domains/comments/entities/GetComment');
const GetReply = require('../../../../Domains/replies/entities/GetReply');

describe('GetDetailThreadUseCase interface', () => {
  it('should orchestrating the get detail thread correctly', async () => {
    const threadId = 'thread-123';
    const firstCommentId = 'comment-12332323';
    const secondCommentId = 'comment-12523232';
    const firstReplyId = 'reply-12332323';
    const secondReplyId = 'reply-12523232';
    const expectedDetailThread = {
      id: threadId,
      username: 'ghazi',
      title: 'Judul',
      body: 'Body thread',
      date: '2021-01-01',
      comments: [
        {
          id: firstCommentId,
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          replies: [
            {
              id: firstReplyId,
              username: 'johndoe',
              date: '2021-08-08T07:22:33.555Z',
              content: 'sebuah reply',
            },
            {
              id: secondReplyId,
              username: 'dicoding',
              date: '2021-08-08T07:26:21.338Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: secondCommentId,
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: firstReplyId,
              username: 'johndoe',
              date: '2021-08-08T07:22:33.555Z',
              content: 'sebuah reply',
            },
            {
              id: secondReplyId,
              username: 'dicoding',
              date: '2021-08-08T07:26:21.338Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(
      new GetThread({
        id: threadId,
        title: 'Judul',
        body: 'Body thread',
        username: 'ghazi',
        date: '2021-01-01',
      }),
    ));

    mockCommentRepository.getCommentWithThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve([
        new GetComment({
          id: firstCommentId,
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          is_delete: false,
        }),
        new GetComment({
          id: secondCommentId,
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: 'content comment',
          is_delete: true,
        }),
      ]));

    mockReplyRepository.getReplyWithComment = jest.fn().mockImplementation(() => Promise.resolve([
      new GetReply({
        id: firstReplyId,
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah reply',
        is_delete: false,
      }),
      new GetReply({
        id: secondReplyId,
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'content reply',
        is_delete: true,
      }),
    ]));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threads = await getDetailThreadUseCase.execute(threadId);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentWithThread).toBeCalledWith(threadId);
    expect(mockReplyRepository.getReplyWithComment).toBeCalledWith(firstCommentId);
    expect(mockReplyRepository.getReplyWithComment).toBeCalledWith(secondCommentId);

    expect(threads.id).toEqual(expectedDetailThread.id);
    expect(threads.username).toEqual(expectedDetailThread.username);
    expect(threads.title).toEqual(expectedDetailThread.title);
    expect(threads.body).toEqual(expectedDetailThread.body);
    expect(threads.date).toBeDefined();
    expect(threads.comments).toHaveLength(2);
    expect(threads.comments[0].replies).toHaveLength(2);
    expect(threads.comments[1].replies).toHaveLength(2);
    expect(threads).toEqual(expectedDetailThread);
    expect(threads.comments[0]).toHaveProperty('id');
    expect(threads.comments[0]).toHaveProperty('username');
    expect(threads.comments[0]).toHaveProperty('date');
    expect(threads.comments[0]).toHaveProperty('content');
  });
});
