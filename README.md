# futurum-project
The futurum project for the 1dv611 Course

## Docker

1. Install Docker
2. Create a .dockerignore-file that will prevent your local modules and debug logs from being copied onto your Docker image and possibly overwriting modules installed within your image, and add this:

```
node_modules
npm-debug.log
```

3. On Linux/Mac or in Windows PowerShell, build the docker image and get the container id:

```
docker build -t <your username>/boilerplate .
```

4. Enter the container using the container id:

```
docker run -t -i --rm -v "$(pwd)":/app -w /app -p 8080:8080 <your username>/boilerplate sh -c '/bin/bash'
```

This will open a command prompt inside the docker container, containing the files from your current directory, and map port 8080 inside the container to port 8080 on your host machine.

## Once inside...

Install the dependencies in both the client and the server

```
cd server && npm install
cd client && npm install
```

To start the server, run:

```
cd server && npm start
```

To bundle the client files, run:

```
cd client && npm run dev
```