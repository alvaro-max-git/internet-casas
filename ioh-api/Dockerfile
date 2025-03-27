# Etapa 1: Compilación
FROM maven:3.9.2-eclipse-temurin-17 AS builder
WORKDIR /app

# Copiamos el pom y resolvemos dependencias (cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código y compilamos
COPY . .
RUN mvn package -DskipTests

# Etapa 2: Imagen de ejecución
FROM eclipse-temurin:17
WORKDIR /app

# Copiamos el jar generado en la etapa anterior
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
