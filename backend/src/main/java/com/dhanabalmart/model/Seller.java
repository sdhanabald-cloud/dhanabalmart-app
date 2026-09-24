package com.dhanabalmart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sellers")
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "store_name", nullable = false, length = 150)
    private String storeName;

    @Column(name = "business_address", columnDefinition = "TEXT")
    private String businessAddress;

    @Column(name = "tax_id", length = 50)
    private String taxId;

    @Column(name = "approval_status", nullable = false, length = 20)
    private String approvalStatus = "APPROVED"; // PENDING, APPROVED, REJECTED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Seller() {}

    public Seller(User user, String storeName, String businessAddress, String taxId, String approvalStatus) {
        this.user = user;
        this.storeName = storeName;
        this.businessAddress = businessAddress;
        this.taxId = taxId;
        this.approvalStatus = approvalStatus != null ? approvalStatus : "APPROVED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getBusinessAddress() { return businessAddress; }
    public void setBusinessAddress(String businessAddress) { this.businessAddress = businessAddress; }

    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
