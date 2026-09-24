package com.dhanabalmart.repository;

import com.dhanabalmart.model.Seller;
import com.dhanabalmart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findByUser(User user);
    Optional<Seller> findByUserId(Long userId);
    List<Seller> findByApprovalStatus(String approvalStatus);
}
