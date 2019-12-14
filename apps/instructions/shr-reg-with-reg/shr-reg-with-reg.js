
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] >>> state.gpr[regFrom]);
        state.ip++;
        
  return true;
};

instructions.buildApp(computeState);
