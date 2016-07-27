### Development environment for Nodejs using Docker

- Installing docker on mac
  ```
   $brew install docker-compose
  ```
- creating a docker-machine in which docker client will run
  ```
  $docker-machine create -d virtualbox --virtualbox-cpu-count "4" -virtualbox-disk-size "60000" --virtualbox-memory "8192" {docker_machine_name}
  ```
- starting up docker-machine
  ```  
  $docker-machine start {docker_machine_name}
  ```
- Setting the correct environment variables for docker client to connect to docker-machine 
  ```
  $ docker-machine env {docker_machine_name}
  ```
- the result of the command above
  ```
  export DOCKER_TLS_VERIFY="1"
  export DOCKER_HOST="tcp://192.168.99.100:2376"
  export DOCKER_CERT_PATH="/Users/user/.docker/machine/machines/{docker_machine_name}"
  export {docker_machine_name}="{docker_machine_name}"
  ```
- this command allows the docker commands to be used in the mac shell. exposing the environment variables of docker-machine to the host machine 
  ```
  $eval $(docker-machine env {docker_machine_name})
  ```
- test drive your setup. verify docker client can communicate to docker engine running on our virtual machine 
  ```
  $docker pull ubuntu

  Using default tag: latest
  latest: Pulling from library/ubuntu
  f069f1d21059: Pull complete
  ecbeec5633cf: Pull complete
  ea6f18256d63: Pull complete
  54bde7b02897: Pull complete
  Digest: sha256:bbfd93a02a8487edb60f20316ebc966ddc7aa123c2e609185450b96971020097
  Status: Downloaded newer image for ubuntu:latest
  ```

- some usefull commands
  ```
  $ docker-machine ip {docker_machine_name}
  192.168.99.100
  ```
  ```
  $ docker-machine ls
  NAME       ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER    ERRORS
  {docker_machine_name}   *        virtualbox   Running   tcp://192.168.99.100:2376           v1.11.2
  ```


- Docker image hierachy. Create a base image - establish minimum runtime environment - application dependancies, system configuration, default settings. Release Image - install application - application configuration, application entrypoint. the exec command starts a process and makes it the pid1 process and then terminates

- to create a docker image from a docker file run 
  ```
  $ docker build -t {some_repo/tag_name} .
  ```
- rm flag removes the container after it exists ps
  ```
  $ docker run -rm {some_repo/tag_name} ps
  
  $ docker images - lists images
  REPOSITORY                TAG                 IMAGE ID            CREATED             SIZE
  centos                    centos6             cf2c3ece5e41        4 days ago          194.6 MB
  ubuntu                    latest              0f192147631d        6 days ago          132.8 MB
  <none>                    <none>              2fa927b5cdd3        5 weeks ago         122 MB
  ```

- gracefully terminating docker containers
  ```
  $ docker run --rm {some_repo/tag_name} ps
    PID TTY          TIME CMD
    1 ?        00:00:00 ps
  ```
  
- Notice the container runs as pid 1 and exists this means that docker daemon will send the kill command to our application and it will terminate gracefully. if we removed the exec command and just ran '$@' then entrypoint will be pid 1 and the command we pass in will be pid 10 or something bad container temination for more information go to https://docs.docker.com/machine/get-started/
  ```
  $ docker run -t -i reptileinx/pluralsight-base /bin/bash
  docker run  -p external:Internal -v $(pwd):"/var/www/" -w "/var/www/" node npm start
  ...this will create a working environment running in a container
  ```
- Using linking (legacy) for containers to communicate
  ```
  $ docker run -d --name {container_name} image
  $ docker run -d -p 3000:3000 --link {that_container_alias}:{that_container_image} --name {container_name} image
  $ docker run -d -p 3000:3000 --link nashamongo:mongo --name api_name node_image
  ```
- Using the network bridge driver approach to isolate docker containers
  1. creating an isolated network named isolated_network
  ```
  $ docker network create --driver bridge isolated_network
  ```
  2. running my mongodb container in the isolated network
  ```
  $ docker run -d --net=isolated_network --name {container_name} image
  $ docker run -d --net=isolated_network --name exampledb mongo
  ```
3. any container brought up in this network will talk to another in this network. Running my api code in defined network
  ```
  $ docker run -d --net=isolated_network --name {container_name} -p 3000:3000 {some_repo/tag_name}
  ...the port 3000 has to be exposed on the container_name image
  ```
- inpect what is running on my custom defined networks
  ```  
  $ docker network inspect isolated_network
        [
            {
                "Name": "isolated_network",
                "Id": "adeae7b857e9680aadc08a83174f76ee85e54971f84ee445f3690870707a8051",
                "Scope": "local",
                "Driver": "bridge",
                "EnableIPv6": false,
                "IPAM": {
                    "Driver": "default",
                    "Options": {},
                    "Config": [
                        {
                            "Subnet": "172.18.0.0/16",
                            "Gateway": "172.18.0.1/16"
                        }
                    ]
                },
                "Internal": false,
                "Containers": {
                    "0b125f428a4b4524e64d2df3409cc2301b94ec14d61f6a2ef3c3088014e06215": {
                        "Name": "nashamongo",
                        "EndpointID": "f3baf5b1942e4953e19abd9846aa6db0b77617e81c4c7d77e2ff6f25b406dcfe",
                        "MacAddress": "02:42:ac:12:00:02",
                        "IPv4Address": "172.18.0.2/16",
                        "IPv6Address": ""
                    },
                    "5ae0c0ac364f5d0a329093dbd51d11d9e1ed69e875a71ef30a3e6b9625663955": {
                        "Name": "bookapi",
                        "EndpointID": "f43e8974148ec680f8773f66c73214d5472687cdafd353b8f4f6eabbc9f734cb",
                        "MacAddress": "02:42:ac:12:00:03",
                        "IPv4Address": "172.18.0.3/16",
                        "IPv6Address": ""
                    }
                },
                "Options": {},
                "Labels": {}
            }
        ]
  ```

#### linking multiple containers - > introducing docker-compose
- use docker compose to build service. use docker compose to manage containers
- start up and tear down
docker compose yaml file.
- this is a normal text file that defines our services.
- docker compose build process builds services (images)
- on dev machine we can build up containers
- get the containers running

#### docker compose yaml file
 
    ```
        version: '2'
        services: what you want to be running (db, cache)
           configurations
              build context (folder,  docker file)
              environement variables (put into service at run time)
              images: if an image already exists 
              networks: associate with network 
              ports:
              volumes:
        for yaml mind the indentation
    ```
- build dockerfile into images
    ```
    $ docker-compose build
    $ docker-compose up, down, logs, ps, stop, start, rm
    ```
- building individual images 
  ```
  $ docker-compose build mongo
  ```
- bringing up service with no dependancies
  ```
  $ docker-compose up --no-deps node
  --no-deps ... will allow docker-compose not to recreate node dependant containers (services)
  ```
- remove all volumes and images
  ```
  $ docker-compose down --rmi all --volumes
  Note: docker machine allows automatic share of home directories
  ```
- How to confirm this--->
  ```
  $ docker-machine ssh {docker_machine_name}
  ```
 #### You are on the docker01 machine
    ```
    Boot2Docker version 1.11.2, build HEAD : a6645c3 - Wed Jun  1 22:59:51 UTC 2016
    Docker version 1.11.2, build b9f10c9
    docker@{docker_machine_name}:~$ 
    docker@{docker_machine_name}:~$ pwd
    /home/docker
    docker@{docker_machine_name}:~$ cd /Users/username/
    ```
