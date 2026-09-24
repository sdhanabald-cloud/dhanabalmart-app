package com.dhanabalmart.webcontroller;

import com.dhanabalmart.model.Buyer;
import com.dhanabalmart.model.Cart;
import com.dhanabalmart.model.CartItem;
import com.dhanabalmart.model.Role;
import com.dhanabalmart.model.User;
import com.dhanabalmart.repository.BuyerRepository;
import com.dhanabalmart.repository.CartRepository;
import com.dhanabalmart.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.Optional;

@ControllerAdvice(basePackages = "com.dhanabalmart.webcontroller")
public class GlobalModelAdvice {

    private final UserRepository userRepository;
    private final BuyerRepository buyerRepository;
    private final CartRepository cartRepository;

    public GlobalModelAdvice(UserRepository userRepository,
                             BuyerRepository buyerRepository,
                             CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.buyerRepository = buyerRepository;
        this.cartRepository = cartRepository;
    }

    @ModelAttribute("currentUser")
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            return userRepository.findByEmail(auth.getName()).orElse(null);
        }
        return null;
    }

    @ModelAttribute("isLoggedIn")
    public boolean getIsLoggedIn() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }

    @ModelAttribute("userRole")
    public String getUserRole() {
        User user = getCurrentUser();
        return user != null ? user.getRole().name() : null;
    }

    @ModelAttribute("cartItemCount")
    public int getCartItemCount() {
        User user = getCurrentUser();
        if (user != null && user.getRole() == Role.ROLE_BUYER) {
            Optional<Buyer> buyerOpt = buyerRepository.findByUserId(user.getId());
            if (buyerOpt.isPresent()) {
                Optional<Cart> cartOpt = cartRepository.findByBuyerId(buyerOpt.get().getId());
                if (cartOpt.isPresent() && cartOpt.get().getItems() != null) {
                    return cartOpt.get().getItems().stream().mapToInt(CartItem::getQuantity).sum();
                }
            }
        }
        return 0;
    }

    @ModelAttribute("currentUri")
    public String getCurrentUri(HttpServletRequest request) {
        return request.getRequestURI();
    }
}
