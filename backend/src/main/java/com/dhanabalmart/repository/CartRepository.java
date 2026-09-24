package com.dhanabalmart.repository;

import com.dhanabalmart.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT c FROM Cart c WHERE c.buyer.id = :buyerId")
    Optional<Cart> findByBuyerId(@Param("buyerId") Long buyerId);
}
