'use strict';

const fs = require('fs');

var content = fs.readFileSync("instructions.js", "utf8");

//var reg = /case opcodes\.([^:]*):/gm;
var reg = RegExp("case opcodes\.([^:]*):.*?\n(.+?)\s*break;", "gms");
let match;
while ((match = reg.exec(content)) != null) {
  var opcode = match[1].toLowerCase().replace(/_/g, "-");
  //if (opcode != "pop-reg") {
    //continue;
  //}

  var filename = `instructions/${opcode}/${opcode}.js`
  console.log(filename);
  
  var output = `
const memory = require('./libs/memory');
const instructions = require('./libs/instructions');

async function computeState(id, state) {
${match[2]}
  return true;
};

instructions.buildApp(computeState);
`

  fs.writeFileSync(filename, output);
}

