package com.dhanabalmart.service;

import com.dhanabalmart.dto.ProductRequest;
import com.dhanabalmart.model.Category;
import com.dhanabalmart.model.Product;
import com.dhanabalmart.model.Role;
import com.dhanabalmart.model.Seller;
import com.dhanabalmart.model.User;
import com.dhanabalmart.repository.CategoryRepository;
import com.dhanabalmart.repository.ProductRepository;
import com.dhanabalmart.repository.SellerRepository;
import com.dhanabalmart.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          SellerRepository sellerRepository,
                          UserRepository userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
    }

    public List<Product> getAllProducts(Long categoryId, String search) {
        boolean hasCategory = categoryId != null && categoryId > 0;
        boolean hasSearch = search != null && !search.trim().isBlank();

        if (hasCategory && hasSearch) {
            return productRepository.searchActiveProductsByCategory(categoryId, search.trim());
        } else if (hasCategory) {
            return productRepository.findByCategoryId(categoryId).stream()
                    .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()))
                    .toList();
        } else if (hasSearch) {
            return productRepository.searchActiveProducts(search.trim());
        } else {
            return productRepository.findByStatus("ACTIVE");
        }
    }

    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
    }

    public List<Product> getProductsBySellerEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Seller profile not found for user: " + email));
        return productRepository.findBySellerId(seller.getId());
    }

    @Transactional
    public Product createProduct(String sellerEmail, ProductRequest request) {
        User user = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + sellerEmail));
        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Only registered sellers can create products"));

        if (!"APPROVED".equalsIgnoreCase(seller.getApprovalStatus())) {
            throw new AccessDeniedException("Your seller account is currently " + seller.getApprovalStatus() + ". You cannot list products until approved by DhanabalMart admin.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + request.getCategoryId()));

        Product product = new Product(
                seller,
                category,
                request.getName().trim(),
                request.getDescription(),
                request.getPrice(),
                request.getStockQuantity(),
                request.getImageUrl(),
                request.getStatus() != null ? request.getStatus() : "ACTIVE"
        );

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, String userEmail, ProductRequest request) {
        Product product = getProductById(id);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        // Authorization check: User must be Admin or the owner Seller
        if (user.getRole() != Role.ROLE_ADMIN) {
            Seller seller = sellerRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new AccessDeniedException("Unauthorized"));
            if (!product.getSeller().getId().equals(seller.getId())) {
                throw new AccessDeniedException("You do not have permission to modify this product");
            }
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + request.getCategoryId()));
            product.setCategory(category);
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            product.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getStockQuantity() != null) {
            product.setStockQuantity(request.getStockQuantity());
            if (product.getStockQuantity() <= 0) {
                product.setStatus("OUT_OF_STOCK");
            } else if ("OUT_OF_STOCK".equalsIgnoreCase(product.getStatus())) {
                product.setStatus("ACTIVE");
            }
        }
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id, String userEmail) {
        Product product = getProductById(id);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        // Authorization check: User must be Admin or the owner Seller
        if (user.getRole() != Role.ROLE_ADMIN) {
            Seller seller = sellerRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new AccessDeniedException("Unauthorized"));
            if (!product.getSeller().getId().equals(seller.getId())) {
                throw new AccessDeniedException("You do not have permission to delete this product");
            }
        }

        productRepository.delete(product);
    }
}
