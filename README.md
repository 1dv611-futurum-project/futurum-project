# Futurum Support

Projektet bygger på en utvecklingsmiljö med Docker och kräver med andra ord att man redan har Docker installerat på sin dator för att kunna köras. Välj att installera den version av Docker nedan som stämmer överens med ditt operativsystem.

* [Docker för Mac](https://docs.docker.com/docker-for-mac/install/#download-docker-for-mac)  
* [Docker för Windows](https://docs.docker.com/toolbox/toolbox_install_windows/)  
* [Docker för Ubuntu](https://www.docker.com/docker-ubuntu) samt [docker-compose](https://docs.docker.com/compose/install/)

### Starta projektet med Docker - för demo
1. Kopiera filen `docker-compose-test.yml` som finns på repot till din dator.
2. Se till att `Docker` och `docker-compose` är installerat för ditt operativsystem enligt ovan.
3. Kör igång projektet med `docker-compose -f docker-compose-test.yml up -d`, ståendes i foldern som inkluderar `docker-compose-test.yml`-filen.
4. Avvakta någon till några minuter för containrarna att laddas ner och startas upp.
5. Applikationen körs nu på `localhost:8080` eller `127.0.0.1:8080`.
6. Applikationen kan användas mot mailen `dev@futurumdigital.se` och behöver godkännas mot den mailen efter uppstart.
6. När du är klar med demon, stoppa alla containers genom att köra kommandot `docker-compose -f docker-compose-test.yml stop`.

#### Starta projektet med Docker - för utveckling

1. Följ [startinstruktionerna](https://github.com/1dv611-futurum-project/futurum-project/wiki/Startinstruktioner) för att sätta upp ett projekt hos Google och initiera .env-filen.
2. Om det är första gången du kör upp projektet med Docker, börja med att bygga upp alla containers genom att stå i projektets rot-folder och köra kommandot `docker-compose up -d --build` i din terminal. _(Observera att det här kan ta en stund beroende på dator och internetuppkoppling, framför allt att bygga klienten. 'En stund' kan här betyda allt mellan femton minuter och två timmar.)_
3. Om du däremot redan har kört projektet tidigare, kör istället `docker-compose up -d` i terminalen.
4. Klientapplikationen körs nu på `localhost:8080` och servern körs på `localhost:8080/node` (om du får fram en sida med 'Bad Gateway', så kan det bero på att containern ännu inte har hunnit starta upp - ha tålamod!).
5. När du är klar med all utveckling, stoppa alla containers genom att köra kommandot `docker-compose stop`.


#### Användbara kommandon under utveckling med docker-compose:

*_containerName_ ska alltid ersättas med namnet på den specifika containern.

* `docker-compose ps` - Skriver ut en lista med alla containers som körs för tillfället. Är framför allt användbart för att kunna se nuvarande status för alla containrar (om allting körs som det ska, bör status vara _Up_).
* `docker-compose up -d containerName` - Startar en specifik Docker container.
* `docker-compose stop containerName` - Stoppar en specifik Docker container.
* `docker-compose rm -f containerName` - Tar bort en specifik Docker container.
* `docker-compose logs --tail 50 -f containerName` - Visar de senaste 50 raderna från loggen för den specifika Docker containern .
* `docker-compose exec containerName sh` - Gå in i en specifik Docker container. Väl inne en container går det att till exempel installera npm paket eller köra automatiska tester.
* `docker rmi $(docker images -q)` - Tar bort alla Docker images som finns på datorn, även de som tillhör andra projekt. Efter det här är gjort kommer projektet att behöva byggas om på nytt.
* `docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && docker system prune -a -f --volumes` - Det ultimata nödkommandot och en sista utväg när ingenting fungerar som det ska - stoppar och tar bort **alla** containrar på datorn, även de som inte körs eller som tillhör andra projekt. Tar även bort **alla** volymer (dvs eventuellt sparat innehåll i databaser). Efter det här är gjort kommer projektet att behöva byggas om på nytt.
