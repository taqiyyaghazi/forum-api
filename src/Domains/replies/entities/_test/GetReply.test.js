/* eslint-disable no-undef */
const GetReply = require('../GetReply');

describe('GetReply entities', () => {
  it('should throw error not contain property', () => {
    const payload = {
      id: 'reply-123',
    };

    expect(() => new GetReply(payload)).toThrowError(
      'GET_REPLY.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error not meet data spesification', () => {
    const payload = {
      id: 'reply-123',
      date: true,
      username: 123,
      content: ['123', true],
    };

    expect(() => new GetReply(payload)).toThrowError(
      'GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should not throw error', () => {
    const payload = {
      id: 'reply-123',
      content: 'lorem ipsum',
      username: 'ghazi',
      date: '2021-02-10',
      is_delete: true,
    };
    const getReply = new GetReply(payload);
    expect(getReply.id).toStrictEqual(payload.id);
    expect(getReply.username).toStrictEqual(payload.username);
    expect(getReply.date).toStrictEqual(payload.date);
    expect(getReply.content).toStrictEqual(payload.content);
  });
});
