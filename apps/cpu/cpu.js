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
  step: async function(memoryId, state) {

    if (state.fault === true) {
      throw "FAULT. Reset to continue.";
    }

    try {
      if (state.ip < 0 || state.ip >= memory.length) {
        throw "Instruction pointer is outside of memory";
      }

      var instr = await memory.load(memoryId, state.ip);
      console.log("Address " + state.ip + ", Instr: " + instructions.opcodeToName[instr])
      var instruction = instructions.opcodeToName[instr];
      var result = await sendInstruction(memoryId, instruction, state);
      if (result) {
        return {
          moreInstructions: result.succeed,
          state: result.state
        };
      } else {
        return {
          moreInstructions: false,
          state: state
        };
      }
    } catch(e) {
      throw e;
    }
  },

  reset: function() {
    var self = this;
    self.maxSP = 231;
    self.minSP = 0;

    return {
      gpr: [0, 0, 0, 0],
      sp: self.maxSP,
      ip: 0,
      zero: false,
      carry: false,
      fault: false
    };
  },

  run: async function execute(memoryId) {
    var self = this;
    var state = self.reset();

    var moreInstructions = true;
    while (moreInstructions) {
      var result = await cpu.step(memoryId, state);
      var state = result.state;
      moreInstructions = result.moreInstructions;
    }
  }
};

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json())
app.post('/:id', async (req, res, next) => {
  var id = req.params['id'];
  await cpu.run(id);
  res.json();
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);

