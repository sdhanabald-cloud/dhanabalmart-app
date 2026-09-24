# ==========================================
# DhanabalMart Production Multi-Stage Dockerfile
# 100% Pure Java Architecture
# Stage 1: Build Java Spring Boot & Thymeleaf App (Maven + Temurin 17)
# Stage 2: Minimal Eclipse Temurin 17 JRE Production Runtime
# ==========================================

# --- Stage 1: Build Java Application ---
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app/backend

# Cache Maven dependencies layer
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy Java source code and resources (Thymeleaf templates & CSS)
COPY backend/src ./src

# Package production executable JAR without running tests during Docker build
RUN mvn clean package -DskipTests

# --- Stage 2: Minimal Hardened Production Runtime ---
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Add unprivileged security user
RUN addgroup -S dhanabal && adduser -S dhanabal -G dhanabal

# Copy compiled executable JAR from builder stage
COPY --from=builder /app/backend/target/*.jar /app/dhanabalmart.jar
RUN chown -R dhanabal:dhanabal /app

USER dhanabal

# Dynamic environment configuration
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Expose HTTP port (Render dynamically allocates ${PORT})
EXPOSE 8080

# Health check configuration for Docker runtime
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:${PORT:-8080}/health || exit 1

# Launch Spring Boot with dynamic Render PORT and 0.0.0.0 interface binding
ENTRYPOINT ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar /app/dhanabalmart.jar"]
