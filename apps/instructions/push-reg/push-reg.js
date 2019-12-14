
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        await instructions.push(id, state, state.gpr[regFrom]);
        state.ip++;
        
  return true;
};

instructions.buildApp(computeState);
