; 32 bit fib in little-endian using static memory
JMP .start
DB 0
DB 0
DB 0
DB 0
DB 0
DB 0
DB 0
DB 1

.start:
  MOV D, 0
.mainloop:
  CALL .add
  INC D
  CMP D, 42
  JNE .mainloop

  ; print in big endian, to be confusing
  MOV D, 232
  MOV A, 6
.printloop:
  MOV B, [A]
  MOV [D], B
  INC A
  INC D
  CMP A, 10
  JNE .printloop

HLT

.add:
  MOV B, [5] 
  MOV C, [9]
  ADD B, C
  MOV [9], B
  MOV [5], C

  MOV B, [4]
  MOV C, [8]
  ADC B, C
  MOV [8], B
  MOV [4], C

  MOV B, [3]
  MOV C, [7]
  ADC B, C
  MOV [7], B
  MOV [3], C

  MOV B, [2]
  MOV C, [6]
  ADC B, C
  MOV [6], B
  MOV [2], C
  RET

