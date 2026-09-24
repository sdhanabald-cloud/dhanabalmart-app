package com.dhanabalmart.repository;

import com.dhanabalmart.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findAllByOrderByCreatedAtDesc();
}
