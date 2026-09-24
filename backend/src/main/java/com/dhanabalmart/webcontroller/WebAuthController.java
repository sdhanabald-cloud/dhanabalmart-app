package com.dhanabalmart.webcontroller;

import com.dhanabalmart.dto.AuthRequest;
import com.dhanabalmart.dto.RegisterRequest;
import com.dhanabalmart.model.Role;
import com.dhanabalmart.model.Seller;
import com.dhanabalmart.model.User;
import com.dhanabalmart.repository.SellerRepository;
import com.dhanabalmart.repository.UserRepository;
import com.dhanabalmart.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Collections;

@Controller
public class WebAuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;

    public WebAuthController(AuthService authService,
                             UserRepository userRepository,
                             SellerRepository sellerRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
    }

    @GetMapping("/login")
    public String loginSelect(@RequestParam(required = false) String logout, Model model) {
        if (logout != null) {
            model.addAttribute("message", "You have been logged out successfully.");
        }
        return "login-select";
    }

    // --- ADMIN AUTH ---
    @GetMapping("/login/admin")
    public String adminLoginForm() {
        return "auth/admin-login";
    }

    @PostMapping("/login/admin")
    public String adminLogin(@RequestParam String email,
                             @RequestParam String password,
                             HttpServletRequest request,
                             Model model) {
        try {
            AuthRequest authRequest = new AuthRequest(email, password, "ROLE_ADMIN");
            authService.login(authRequest);

            User user = userRepository.findByEmail(email.trim().toLowerCase()).orElseThrow();
            setSessionAuthentication(request, user);
            return "redirect:/admin/dashboard";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("email", email);
            return "auth/admin-login";
        }
    }

    // --- SELLER AUTH ---
    @GetMapping("/login/seller")
    public String sellerLoginForm(@RequestParam(required = false) String registered, Model model) {
        if ("true".equals(registered)) {
            model.addAttribute("message", "Registration successful! You may now login to your seller portal.");
        }
        return "auth/seller-login";
    }

    @PostMapping("/login/seller")
    public String sellerLogin(@RequestParam String email,
                              @RequestParam String password,
                              HttpServletRequest request,
                              Model model) {
        try {
            AuthRequest authRequest = new AuthRequest(email, password, "ROLE_SELLER");
            authService.login(authRequest);

            User user = userRepository.findByEmail(email.trim().toLowerCase()).orElseThrow();
            Seller seller = sellerRepository.findByUserId(user.getId()).orElse(null);
            if (seller != null && !"APPROVED".equalsIgnoreCase(seller.getApprovalStatus())) {
                model.addAttribute("error", "Your seller store approval is " + seller.getApprovalStatus() + ". Please contact administrator.");
                model.addAttribute("email", email);
                return "auth/seller-login";
            }

            setSessionAuthentication(request, user);
            return "redirect:/seller/dashboard";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("email", email);
            return "auth/seller-login";
        }
    }

    @GetMapping("/register/seller")
    public String sellerRegisterForm() {
        return "auth/seller-register";
    }

    @PostMapping("/register/seller")
    public String sellerRegister(@ModelAttribute RegisterRequest request, Model model) {
        try {
            request.setRole("ROLE_SELLER");
            authService.register(request);
            return "redirect:/login/seller?registered=true";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("form", request);
            return "auth/seller-register";
        }
    }

    // --- BUYER AUTH ---
    @GetMapping("/login/buyer")
    public String buyerLoginForm(@RequestParam(required = false) String registered, Model model) {
        if ("true".equals(registered)) {
            model.addAttribute("message", "Registration successful! You can now sign in to your buyer account.");
        }
        return "auth/buyer-login";
    }

    @PostMapping("/login/buyer")
    public String buyerLogin(@RequestParam String email,
                             @RequestParam String password,
                             HttpServletRequest request,
                             Model model) {
        try {
            AuthRequest authRequest = new AuthRequest(email, password, "ROLE_BUYER");
            authService.login(authRequest);

            User user = userRepository.findByEmail(email.trim().toLowerCase()).orElseThrow();
            setSessionAuthentication(request, user);
            return "redirect:/buyer/dashboard";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("email", email);
            return "auth/buyer-login";
        }
    }

    @GetMapping("/register/buyer")
    public String buyerRegisterForm() {
        return "auth/buyer-register";
    }

    @PostMapping("/register/buyer")
    public String buyerRegister(@ModelAttribute RegisterRequest request, Model model) {
        try {
            request.setRole("ROLE_BUYER");
            authService.register(request);
            return "redirect:/login/buyer?registered=true";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("form", request);
            return "auth/buyer-register";
        }
    }

    private void setSessionAuthentication(HttpServletRequest request, User user) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);
        request.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
    }
}
