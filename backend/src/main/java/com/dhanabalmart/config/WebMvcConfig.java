package com.dhanabalmart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // Do not intercept API or health endpoints
                        if (resourcePath.startsWith("api") || resourcePath.startsWith("health")) {
                            return null;
                        }

                        Resource requestedResource = location.createRelative(resourcePath);
                        // If file exists (e.g. assets/main.js, favicon.ico), serve it directly
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }

                        // Otherwise forward all client routes to index.html for React SPA
                        return location.createRelative("index.html");
                    }
                });
    }
}
