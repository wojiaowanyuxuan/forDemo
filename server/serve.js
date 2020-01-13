const express = require('express');
const cors = require('cors');
const bodyParse = require('body-parser');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  maxAge: 172800
}));

app.use(bodyParse.json());

app.post('/queryCount', (req, res) => {
  const { count } = req.body;
  
  if (count <= 30) {
    res.send({
      success: true,
      errMsg: '',
    });
  } else {
    res.send({
      success: false,
      errMsg: '超过最大限制30'
    });
  }
});

app.listen('8080', () => {
  console.log('服务器启动');
})