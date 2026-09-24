package com.dhanabalmart.repository;

import com.dhanabalmart.model.Buyer;
import com.dhanabalmart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Optional<Buyer> findByUser(User user);
    Optional<Buyer> findByUserId(Long userId);
}
