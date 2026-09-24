package com.dhanabalmart.controller;

import com.dhanabalmart.dto.SellerStatusUpdateRequest;
import com.dhanabalmart.model.Buyer;
import com.dhanabalmart.model.Order;
import com.dhanabalmart.model.Seller;
import com.dhanabalmart.model.User;
import com.dhanabalmart.service.AdminService;
import com.dhanabalmart.service.OrderService;
import com.dhanabalmart.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/admin", ""})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;
    private final ProductService productService;

    public AdminController(AdminService adminService, OrderService orderService, ProductService productService) {
        this.adminService = adminService;
        this.orderService = orderService;
        this.productService = productService;
    }

    @GetMapping({"/users", "/api/admin/users"})
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping({"/sellers", "/api/admin/sellers"})
    public ResponseEntity<List<Seller>> getAllSellers() {
        return ResponseEntity.ok(adminService.getAllSellers());
    }

    @GetMapping({"/buyers", "/api/admin/buyers"})
    public ResponseEntity<List<Buyer>> getAllBuyers() {
        return ResponseEntity.ok(adminService.getAllBuyers());
    }

    @PutMapping({"/sellers/{id}", "/api/admin/sellers/{id}"})
    public ResponseEntity<?> updateSellerStatus(@PathVariable Long id,
                                               @Valid @RequestBody SellerStatusUpdateRequest request) {
        try {
            Seller seller = adminService.updateSellerStatus(id, request.getApprovalStatus());
            return ResponseEntity.ok(seller);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping({"/users/{id}/status", "/api/admin/users/{id}/status"})
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id,
                                              @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            User user = adminService.updateUserStatus(id, status);
            return ResponseEntity.ok(user);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping({"/api/admin/orders"})
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping({"/stats", "/api/admin/stats"})
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    @GetMapping({"/api/admin/products"})
    public ResponseEntity<?> getAllAdminProducts() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }
}
