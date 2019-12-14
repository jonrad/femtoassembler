const memory = require('./memory');
const express = require('express');

var maxSP = 231;
var minSP = 0;

var instructions = {
  jump: function(state, newIP) {
    if (newIP < 0 || newIP >= memory.length) {
      throw "IP outside memory";
    } else {
      state.ip = newIP;
    }
  },

  checkGPR: function(state, reg) {
    if (reg < 0 || reg >= state.gpr.length) {
      throw "Invalid register: " + reg;
    } else {
      return reg;
    }
  },

  checkGPR_SP: function(state, reg) {
    if (reg < 0 || reg >= 1 + state.gpr.length) {
      throw "Invalid register: " + reg;
    } else {
      return reg;
    }
  },

  setGPR_SP: function(state, reg,value)
  {
    if(reg >= 0 && reg < state.gpr.length) {
      state.gpr[reg] = value;
    } else if(reg == state.gpr.length) {
      state.sp = value;

      // Not likely to happen, since we always get here after checkOpertion().
      if (state.sp < minSP) {
        throw "Stack overflow";
      } else if (state.sp > maxSP) {
        throw "Stack underflow";
      }
    } else {
      throw "Invalid register: " + reg;
    }
  },

  getGPR_SP: function(state, reg)
  {
    if(reg >= 0 && reg < state.gpr.length) {
      return state.gpr[reg];
    } else if(reg == state.gpr.length) {
      return state.sp;
    } else {
      throw "Invalid register: " + reg;
    }
  },

  indirectRegisterAddress: function(state, value) {
    var reg = value % 8;

    var base;
    if (reg < state.gpr.length) {
      base = state.gpr[reg];
    } else {
      base = state.sp;
    }

    var offset = Math.floor(value / 8);
    if ( offset > 15 ) {
      offset = offset - 32;
    }

    return base+offset;
  },

  checkOperation: function(state, value) {
    state.zero = false;
    state.carry = false;

    if (value >= 256) {
      state.carry = true;
      value = value % 256;
    } else if (value === 0) {
      state.zero = true;
    } else if (value < 0) {
      state.carry = true;
      value = 256 - (-value) % 256;
    }

    return value;
  },

  push: async function(id, state, value) {
    await memory.store(id, state.sp--, value);
    if (state.sp < minSP) {
      throw "Stack overflow";
    }
  },

  pop: async function(id, state) {
    var value = await memory.load(id, ++state.sp);
    if (state.sp > maxSP) {
      throw "Stack underflow";
    }

    return value;
  },

  division: function(state, divisor) {
    if (divisor === 0) {
      throw "Division by 0";
    }

    return Math.floor(state.gpr[0] / divisor);
  },

  buildApp: function(func) {
    const app = express();
    app.use(express.json())
    app.post('/:id', async (req, res, next) => {
      var id = req.params['id'];
      var state = req.body;
      console.log("memory " + id + " at ip " + state.ip);
      var succeed = await func(id, state);
      res.json({ state: state, succeed: succeed });
    });

    app.listen(80, "0.0.0.0");

    console.log("Started");
  }
};


module.exports = instructions;

