# femtoassembler

We've seen the benefits of [femto-management](https://vimeo.com/95529846) over micro-management. So why are we still using micro-services?

Microservices are a bust. They fail on every axis of comparison. They're not liberating enough. They're not confining enough. They're not loose enough. They're not tight enough. 

For those looking to jump from mega-fund to peta-fund, the answer is femto-services. 

Stop using a single CPU to run your applications. With the femtoassembler you can have each instruction run on a different node. Notice that you're application is calling ADD more than other instructions? Increase the replicas to the ADD instruction nodes!  

### Demo

Below gif shows an example run of calculating fib of 10 using an 8 bit integer values (Registers only, no need to use actual memory other than for the cpu instructions). The left pane is the result from skaffold, the next pane is the stdout of the cpu node, followed by 4 instruction nodes that I found interesting, followed by the actual command to run the command. The result is in hex: 
![8 Bit Fib(10)](examples/fib8bit.gif)

# Running

### Mac with Minikube

* Create a new cluster:

```minikube start -p assembler```

* Set the context for kubectl to the new cluster:

```kubectl config set-context assembler```

* Set your docker environment to the new minikube context:

```eval $(minikube docker-env -p assembler)```

* Optional: I had to kill my `dnsmasq` to get my minikube to be able to access the network properly (Why...?):

```sudo killall dnsmasq```

* Start skaffold:

```./start_skaffold.sh```

* Profit!?

* To run examples, open a new terminal and run:

```
$ eval $(minikube docker-env -p assembler)
$ cd examples
$ ./run.sh
root@examples:/usr/src/app# node run.js helloworld.asm #Hello world in HEX
[
  '48', '65', '6c', '6c',
  '6f', '20', '57', '6f',
  '72', '6c', '64', '21',
  '00', '00', '00', '00',
  '00', '00', '00', '00',
  '00', '00', '00', '00'
]
root@examples:/usr/src/app# node run.js fib8bit.asm #fib(10) in HEX, 8 bit (Only uses a single byte of memory)
[
  '59', '00', '00', '00',
  '00', '00', '00', '00',
  '00', '00', '00', '00',
  '00', '00', '00', '00',
  '00', '00', '00', '00',
  '00', '00', '00', '00'
]
root@examples:/usr/src/app# node run.js fib.asm #fib(42) in HEX, using 32 bit big endian notation
[
  '19', 'd6', '99', 'a5',
  '00', '00', '00', '00',
  '00', '00', '00', '00',
  '00', '00', '00', '00',
  '00', '00', '00', '00',
  '00', '00', '00', '00'
]
```

# Architecture

* Memory - Stores 256 bytes of data, which should be enough for anyone.
* CPU - Runs the instructions based on what's in memory
* Assembler Line Parser - Parses a single instruction line (such as `MOV A, B`) and returns the machine code representation
* Assembler - Takes the assembler instructions, sends to the line parsers and puts it all together into memory
* Executor - Runs the code in memory
* add-reg-to-reg - Example instruction node. Takes a single instruction and updates the state of the execution

# Tools used

Most of the javascript assembler and executor code is borrowed from https://github.com/Schweigi/assembler-simulator, I just ripped it apart using a combination of bash, perl and scripts written in node. 

* Neovim: https://neovim.io/
* Skaffold: https://skaffold.dev/
* Stern: https://github.com/wercker/stern

