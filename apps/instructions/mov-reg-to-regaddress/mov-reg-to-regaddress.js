
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var regTo = await memory.load(id, ++state.ip);
        var regFrom = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        await memory.store(id, instructions.indirectRegisterAddress(state, regTo), instructions.getGPR_SP(state, regFrom));
        state.ip++;
        
  return true;
};

instructions.buildApp(computeState);
