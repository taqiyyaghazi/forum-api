/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const addThread = async ({
  id = 'thread-123',
  title = 'lorem ipsum',
  body = 'description lorep',
  owner = 'user-124',
}) => {
  const date = new Date().toISOString();
  const query = {
    text: 'INSERT INTO threads VALUES ($1,$2,$3,$4,$5) returning date',
    values: [id, title, body, owner, date],
  };

  const result = await pool.query(query);
  return result;
};

const getThreadById = async (id) => {
  const query = {
    text: 'SELECT * FROM threads WHERE id=$1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows;
};

const cleanTableThread = async () => {
  await pool.query('DELETE FROM threads WHERE 1=1');
};

const ThreadsTableTestHelper = {
  addThread,
  getThreadById,
  cleanTableThread,
};

module.exports = ThreadsTableTestHelper;
