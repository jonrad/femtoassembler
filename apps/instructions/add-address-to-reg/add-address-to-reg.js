
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var memFrom = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) + await memory.load(id, memFrom)));
        state.ip++;
        
  return true;
};

instructions.buildApp(computeState);
