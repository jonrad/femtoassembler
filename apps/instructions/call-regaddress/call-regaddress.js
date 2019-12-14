
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        await instructions.push(id, state, state.ip+1);
        instructions.jump(state, state.gpr[regTo]);
        
  return true;
};

instructions.buildApp(computeState);
