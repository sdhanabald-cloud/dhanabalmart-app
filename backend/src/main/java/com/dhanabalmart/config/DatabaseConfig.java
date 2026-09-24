package com.dhanabalmart.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Value("${spring.datasource.url:#{null}}")
    private String fallbackUrl;

    @Value("${spring.datasource.username:dhanabal_user}")
    private String fallbackUsername;

    @Value("${spring.datasource.password:dhanabal_secure_password}")
    private String fallbackPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        String rawUrl = databaseUrl != null && !databaseUrl.isBlank() ? databaseUrl : fallbackUrl;

        // 1. If DATABASE_URL is explicitly set (Render or Docker)
        if (rawUrl != null && (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))) {
            try {
                URI dbUri = new URI(rawUrl.replace("postgres://", "postgresql://"));
                String username = "";
                String password = "";
                if (dbUri.getUserInfo() != null) {
                    String[] userInfo = dbUri.getUserInfo().split(":");
                    username = userInfo[0];
                    if (userInfo.length > 1) {
                        password = userInfo[1];
                    }
                }

                int port = dbUri.getPort() == -1 ? 5432 : dbUri.getPort();
                String host = dbUri.getHost();
                String path = dbUri.getPath();
                String dbName = path != null && path.length() > 1 ? path.substring(1) : "dhanabalmart";

                if (dbName.contains("?")) {
                    dbName = dbName.substring(0, dbName.indexOf("?"));
                }

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName;

                // For Render or remote hosts, enforce SSL
                if (!"localhost".equalsIgnoreCase(host) && !"127.0.0.1".equalsIgnoreCase(host) && !"postgres".equalsIgnoreCase(host)) {
                    jdbcUrl += "?sslmode=require";
                }

                log.info("Connecting to PostgreSQL DataSource at {}:{}/{}", host, port, dbName);
                config.setDriverClassName("org.postgresql.Driver");
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(username);
                config.setPassword(password);
                config.setMaximumPoolSize(10);
                config.setMinimumIdle(2);
                config.setIdleTimeout(30000);
                config.setConnectionTimeout(20000);
                return new HikariDataSource(config);

            } catch (Exception e) {
                log.warn("Failed to parse DATABASE_URL ({}), falling back: {}", rawUrl, e.getMessage());
            }
        }

        // 2. Check if local PostgreSQL is reachable
        boolean isLocalPgRunning = false;
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress("127.0.0.1", 5432), 600);
            isLocalPgRunning = true;
        } catch (Exception ignored) {}

        if (isLocalPgRunning) {
            String finalJdbcUrl = fallbackUrl != null ? fallbackUrl : "jdbc:postgresql://localhost:5432/dhanabalmart";
            log.info("Local PostgreSQL instance detected. Connecting to {}", finalJdbcUrl);
            config.setDriverClassName("org.postgresql.Driver");
            config.setJdbcUrl(finalJdbcUrl);
            config.setUsername(fallbackUsername);
            config.setPassword(fallbackPassword);
            config.setMaximumPoolSize(10);
            return new HikariDataSource(config);
        }

        // 3. Graceful in-memory fallback for local development when PostgreSQL is not installed/running
        log.info("No active PostgreSQL instance detected on localhost:5432. Starting in-memory fallback database for local development.");
        config.setDriverClassName("org.h2.Driver");
        config.setJdbcUrl("jdbc:h2:mem:dhanabalmart;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH");
        config.setUsername("sa");
        config.setPassword("");
        config.setMaximumPoolSize(5);
        return new HikariDataSource(config);
    }
}
