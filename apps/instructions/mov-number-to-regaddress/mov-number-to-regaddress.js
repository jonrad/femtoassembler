
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var regTo = await memory.load(id, ++state.ip);
        var number = await memory.load(id, ++state.ip);
        await memory.store(id, instructions.indirectRegisterAddress(state, regTo), number);
        state.ip++;
        
  return true;
};

instructions.buildApp(computeState);
