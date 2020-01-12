# Development environment for NodeJs using Docker
We created this repository when we first started learning about Docker. We have moved it here so we can update some of the things we did then. Also we are interested to see if it still works :smile:

This document assumes docker and docker-compose have been installed and configured correctly on your machine

## Docker image creation approach.
    Base image - establish minimum runtime environment including application dependencies, system configuration, default settings.
    Release Image - install application - application configuration, application Entrypoint.

## Create a docker image from a docker file run
  ```bash
     # notice the -f to indicate the Dockerfile to use
     $ docker build -t <some_repo/tag_name> -f node.docker .

     # --rm flag removes the container after it exists ps
     $ docker run --rm {some_repo/tag_name} ps

     # will list images and grep for tag_name
     $ docker images | grep tag_name
  ```

## Pull `Mongodb` image to local machine

  ```bash
    docker pull mongo
  ```

## Different ways of networking two containers

### Hooking API container to Mongo DB

The code shows that we have an API that needs to run using Mongo DB. The sections below will demonstrate how we can hook up the API to talk to the Database.

---
#### Using linking (legacy) for containers to communicate
  ```bash
    # start the mongo container
    # notice the `-d` to run in detached mode so we can continue working on the terminal
    $ docker run -d --name <mongo_container_name> mongo_image

    # Create the app container and link it to mongo
    $ docker run -d -p 3000:3000 --link <mongo_container_name>:<mongo_image> --name <app_container_name> <app_image>
  ```

---
#### Using the network bridge driver approach to isolate docker containers
  1. Create an isolated network named `isolated_network`
  ```bash
    $ docker network create --driver bridge isolated_network
  ```

  2. Run Mongo container in the created `isolated_network`
  ```bash
  $ docker run -d --net=isolated_network --name <container_name> <mongo_image>
  ```

  3. Containers running in the same network talk to one another. Lets run the API code in the defined network
  ```bash
  $ docker run -d --net=isolated_network --name <app_container_name> -p 3000:3000 <some_repo/tag_name>

  # the port 3000 has to be exposed on the app_container_name image
  ```

  Run inpect what is running on the custom defined network
  ```bash
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

---
#### Linking multiple containers
The best way is to use [container orchestration tools](https://en.wikipedia.org/wiki/Orchestration_(computing)).  Here we will start by looking at [Docker Compose](https://docs.docker.com/compose/). Some of the things we will do include:
- use Docker Compose to build services.
- use Docker Compose to manage containers
- start up and tear down docker compose infrastructure defined in a yaml file.
- a YAML file is a text file that defines our services.
- Docker Compose build process builds services (images)
- we can also get the containers running through compose

An outline of some of the fields in a `docker-compose.yml` file can be seen below

    ```yaml
        version: '3'
        services: what you want to be running (db, cache)
           configurations
              build context (folder,  docker file)
              environment variables (put into service at run time)
              images: if an image already exists
              networks: associate with network
              ports:
              volumes:
        # for yaml mind the indentation
    ```

Build images from Dockerfiles using Docker Compose commands
    ```bash
      $ docker-compose build
      $ docker-compose up
      # some other useful commands 
      # down, logs, ps, stop, start, rm
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
