
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var number = await memory.load(id, ++state.ip);
        state.gpr[0] = instructions.checkOperation(state, state.gpr[0] * number);
        state.ip++;
        
  return true;
};

instructions.buildApp(computeState);
