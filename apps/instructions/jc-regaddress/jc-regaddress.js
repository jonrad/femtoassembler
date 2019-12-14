
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        if (state.carry) {
          instructions.jump(state, state.gpr[regTo]);
        } else {
          state.ip++;
        }
        
  return true;
};

instructions.buildApp(computeState);
