/* eslint-disable no-undef */
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const GetThread = require('../../../../Domains/threads/entities/GetThread');

describe('GetDetailThreadUseCase interface', () => {
  it('should orchestrating the get detail thread correctly', async () => {
    const threadId = 'thread-123';
    const expectedDetailThread = {
      id: threadId,
      title: 'Judul',
      body: 'Body thread',
      username: 'ghazi',
      date: '2021-01-01',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const expectedComment = [
      {
        id: 'comment-12332323',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-12523232',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'content comment',
        is_delete: true,
      },
    ];

    const expectedReply = [
      {
        id: 'reply-12332323',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah reply',
        is_delete: false,
      },
      {
        id: 'reply-12523232',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'content reply',
        is_delete: true,
      },
    ];

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new GetThread(expectedDetailThread)));

    mockCommentRepository.getCommentWithThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    mockReplyRepository.getReplyWithComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedReply));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threads = await getDetailThreadUseCase.execute(threadId);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentWithThread).toBeCalledWith(threadId);

    expect(threads.id).toEqual(expectedDetailThread.id);
    expect(threads.username).toEqual(expectedDetailThread.username);
    expect(threads.title).toEqual(expectedDetailThread.title);
    expect(threads.body).toEqual(expectedDetailThread.body);
    expect(threads.date).toBeDefined();
    expect(threads.comments).toHaveLength(2);
    expect(threads.comments[0].replies).toHaveLength(2);
    expect(threads.comments[1].replies).toHaveLength(2);
    expect(threads).toEqual({
      id: 'thread-123',
      username: 'ghazi',
      title: 'Judul',
      body: 'Body thread',
      date: '2021-01-01',
      comments: [
        {
          id: 'comment-12332323',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          replies: [
            {
              id: 'reply-12332323',
              username: 'johndoe',
              date: '2021-08-08T07:22:33.555Z',
              content: 'sebuah reply',
            },
            {
              id: 'reply-12523232',
              username: 'dicoding',
              date: '2021-08-08T07:26:21.338Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-12523232',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: 'reply-12332323',
              username: 'johndoe',
              date: '2021-08-08T07:22:33.555Z',
              content: 'sebuah reply',
            },
            {
              id: 'reply-12523232',
              username: 'dicoding',
              date: '2021-08-08T07:26:21.338Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
      ],
    });

    expect(threads.comments[0]).toHaveProperty('id');
    expect(threads.comments[0]).toHaveProperty('username');
    expect(threads.comments[0]).toHaveProperty('date');
    expect(threads.comments[0]).toHaveProperty('content');
  });
});
