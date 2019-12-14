
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[regTo] = await instructions.pop(id, state);
        state.ip++;
        
  return true;
};

instructions.buildApp(computeState);
