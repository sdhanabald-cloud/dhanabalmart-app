package com.dhanabalmart.dto;

import jakarta.validation.constraints.NotBlank;

public class SellerStatusUpdateRequest {

    @NotBlank(message = "Approval status is required (APPROVED, PENDING, REJECTED)")
    private String approvalStatus;

    public SellerStatusUpdateRequest() {}

    public SellerStatusUpdateRequest(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
}
