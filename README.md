# femtoassembler

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

# Tools used

* Neovim: https://neovim.io/
* Skaffold: https://skaffold.dev/
* Stern: https://github.com/wercker/stern

