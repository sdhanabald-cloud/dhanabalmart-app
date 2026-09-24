# ==========================================
# DhanabalMart Production Multi-Stage Dockerfile
# Stage 1: Build React Frontend
# Stage 2: Build Java Spring Boot Backend
# Stage 3: Minimal Eclipse Temurin JRE Production Runtime
# ==========================================

# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Java Backend ---
FROM maven:3.9.6-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /app/backend

# Cache dependencies
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy backend source
COPY backend/src ./src

# Bundle built React static assets into Spring Boot resources/static
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Package application JAR without running unit tests during docker build
RUN mvn clean package -DskipTests

# --- Stage 3: Production Runtime ---
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Add a non-root group and user for enhanced security
RUN addgroup -S dhanabal && adduser -S dhanabal -G dhanabal

# Copy the generated Spring Boot JAR
COPY --from=backend-builder /app/backend/target/*.jar /app/dhanabalmart.jar
RUN chown -R dhanabal:dhanabal /app

USER dhanabal

# Default environment configuration
ENV PORT=8080
ENV NODE_ENV=production

# Render automatically sets PORT, our command binds server to 0.0.0.0:${PORT}
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar /app/dhanabalmart.jar"]
