package com.dhanabalmart.service;

import com.dhanabalmart.config.JwtTokenProvider;
import com.dhanabalmart.dto.AuthRequest;
import com.dhanabalmart.dto.AuthResponse;
import com.dhanabalmart.dto.RegisterRequest;
import com.dhanabalmart.dto.UserUpdateRequest;
import com.dhanabalmart.model.*;
import com.dhanabalmart.repository.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final SellerRepository sellerRepository;
    private final BuyerRepository buyerRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       AdminRepository adminRepository,
                       SellerRepository sellerRepository,
                       BuyerRepository buyerRepository,
                       CartRepository cartRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.sellerRepository = sellerRepository;
        this.buyerRepository = buyerRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
            throw new BadCredentialsException("Your account has been deactivated. Please contact DhanabalMart support.");
        }

        // Verify user is attempting to login to their authorized portal
        if (request.getRole() != null && !request.getRole().isBlank()) {
            Role requestedRole = Role.fromString(request.getRole());
            if (user.getRole() != requestedRole) {
                String portalName = requestedRole.name().replace("ROLE_", "");
                throw new BadCredentialsException("Access Denied: You are not authorized to login through the " + portalName + " portal.");
            }
        }

        String token = tokenProvider.generateTokenFromUsername(user.getEmail());
        return buildAuthResponse(user, token);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with email " + email + " already exists");
        }

        Role role = Role.fromString(request.getRole());
        if (role == Role.ROLE_ADMIN) {
            throw new IllegalArgumentException("Admin accounts cannot be registered publicly");
        }

        User user = new User(
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                request.getPhone(),
                role,
                "ACTIVE"
        );
        user = userRepository.save(user);

        if (role == Role.ROLE_SELLER) {
            String storeName = request.getStoreName() != null && !request.getStoreName().isBlank()
                    ? request.getStoreName().trim()
                    : request.getFullName() + "'s Store";
            Seller seller = new Seller(
                    user,
                    storeName,
                    request.getBusinessAddress(),
                    request.getTaxId(),
                    "APPROVED" // Auto-approve demo seller or default
            );
            sellerRepository.save(seller);
        } else {
            Buyer buyer = new Buyer(
                    user,
                    request.getShippingAddress(),
                    request.getCity(),
                    request.getPostalCode()
            );
            buyer = buyerRepository.save(buyer);

            // Initialize shopping cart for buyer
            Cart cart = new Cart(buyer);
            cartRepository.save(cart);
        }

        String token = tokenProvider.generateTokenFromUsername(user.getEmail());
        return buildAuthResponse(user, token);
    }

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return buildAuthResponse(user, null);
    }

    @Transactional
    public AuthResponse updateProfile(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        user = userRepository.save(user);

        if (user.getRole() == Role.ROLE_SELLER) {
            sellerRepository.findByUserId(user.getId()).ifPresent(seller -> {
                if (request.getStoreName() != null && !request.getStoreName().isBlank()) {
                    seller.setStoreName(request.getStoreName().trim());
                }
                if (request.getBusinessAddress() != null) {
                    seller.setBusinessAddress(request.getBusinessAddress());
                }
                if (request.getTaxId() != null) {
                    seller.setTaxId(request.getTaxId());
                }
                sellerRepository.save(seller);
            });
        } else if (user.getRole() == Role.ROLE_BUYER) {
            buyerRepository.findByUserId(user.getId()).ifPresent(buyer -> {
                if (request.getShippingAddress() != null) {
                    buyer.setShippingAddress(request.getShippingAddress());
                }
                if (request.getCity() != null) {
                    buyer.setCity(request.getCity());
                }
                if (request.getPostalCode() != null) {
                    buyer.setPostalCode(request.getPostalCode());
                }
                buyerRepository.save(buyer);
            });
        }

        return buildAuthResponse(user, null);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        Long roleEntityId = null;
        String storeName = null;
        String approvalStatus = null;

        if (user.getRole() == Role.ROLE_ADMIN) {
            Admin admin = adminRepository.findByUserId(user.getId()).orElse(null);
            if (admin != null) roleEntityId = admin.getId();
        } else if (user.getRole() == Role.ROLE_SELLER) {
            Seller seller = sellerRepository.findByUserId(user.getId()).orElse(null);
            if (seller != null) {
                roleEntityId = seller.getId();
                storeName = seller.getStoreName();
                approvalStatus = seller.getApprovalStatus();
            }
        } else if (user.getRole() == Role.ROLE_BUYER) {
            Buyer buyer = buyerRepository.findByUserId(user.getId()).orElse(null);
            if (buyer != null) roleEntityId = buyer.getId();
        }

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.getStatus(),
                roleEntityId,
                storeName,
                approvalStatus
        );
    }
}
