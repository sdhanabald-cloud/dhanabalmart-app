package com.dhanabalmart.repository;

import com.dhanabalmart.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySellerId(Long sellerId);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByStatus(String status);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchActiveProducts(@Param("query") String query);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.category.id = :categoryId AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchActiveProductsByCategory(@Param("categoryId") Long categoryId, @Param("query") String query);
}
