# Futurum Support

Projektet bygger på en utvecklingsmiljö med Docker och kräver med andra ord att man redan har Docker installerat på sin dator för att kunna köras. Välj att installera den version av Docker nedan som stämmer överens med ditt operativsystem.

* [Docker för Mac](https://docs.docker.com/docker-for-mac/install/#download-docker-for-mac)  
* [Docker för Windows](https://docs.docker.com/toolbox/toolbox_install_windows/)  
* [Docker för Ubuntu](https://www.docker.com/docker-ubuntu)

#### Starta projektet med Docker

1. Om det är första gången du kör upp projektet med Docker, börja med att bygga upp alla containers genom att köra kommandot `docker-compose up -d --build` i din terminal. _(Observera att det här kan ta en stund beroende på dator och internetuppkoppling, framför allt att bygga klienten)_
2. Om du däremot redan har kört projektet tidigare, kör istället `docker-compose up -d` i terminalen.
3. Klientapplikationen körs nu på `localhost:8080` och servern körs på `localhost:8080/node` (om du får fram en sida med 'Bad Gateway', så kan det bero på att containern ännu inte har hunnit starta upp - ha tålamod!).
4. När du är klar med all utveckling, stoppa alla containers genom att köra kommandot `docker-compose stop`.


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
