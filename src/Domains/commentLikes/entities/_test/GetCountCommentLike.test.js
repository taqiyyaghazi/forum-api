/* eslint-disable no-undef */
const GetCountCommentLike = require('../GetCountCommentLike');

describe('GetCountCommentLike entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    expect(() => new GetCountCommentLike(payload)).toThrowError(
      'COMMENT_LIKE.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when paylod not meet data specification', () => {
    const payload = {
      likeCount: true,
    };

    expect(() => new GetCountCommentLike(payload)).toThrowError(
      'COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should correctly', () => {
    const payload = {
      likeCount: 54,
    };

    const getCountCommentLike = new GetCountCommentLike(payload);

    expect(getCountCommentLike.id).toEqual(payload.id);
  });
});
