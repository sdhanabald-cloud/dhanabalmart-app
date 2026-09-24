package com.dhanabalmart.model;

public enum Role {
    ROLE_ADMIN,
    ROLE_SELLER,
    ROLE_BUYER;

    public static Role fromString(String roleStr) {
        if (roleStr == null) return ROLE_BUYER;
        String normalized = roleStr.trim().toUpperCase();
        if (normalized.equals("ADMIN") || normalized.equals("ROLE_ADMIN")) {
            return ROLE_ADMIN;
        } else if (normalized.equals("SELLER") || normalized.equals("ROLE_SELLER")) {
            return ROLE_SELLER;
        } else {
            return ROLE_BUYER;
        }
    }
}
