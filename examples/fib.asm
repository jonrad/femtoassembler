MOV A, 0
MOV B, 0
MOV C, 1
.loop:
MOV D, C
ADD D, B
MOV B, C
MOV C, D
INC A
CMP A, 10
JAE .print
JMP .loop

.print:
MOV [232], C
HLT
