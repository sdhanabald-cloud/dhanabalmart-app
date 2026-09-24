package com.dhanabalmart.service;

import com.dhanabalmart.model.*;
import com.dhanabalmart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final BuyerRepository buyerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminService(UserRepository userRepository,
                        SellerRepository sellerRepository,
                        BuyerRepository buyerRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
        this.buyerRepository = buyerRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Seller> getAllSellers() {
        return sellerRepository.findAll();
    }

    public List<Buyer> getAllBuyers() {
        return buyerRepository.findAll();
    }

    @Transactional
    public Seller updateSellerStatus(Long sellerId, String status) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found with ID: " + sellerId));
        seller.setApprovalStatus(status.toUpperCase());
        return sellerRepository.save(seller);
    }

    @Transactional
    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        user.setStatus(status.toUpperCase());
        return userRepository.save(user);
    }

    public Map<String, Object> getPlatformStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        List<Order> orders = orderRepository.findAll();
        long totalOrders = orders.size();

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getOrderStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Seller> sellers = sellerRepository.findAll();
        long approvedSellers = sellers.stream().filter(s -> "APPROVED".equalsIgnoreCase(s.getApprovalStatus())).count();
        long pendingSellers = sellers.stream().filter(s -> "PENDING".equalsIgnoreCase(s.getApprovalStatus())).count();
        long totalBuyers = buyerRepository.count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("approvedSellers", approvedSellers);
        stats.put("pendingSellers", pendingSellers);
        stats.put("totalBuyers", totalBuyers);

        return stats;
    }
}
