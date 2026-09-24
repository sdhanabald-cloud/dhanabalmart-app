package com.dhanabalmart.repository;

import com.dhanabalmart.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT oi FROM OrderItem oi WHERE oi.seller.id = :sellerId ORDER BY oi.order.createdAt DESC")
    List<OrderItem> findBySellerId(@Param("sellerId") Long sellerId);

    List<OrderItem> findByOrderId(Long orderId);
}
