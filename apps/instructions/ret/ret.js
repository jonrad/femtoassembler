
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
        instructions.jump(state, await instructions.pop(id, state));
        
  return true;
};

instructions.buildApp(computeState);
