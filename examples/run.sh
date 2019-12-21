docker build -t "femtoassembler/examples" "central"
kubectl run --generator=run-pod/v1 examples --image=femtoassembler/examples:latest --image-pull-policy=Never -i --tty -- bash
kubectl delete pod examples
