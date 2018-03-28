# Futurum Support application


#### Running with Docker

1. If you are running Docker for the first time, set up all containers running the command `docker-compose up -d --build` in your terminal.
2. If you've already built the project before, run `docker-compose up -d` in your terminal.
3. The client application is now running at `localhost:8080` and the server at `localhost:8080/node`.
4. When you're finished with your developing, stop the containers by running `docker-compose stop`.


#### Useful commands while developing:

* `docker-compose ps` - Writes out a list of currently running containers, mainly useful to see the current statuses of all containers (if running correctly, status is _Up_).
* `docker-compose up -d ${container}` - Starts a specific container.
* `docker-compose stop ${container}` - Stops a specific container.
* `docker-compose logs --tail 50 -f ${container}` - Shows the 50 latest rows from the logs for the specified container.
* `docker-compose exec ${container} sh` - Enter a specific container.
