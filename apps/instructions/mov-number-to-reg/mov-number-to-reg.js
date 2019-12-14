
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,number);
        state.ip++;
        
  return true;
};

instructions.buildApp(computeState);
