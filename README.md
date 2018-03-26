# futurum-project
The futurum project for the 1dv611 Course

## Docker

1. Install Docker
2. On Linux/Mac or in Windows PowerShell, stand in the directory you want to run inside the Docker container and run command:

```
docker run -t -i --rm -v "$(pwd)":/app -w /app -p 8080:8080 google/nodejs sh -c '/bin/bash'
```

This will open a command prompt inside the docker container, containing the files from your current directory, and map port 8080 inside the container to port 8080 on your host machine.

To try, pull the package.json and server.js files, run the above command and then, inside the container, run `npm start`   
Alternatively, run following command directly, instead of the above:   

```
docker run -t -i --rm -v "$(pwd)":/app -w /app -p 8080:8080 google/nodejs sh -c 'npm start'
```

Hot reloading should work when you change `server.js` on your host machine.
