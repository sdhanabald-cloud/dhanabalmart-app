package com.dhanabalmart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Health Check (Public for Render & Docker monitoring)
                .requestMatchers("/health").permitAll()

                // Static resources & Single Page App routing
                .requestMatchers("/", "/index.html", "/assets/**", "/favicon.ico", "/*.js", "/*.css", "/*.png", "/*.jpg", "/*.svg").permitAll()
                .requestMatchers("/login/**", "/register/**", "/about", "/products", "/products/**", "/admin/**", "/seller/**", "/buyer/**", "/cart", "/checkout", "/orders/**").permitAll()

                // Authentication APIs
                .requestMatchers("/api/auth/**").permitAll()

                // Catalog browsing
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()

                // Admin endpoints
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                // Seller endpoints
                .requestMatchers(HttpMethod.POST, "/api/products").hasAnyAuthority("ROLE_SELLER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyAuthority("ROLE_SELLER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyAuthority("ROLE_SELLER", "ROLE_ADMIN")
                .requestMatchers("/api/orders/seller/**").hasAnyAuthority("ROLE_SELLER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/orders/*/status").hasAnyAuthority("ROLE_SELLER", "ROLE_ADMIN")

                // Authenticated user operations (Cart, Orders, Profile)
                .requestMatchers("/api/cart/**").authenticated()
                .requestMatchers("/api/orders/**").authenticated()

                // All other API requests require authentication
                .requestMatchers("/api/**").authenticated()

                .anyRequest().permitAll()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
