package com.dhanabalmart.dto;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String status;
    private Long roleEntityId; // sellerId or buyerId or adminId
    private String storeName;
    private String approvalStatus;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String email, String fullName, String role, String status, Long roleEntityId, String storeName, String approvalStatus) {
        this.token = token;
        this.tokenType = "Bearer";
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.status = status;
        this.roleEntityId = roleEntityId;
        this.storeName = storeName;
        this.approvalStatus = approvalStatus;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getRoleEntityId() { return roleEntityId; }
    public void setRoleEntityId(Long roleEntityId) { this.roleEntityId = roleEntityId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
}
