'use strict';
const request = require('request');
const fs = require('fs');

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

async function run(input) {
  var result = await send("http://executor/asm", { content: input });
  console.log(result);

}

const filename = process.argv[2];
const input = fs.readFileSync(filename, 'utf8');
run(input);
