
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var memFrom = await memory.load(id, ++state.ip);
        state.gpr[0] = instructions.checkOperation(state, state.gpr[0] * await memory.load(id, memFrom));
        state.ip++;
        
  return true;
};

instructions.buildApp(computeState);
