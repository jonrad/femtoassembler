# build the base image for the instruction images. Can't seem to get skaffold to use this inline
docker build -t "femtoassembler/instruction-base-image" "apps/instruction-base-image"
ulimit -S -n 40000
skaffold dev
