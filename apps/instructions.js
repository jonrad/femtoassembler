const memory = require('./memory');
const express = require('express');

var maxSP = 231;
var minSP = 0;

var opcodes = {
  NONE: 0,
  MOV_REG_TO_REG: 1,
  MOV_ADDRESS_TO_REG: 2,
  MOV_REGADDRESS_TO_REG: 3,
  MOV_REG_TO_ADDRESS: 4,
  MOV_REG_TO_REGADDRESS: 5,
  MOV_NUMBER_TO_REG: 6,
  MOV_NUMBER_TO_ADDRESS: 7,
  MOV_NUMBER_TO_REGADDRESS: 8,
  ADD_REG_TO_REG: 10,
  ADD_REGADDRESS_TO_REG: 11,
  ADD_ADDRESS_TO_REG: 12,
  ADD_NUMBER_TO_REG: 13,
  SUB_REG_FROM_REG: 14,
  SUB_REGADDRESS_FROM_REG: 15,
  SUB_ADDRESS_FROM_REG: 16,
  SUB_NUMBER_FROM_REG: 17,
  INC_REG: 18,
  DEC_REG: 19,
  CMP_REG_WITH_REG: 20,
  CMP_REGADDRESS_WITH_REG: 21,
  CMP_ADDRESS_WITH_REG: 22,
  CMP_NUMBER_WITH_REG: 23,
  JMP_REGADDRESS: 30,
  JMP_ADDRESS: 31,
  JC_REGADDRESS: 32,
  JC_ADDRESS: 33,
  JNC_REGADDRESS: 34,
  JNC_ADDRESS: 35,
  JZ_REGADDRESS: 36,
  JZ_ADDRESS: 37,
  JNZ_REGADDRESS: 38,
  JNZ_ADDRESS: 39,
  JA_REGADDRESS: 40,
  JA_ADDRESS: 41,
  JNA_REGADDRESS: 42,
  JNA_ADDRESS: 43,
  PUSH_REG: 50,
  PUSH_REGADDRESS: 51,
  PUSH_ADDRESS: 52,
  PUSH_NUMBER: 53,
  POP_REG: 54,
  CALL_REGADDRESS: 55,
  CALL_ADDRESS: 56,
  RET: 57,
  MUL_REG: 60,
  MUL_REGADDRESS: 61,
  MUL_ADDRESS: 62,
  MUL_NUMBER: 63,
  DIV_REG: 64,
  DIV_REGADDRESS: 65,
  DIV_ADDRESS: 66,
  DIV_NUMBER: 67,
  AND_REG_WITH_REG: 70,
  AND_REGADDRESS_WITH_REG: 71,
  AND_ADDRESS_WITH_REG: 72,
  AND_NUMBER_WITH_REG: 73,
  OR_REG_WITH_REG: 74,
  OR_REGADDRESS_WITH_REG: 75,
  OR_ADDRESS_WITH_REG: 76,
  OR_NUMBER_WITH_REG: 77,
  XOR_REG_WITH_REG: 78,
  XOR_REGADDRESS_WITH_REG: 79,
  XOR_ADDRESS_WITH_REG: 80,
  XOR_NUMBER_WITH_REG: 81,
  NOT_REG: 82,
  SHL_REG_WITH_REG: 90,
  SHL_REGADDRESS_WITH_REG: 91,
  SHL_ADDRESS_WITH_REG: 92,
  SHL_NUMBER_WITH_REG: 93,
  SHR_REG_WITH_REG: 94,
  SHR_REGADDRESS_WITH_REG: 95,
  SHR_ADDRESS_WITH_REG: 96,
  SHR_NUMBER_WITH_REG: 97
};

var cpu = {
  computeState: async function(id, instr, state) {
    switch(instr) {
      case opcodes.NONE:
        // Abort step
        return false;
        break;
      case opcodes.MOV_REG_TO_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        instructions.setGPR_SP(state, regTo,instructions.getGPR_SP(state, regFrom));
        state.ip++;
        break;
      case opcodes.MOV_ADDRESS_TO_REG:
        var number = await memory.load(id, ++state.ip);
        instructions.jump(state, number);
        break;
      case opcodes.MOV_REGADDRESS_TO_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var regFrom = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,await memory.load(id, instructions.indirectRegisterAddress(state, regFrom)));
        state.ip++;
        break;
      case opcodes.MOV_REG_TO_ADDRESS:
        var memTo = await memory.load(id, ++state.ip);
        var regFrom = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        await memory.store(id, memTo, instructions.getGPR_SP(state, regFrom));
        state.ip++;
        break;
      case opcodes.MOV_REG_TO_REGADDRESS:
        var regTo = await memory.load(id, ++state.ip);
        var regFrom = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        await memory.store(id, instructions.indirectRegisterAddress(state, regTo), instructions.getGPR_SP(state, regFrom));
        state.ip++;
        break;
      case opcodes.MOV_NUMBER_TO_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,number);
        state.ip++;
        break;
      case opcodes.MOV_NUMBER_TO_ADDRESS:
        var memTo = await memory.load(id, ++state.ip);
        var number = await memory.load(id, ++state.ip);
        await memory.store(id, memTo, number);
        state.ip++;
        break;
      case opcodes.MOV_NUMBER_TO_REGADDRESS:
        var regTo = await memory.load(id, ++state.ip);
        var number = await memory.load(id, ++state.ip);
        await memory.store(id, instructions.indirectRegisterAddress(state, regTo), number);
        state.ip++;
        break;
      case opcodes.ADD_REG_TO_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) + instructions.getGPR_SP(state, regFrom)));
        state.ip++;
        break;
      case opcodes.ADD_REGADDRESS_TO_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var regFrom = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) + await memory.load(id, instructions.indirectRegisterAddress(state, regFrom))));
        state.ip++;
        break;
      case opcodes.ADD_ADDRESS_TO_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var memFrom = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) + await memory.load(id, memFrom)));
        state.ip++;
        break;
      case opcodes.ADD_NUMBER_TO_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) + number));
        state.ip++;
        break;
      case opcodes.SUB_REG_FROM_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) - state.gpr[regFrom]));
        state.ip++;
        break;
      case opcodes.SUB_REGADDRESS_FROM_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var regFrom = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) - await memory.load(id, instructions.indirectRegisterAddress(state, regFrom))));
        state.ip++;
        break;
      case opcodes.SUB_ADDRESS_FROM_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var memFrom = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) - await memory.load(id, memFrom)));
        state.ip++;
        break;
      case opcodes.SUB_NUMBER_FROM_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) - number));
        state.ip++;
        break;
      case opcodes.INC_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) + 1));
        state.ip++;
        break;
      case opcodes.DEC_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        instructions.setGPR_SP(state, regTo,instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) - 1));
        state.ip++;
        break;
      case opcodes.CMP_REG_WITH_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) - instructions.getGPR_SP(state, regFrom));
        state.ip++;
        break;
      case opcodes.CMP_REGADDRESS_WITH_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var regFrom = await memory.load(id, ++state.ip);
        instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) - await memory.load(id, instructions.indirectRegisterAddress(state, regFrom)));
        state.ip++;
        break;
      case opcodes.CMP_ADDRESS_WITH_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var memFrom = await memory.load(id, ++state.ip);
        instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) - await memory.load(id, memFrom));
        state.ip++;
        break;
      case opcodes.CMP_NUMBER_WITH_REG:
        var regTo = instructions.checkGPR_SP(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        instructions.checkOperation(state, instructions.getGPR_SP(state, regTo) - number);
        state.ip++;
        break;
      case opcodes.JMP_REGADDRESS:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        instructions.jump(state, state.gpr[regTo]);
        break;
      case opcodes.JMP_ADDRESS:
        var number = await memory.load(id, ++state.ip);
        instructions.jump(state, number);
        break;
      case opcodes.JC_REGADDRESS:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        if (state.carry) {
          instructions.jump(state, state.gpr[regTo]);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JC_ADDRESS:
        var number = await memory.load(id, ++state.ip);
        if (state.carry) {
          instructions.jump(state, number);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JNC_REGADDRESS:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        if (!state.carry) {
          instructions.jump(state, state.gpr[regTo]);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JNC_ADDRESS:
        var number = await memory.load(id, ++state.ip);
        if (!state.carry) {
          instructions.jump(state, number);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JZ_REGADDRESS:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        if (state.zero) {
          instructions.jump(state, state.gpr[regTo]);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JZ_ADDRESS:
        var number = await memory.load(id, ++state.ip);
        if (state.zero) {
          instructions.jump(state, number);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JNZ_REGADDRESS:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        if (!state.zero) {
          instructions.jump(state, state.gpr[regTo]);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JNZ_ADDRESS:
        var number = await memory.load(id, ++state.ip);
        if (!state.zero) {
          instructions.jump(state, number);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JA_REGADDRESS:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        if (!state.zero && !state.carry) {
          instructions.jump(state, state.gpr[regTo]);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JA_ADDRESS:
        var number = await memory.load(id, ++state.ip);
        if (!state.zero && !state.carry) {
          instructions.jump(state, number);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JNA_REGADDRESS: // JNA REG
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        if (state.zero || state.carry) {
          instructions.jump(state, state.gpr[regTo]);
        } else {
          state.ip++;
        }
        break;
      case opcodes.JNA_ADDRESS:
        var number = await memory.load(id, ++state.ip);
        if (state.zero || state.carry) {
          instructions.jump(state, number);
        } else {
          state.ip++;
        }
        break;
      case opcodes.PUSH_REG:
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        await instructions.push(id, state, state.gpr[regFrom]);
        state.ip++;
        break;
      case opcodes.PUSH_REGADDRESS:
        var regFrom = await memory.load(id, ++state.ip);
        await instructions.push(id, state, await memory.load(id, instructions.indirectRegisterAddress(state, regFrom)));
        state.ip++;
        break;
      case opcodes.PUSH_ADDRESS:
        var memFrom = await memory.load(id, ++state.ip);
        await instructions.push(id, state, await memory.load(id, memFrom));
        state.ip++;
        break;
      case opcodes.PUSH_NUMBER:
        var number = await memory.load(id, ++state.ip);
        await instructions.push(id, state, number);
        state.ip++;
        break;
      case opcodes.POP_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[regTo] = await instructions.pop(id, state);
        state.ip++;
        break;
      case opcodes.CALL_REGADDRESS:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        await instructions.push(id, state, state.ip+1);
        instructions.jump(state, state.gpr[regTo]);
        break;
      case opcodes.CALL_ADDRESS:
        var number = await memory.load(id, ++state.ip);
        await instructions.push(id, state, state.ip+1);
        instructions.jump(state, number);
        break;
      case opcodes.RET:
        instructions.jump(state, await instructions.pop(id, state));
        break;
      case opcodes.MUL_REG: // A = A * REG
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[0] = instructions.checkOperation(state, state.gpr[0] * state.gpr[regFrom]);
        state.ip++;
        break;
      case opcodes.MUL_REGADDRESS: // A = A * [REG]
        var regFrom = await memory.load(id, ++state.ip);
        state.gpr[0] = instructions.checkOperation(state, state.gpr[0] * await memory.load(id, instructions.indirectRegisterAddress(state, regFrom)));
        state.ip++;
        break;
      case opcodes.MUL_ADDRESS: // A = A * [NUMBER]
        var memFrom = await memory.load(id, ++state.ip);
        state.gpr[0] = instructions.checkOperation(state, state.gpr[0] * await memory.load(id, memFrom));
        state.ip++;
        break;
      case opcodes.MUL_NUMBER: // A = A * NUMBER
        var number = await memory.load(id, ++state.ip);
        state.gpr[0] = instructions.checkOperation(state, state.gpr[0] * number);
        state.ip++;
        break;
      case opcodes.DIV_REG: // A = A / REG
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[0] = instructions.checkOperation(state, instructions.division(state, state.gpr[regFrom]));
        state.ip++;
        break;
      case opcodes.DIV_REGADDRESS: // A = A / [REG]
        var regFrom = await memory.load(id, ++state.ip);
        state.gpr[0] = instructions.checkOperation(state, instructions.division(state, await memory.load(id, instructions.indirectRegisterAddress(state, regFrom))));
        state.ip++;
        break;
      case opcodes.DIV_ADDRESS: // A = A / [NUMBER]
        var memFrom = await memory.load(id, ++state.ip);
        state.gpr[0] = instructions.checkOperation(state, instructions.division(state, await memory.load(id, memFrom)));
        state.ip++;
        break;
      case opcodes.DIV_NUMBER: // A = A / NUMBER
        var number = await memory.load(id, ++state.ip);
        state.gpr[0] = instructions.checkOperation(state, instructions.division(state, number));
        state.ip++;
        break;
      case opcodes.AND_REG_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] & state.gpr[regFrom]);
        state.ip++;
        break;
      case opcodes.AND_REGADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] & await memory.load(id, instructions.indirectRegisterAddress(state, regFrom)));
        state.ip++;
        break;
      case opcodes.AND_ADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var memFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] & await memory.load(id, memFrom));
        state.ip++;
        break;
      case opcodes.AND_NUMBER_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] & number);
        state.ip++;
        break;
      case opcodes.OR_REG_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] | state.gpr[regFrom]);
        state.ip++;
        break;
      case opcodes.OR_REGADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] | await memory.load(id, instructions.indirectRegisterAddress(state, regFrom)));
        state.ip++;
        break;
      case opcodes.OR_ADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var memFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] | await memory.load(id, memFrom));
        state.ip++;
        break;
      case opcodes.OR_NUMBER_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] | number);
        state.ip++;
        break;
      case opcodes.XOR_REG_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] ^ state.gpr[regFrom]);
        state.ip++;
        break;
      case opcodes.XOR_REGADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] ^ await memory.load(id, instructions.indirectRegisterAddress(state, regFrom)));
        state.ip++;
        break;
      case opcodes.XOR_ADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var memFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] ^ await memory.load(id, memFrom));
        state.ip++;
        break;
      case opcodes.XOR_NUMBER_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] ^ number);
        state.ip++;
        break;
      case opcodes.NOT_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[regTo] = instructions.checkOperation(state, ~state.gpr[regTo]);
        state.ip++;
        break;
      case opcodes.SHL_REG_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] << state.gpr[regFrom]);
        state.ip++;
        break;
      case opcodes.SHL_REGADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] << await memory.load(id, instructions.indirectRegisterAddress(state, regFrom)));
        state.ip++;
        break;
      case opcodes.SHL_ADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var memFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] << await memory.load(id, memFrom));
        state.ip++;
        break;
      case opcodes.SHL_NUMBER_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] << number);
        state.ip++;
        break;
      case opcodes.SHR_REG_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] >>> state.gpr[regFrom]);
        state.ip++;
        break;
      case opcodes.SHR_REGADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var regFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] >>> await memory.load(id, instructions.indirectRegisterAddress(state, regFrom)));
        state.ip++;
        break;
      case opcodes.SHR_ADDRESS_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var memFrom = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] >>> await memory.load(id, memFrom));
        state.ip++;
        break;
      case opcodes.SHR_NUMBER_WITH_REG:
        var regTo = instructions.checkGPR(state, await memory.load(id, ++state.ip));
        var number = await memory.load(id, ++state.ip);
        state.gpr[regTo] = instructions.checkOperation(state, state.gpr[regTo] >>> number);
        state.ip++;
        break;
      default:
        throw "Invalid op code: " + instr;
    }

    return true;
  }
};

var instructions = {
  jump: function(state, newIP) {
    if (newIP < 0 || newIP >= memory.length) {
      throw "IP outside memory";
    } else {
      state.ip = newIP;
    }
  },

  checkGPR: function(state, reg) {
    if (reg < 0 || reg >= state.gpr.length) {
      throw "Invalid register: " + reg;
    } else {
      return reg;
    }
  },

  checkGPR_SP: function(state, reg) {
    if (reg < 0 || reg >= 1 + state.gpr.length) {
      throw "Invalid register: " + reg;
    } else {
      return reg;
    }
  },

  setGPR_SP: function(state, reg,value)
  {
    if(reg >= 0 && reg < state.gpr.length) {
      state.gpr[reg] = value;
    } else if(reg == state.gpr.length) {
      state.sp = value;

      // Not likely to happen, since we always get here after checkOpertion().
      if (state.sp < minSP) {
        throw "Stack overflow";
      } else if (state.sp > maxSP) {
        throw "Stack underflow";
      }
    } else {
      throw "Invalid register: " + reg;
    }
  },

  getGPR_SP: function(state, reg)
  {
    if(reg >= 0 && reg < state.gpr.length) {
      return state.gpr[reg];
    } else if(reg == state.gpr.length) {
      return state.sp;
    } else {
      throw "Invalid register: " + reg;
    }
  },

  indirectRegisterAddress: function(state, value) {
    var reg = value % 8;

    var base;
    if (reg < state.gpr.length) {
      base = state.gpr[reg];
    } else {
      base = state.sp;
    }

    var offset = Math.floor(value / 8);
    if ( offset > 15 ) {
      offset = offset - 32;
    }

    return base+offset;
  },

  checkOperation: function(state, value) {
    state.zero = false;
    state.carry = false;

    if (value >= 256) {
      state.carry = true;
      value = value % 256;
    } else if (value === 0) {
      state.zero = true;
    } else if (value < 0) {
      state.carry = true;
      value = 256 - (-value) % 256;
    }

    return value;
  },

  push: async function(id, state, value) {
    await memory.store(id, state.sp--, value);
    if (state.sp < minSP) {
      throw "Stack overflow";
    }
  },

  pop: async function(id, state) {
    var value = await memory.load(id, ++state.sp);
    if (state.sp > maxSP) {
      throw "Stack underflow";
    }

    return value;
  },

  division: function(state, divisor) {
    if (divisor === 0) {
      throw "Division by 0";
    }

    return Math.floor(state.gpr[0] / divisor);
  },

  buildApp: function(instructionId) {
    const app = express();
    app.use(express.json())
    app.post('/:id', async (req, res, next) => {
      var id = req.params['id'];
      var state = req.body;
      console.log("memory " + id + " at ip " + state.ip);
      var succeed = await cpu.computeState(id, instructionId, state);
      res.json({ state: state, succeed: succeed });
    });

    app.listen(80, "0.0.0.0");

    console.log("Started");
  }
};


module.exports = instructions;

