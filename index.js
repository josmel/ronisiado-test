import express from 'express';
import postgresql from './connect.js';
const app = express();
const port = 3100;

postgresql(async (connection) => {
  await connection.query('CREATE TABLE IF NOT EXISTS books (id bigserial primary key, title text, author text);');
  await connection.query('CREATE UNIQUE INDEX IF NOT EXISTS title ON books (title);');

  const books = [
    { title: 'Mastering the Lightning Network', author: 'Andreas Antonopoulos' },
    { title: 'Load Balancing with HAProxy', author: 'Nick Ramirez' },
    { title: 'Silent Weapons for Quiet Wars', author: 'Unknown' },
  ];

  for (let i = 0; i < books.length; i += 1) {
    const book = books[i];
    await connection.query(`INSERT INTO books (title, author) VALUES ('${book.title}', '${book.author}') ON CONFLICT DO NOTHING;`);
  }

  console.log('PostgreSQL database seeded!');
});

app.get('/', (req, res) => res.send('Welcome!'));

app.get('/test-connect', async (req, res) => {
  const rows = await process.postgresql.query('SELECT * FROM books');;
console.log(rows);
  res.status(200).send(JSON.stringify(rows));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
