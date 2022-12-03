/* eslint-disable no-undef */
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'ini adalah sebuah thread',
    };
    const expectedThread = new AddedThread({
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository(useCasePayload);

    // Mocking needed function
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const newThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(newThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread(useCasePayload),
    );
  });
});
