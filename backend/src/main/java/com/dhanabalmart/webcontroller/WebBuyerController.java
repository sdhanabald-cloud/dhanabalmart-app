package com.dhanabalmart.webcontroller;

import com.dhanabalmart.dto.AddToCartRequest;
import com.dhanabalmart.dto.CheckoutRequest;
import com.dhanabalmart.dto.UpdateCartItemRequest;
import com.dhanabalmart.model.*;
import com.dhanabalmart.repository.BuyerRepository;
import com.dhanabalmart.repository.UserRepository;
import com.dhanabalmart.service.CartService;
import com.dhanabalmart.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.util.List;

@Controller
public class WebBuyerController {

    private final CartService cartService;
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final BuyerRepository buyerRepository;

    public WebBuyerController(CartService cartService,
                              OrderService orderService,
                              UserRepository userRepository,
                              BuyerRepository buyerRepository) {
        this.cartService = cartService;
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.buyerRepository = buyerRepository;
    }

    @GetMapping("/buyer/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/buyer";
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        Buyer buyer = user != null ? buyerRepository.findByUserId(user.getId()).orElse(null) : null;
        List<Order> orders = orderService.getBuyerOrders(email);

        model.addAttribute("user", user);
        model.addAttribute("buyer", buyer);
        model.addAttribute("recentOrders", orders.stream().limit(5).toList());
        model.addAttribute("totalOrders", orders.size());
        return "buyer/dashboard";
    }

    @GetMapping("/buyer/profile")
    public String profile(Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/buyer";
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Buyer buyer = buyerRepository.findByUserId(user.getId()).orElse(null);

        model.addAttribute("user", user);
        model.addAttribute("buyer", buyer);
        return "buyer/profile";
    }

    @PostMapping("/buyer/profile")
    public String updateProfile(Authentication authentication,
                                @RequestParam String fullName,
                                @RequestParam String phone,
                                @RequestParam(required = false) String shippingAddress,
                                @RequestParam(required = false) String city,
                                @RequestParam(required = false) String postalCode,
                                RedirectAttributes redirectAttributes) {
        if (authentication == null) return "redirect:/login/buyer";
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setFullName(fullName.trim());
        user.setPhone(phone.trim());
        userRepository.save(user);

        Buyer buyer = buyerRepository.findByUserId(user.getId()).orElse(null);
        if (buyer == null) {
            buyer = new Buyer(user, shippingAddress, city, postalCode);
        } else {
            buyer.setShippingAddress(shippingAddress);
            buyer.setCity(city);
            buyer.setPostalCode(postalCode);
        }
        buyerRepository.save(buyer);

        redirectAttributes.addFlashAttribute("successMessage", "Profile updated successfully!");
        return "redirect:/buyer/profile";
    }

    // --- CART ACTIONS ---
    @GetMapping("/cart")
    public String viewCart(Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/buyer";
        String email = authentication.getName();
        try {
            Cart cart = cartService.getOrCreateCart(email);
            BigDecimal total = BigDecimal.ZERO;
            if (cart.getItems() != null) {
                for (CartItem item : cart.getItems()) {
                    total = total.add(item.getPriceAtAddition().multiply(BigDecimal.valueOf(item.getQuantity())));
                }
            }
            model.addAttribute("cart", cart);
            model.addAttribute("cartTotal", total);
            return "buyer/cart";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "buyer/cart";
        }
    }

    @PostMapping("/cart/add")
    public String addToCart(Authentication authentication,
                            @RequestParam Long productId,
                            @RequestParam(defaultValue = "1") int quantity,
                            RedirectAttributes redirectAttributes) {
        if (authentication == null) return "redirect:/login/buyer";
        try {
            AddToCartRequest req = new AddToCartRequest(productId, quantity);
            cartService.addToCart(authentication.getName(), req);
            redirectAttributes.addFlashAttribute("successMessage", "Item successfully added to your cart!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/cart";
    }

    @PostMapping("/cart/update")
    public String updateCartItem(Authentication authentication,
                                 @RequestParam Long itemId,
                                 @RequestParam int quantity,
                                 RedirectAttributes redirectAttributes) {
        if (authentication == null) return "redirect:/login/buyer";
        try {
            UpdateCartItemRequest req = new UpdateCartItemRequest(quantity);
            cartService.updateCartItemQuantity(authentication.getName(), itemId, req);
            redirectAttributes.addFlashAttribute("successMessage", "Cart updated!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/cart";
    }

    @PostMapping("/cart/remove")
    public String removeCartItem(Authentication authentication,
                                 @RequestParam Long itemId,
                                 RedirectAttributes redirectAttributes) {
        if (authentication == null) return "redirect:/login/buyer";
        try {
            cartService.removeFromCart(authentication.getName(), itemId);
            redirectAttributes.addFlashAttribute("successMessage", "Item removed from cart.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/cart";
    }

    // --- CHECKOUT & ORDERS ---
    @GetMapping("/checkout")
    public String checkoutPage(Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/buyer";
        String email = authentication.getName();
        try {
            Cart cart = cartService.getOrCreateCart(email);
            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                return "redirect:/cart";
            }
            BigDecimal total = BigDecimal.ZERO;
            for (CartItem item : cart.getItems()) {
                total = total.add(item.getPriceAtAddition().multiply(BigDecimal.valueOf(item.getQuantity())));
            }
            User user = userRepository.findByEmail(email).orElseThrow();
            Buyer buyer = buyerRepository.findByUserId(user.getId()).orElse(null);

            model.addAttribute("cart", cart);
            model.addAttribute("cartTotal", total);
            model.addAttribute("user", user);
            model.addAttribute("buyer", buyer);
            return "buyer/checkout";
        } catch (Exception e) {
            return "redirect:/cart";
        }
    }

    @PostMapping("/checkout")
    public String processCheckout(Authentication authentication,
                                  @RequestParam String shippingAddress,
                                  @RequestParam(defaultValue = "CARD") String paymentMethod,
                                  RedirectAttributes redirectAttributes) {
        if (authentication == null) return "redirect:/login/buyer";
        try {
            CheckoutRequest req = new CheckoutRequest(shippingAddress, paymentMethod);
            Order order = orderService.checkout(authentication.getName(), req);
            redirectAttributes.addFlashAttribute("successMessage", "Order #" + order.getOrderNumber() + " placed successfully!");
            return "redirect:/buyer/orders/" + order.getId();
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/checkout";
        }
    }

    @GetMapping("/buyer/orders")
    public String myOrders(Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/buyer";
        List<Order> orders = orderService.getBuyerOrders(authentication.getName());
        model.addAttribute("orders", orders);
        return "buyer/orders";
    }

    @GetMapping("/buyer/orders/{id}")
    public String orderDetails(@PathVariable Long id, Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/buyer";
        try {
            Order order = orderService.getOrderById(id, authentication.getName());
            model.addAttribute("order", order);
            return "buyer/order-details";
        } catch (Exception e) {
            return "redirect:/buyer/orders";
        }
    }
}
