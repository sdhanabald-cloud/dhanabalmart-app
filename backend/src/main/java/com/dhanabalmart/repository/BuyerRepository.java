package com.dhanabalmart.repository;

import com.dhanabalmart.model.Buyer;
import com.dhanabalmart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Optional<Buyer> findByUser(User user);

    @Query("SELECT b FROM Buyer b WHERE b.user.id = :userId")
    Optional<Buyer> findByUserId(@Param("userId") Long userId);
}
