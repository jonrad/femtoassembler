
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var number = await memory.load(id, ++state.ip);
        if (state.carry) {
          instructions.jump(state, number);
        } else {
          state.ip++;
        }
        
  return true;
};

instructions.buildApp(computeState);
