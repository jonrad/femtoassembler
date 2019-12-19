'use strict';
const request = require('request');
const express = require('express');
const memory = require('./libs/memory')
const instructions = require('./libs/instructions')

var send = function(url, body) {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'post',
      body: body,
      json: true,
      url: url
    }

    request.post(options, (e, response, body) => {
      resolve(body);
    })
  });
}

async function execute(input) {
  var memoryId = (await memory.create()).id;

  var values = await send("http://assembler", { content: input });

  var promises = values
    .map(function(x, i) { return memory.store(memoryId, i, x); });

  await Promise.all(promises);

  await send(`http://cpu/${memoryId}`);

  var results = [];
  for (var i = memory.length - 24; i < memory.length; i++) {
    results.push(await memory.load(memoryId, i));
  }

  return results;
}


// Constants
const PORT = 80;
const HOST = '0.0.0.0';

const app = express();
app.use(express.json())
app.post('/asm', async (req, res, next) => {
  var content = req.body.content;
  var result = await execute(content);
  res.json({ result: result });
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);
