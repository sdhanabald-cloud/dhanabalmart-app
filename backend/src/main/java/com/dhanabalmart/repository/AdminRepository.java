package com.dhanabalmart.repository;

import com.dhanabalmart.model.Admin;
import com.dhanabalmart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUser(User user);
    Optional<Admin> findByUserId(Long userId);
}
