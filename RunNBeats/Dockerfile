FROM openjdk:17-slim

WORKDIR /app
COPY . .

RUN apt-get update && apt-get install -y findutils bash curl unzip

RUN ./gradlew build -x test

CMD ["java", "-jar", "build/libs/RunNBeats-0.0.1-SNAPSHOT.jar"]
