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

var sendInstruction = function(memoryId, instruction, state) {
  var url = 'http://' + instruction + '.instruction:80/' + memoryId;
  return send(url, state);
}

var cpu = {
  step: async function(memoryId) {
    var self = this;

    if (self.state.fault === true) {
      throw "FAULT. Reset to continue.";
    }

    try {
      if (self.state.ip < 0 || self.state.ip >= memory.length) {
        throw "Instruction pointer is outside of memory";
      }

      var instr = await memory.load(memoryId, self.state.ip);
      console.log("Address " + self.state.ip + ", Instr: " + instructions.opcodeToName[instr])
      var instruction = instructions.opcodeToName[instr];
      var result = await sendInstruction(memoryId, instruction, self.state);
      if (result) {
        self.state = result.state;
        return result.succeed;
      } else {
        return false;
      }
    } catch(e) {
      self.state.fault = true;
      throw e;
    }
  },

  reset: function() {
    var self = this;
    self.maxSP = 231;
    self.minSP = 0;

    self.state = {
      gpr: [0, 0, 0, 0],
      sp: self.maxSP,
      ip: 0,
      zero: false,
      carry: false,
      fault: false
    };
  }
};

  var input = `
; Simple example
; Writes Hello World to the output

  JMP start
hello: DB "Hello World!" ; Variable
       DB 0	; String terminator

start:
  MOV C, hello    ; Point to var 
  MOV D, 232	; Point to output
  CALL print
        HLT             ; Stop execution

print:			; print(C:*from, D:*to)
  PUSH A
  PUSH B
  MOV B, 0
.loop:
  MOV A, [C]	; Get char from var
  MOV [D], A	; Write to output
  INC C
  INC D  
  CMP B, [C]	; Check if end
  JNZ .loop	; jump if not

  POP B
  POP A
  RET
`;

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
