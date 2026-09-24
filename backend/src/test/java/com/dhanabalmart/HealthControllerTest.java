package com.dhanabalmart;

import com.dhanabalmart.controller.HealthController;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class HealthControllerTest {

    @Test
    void testHealthEndpoint() {
        HealthController controller = new HealthController();
        ResponseEntity<Map<String, String>> response = controller.healthCheck();

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("OK", response.getBody().get("status"));
        assertEquals("DhanabalMart", response.getBody().get("application"));
    }
}
