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
  var output = (await send("http://executor/asm", {content: input})).result;
  console.log(output.map(dec => {
    var hex = dec.toString(16)
    if (hex.length == 1) {
      return '0' + hex;
    } else {
      return hex;
    }
  }));
}

const filename = process.argv[2];
const input = fs.readFileSync(filename, 'utf8');
run(input);

