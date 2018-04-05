# Futurum Support application


#### Running with Docker

1. If you are running Docker for the first time, set up all containers running the command `docker-compose up -d --build` in your terminal.
2. If you've already built the project before, run `docker-compose up -d` in your terminal.
3. The client application is now running at `localhost:8080` and the server at `localhost:8080/node` (if you're getting 'Bad Gateway', it's because the container is not yet running - patience is key!).
4. When you're finished with your developing, stop the containers by running `docker-compose stop`.


#### Useful commands while developing:

* `docker-compose ps` - Writes out a list of currently running containers, mainly useful to see the current statuses of all containers (if running correctly, status is _Up_).
* `docker-compose up -d containerName` - Starts a specific container.
* `docker-compose stop containerName` - Stops a specific container.
* `docker-compose logs --tail 50 -f containerName` - Shows the 50 latest rows from the logs for the specified container.
* `docker-compose exec containerName sh` - Enter a specific container.