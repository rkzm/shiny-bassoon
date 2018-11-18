### Development environment for Nodejs using Docker

- Assumes docker and docker-compose have been installed and configured correctly on your machine

- Docker image creation approach.
    Base image - establish minimum runtime environment including application dependencies, system configuration, default settings.
    Release Image - install application - application configuration, application Entrypoint.

- to create a docker image from a docker file run
  ```bash
     $ docker build -t {some_repo/tag_name} -f node.docker .
     $ docker run --rm {some_repo/tag_name} ps
     # --rm flag removes the container after it exists ps

     $ docker images | grep api
     # will list images and grep for api
  ```
### Hooking API container to mongodb

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
