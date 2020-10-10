const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:postId/comments', (req, res) => {
  res.send(commentsByPostId[req.params.postId] || []);
});

app.post('/posts/:postId/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.postId] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.postId
    }
  });

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
