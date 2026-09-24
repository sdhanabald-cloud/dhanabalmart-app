package com.dhanabalmart.webcontroller;

import com.dhanabalmart.model.*;
import com.dhanabalmart.repository.UserRepository;
import com.dhanabalmart.service.AdminService;
import com.dhanabalmart.service.OrderService;
import com.dhanabalmart.service.ProductService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class WebAdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final OrderService orderService;
    private final UserRepository userRepository;

    public WebAdminController(AdminService adminService,
                              ProductService productService,
                              OrderService orderService,
                              UserRepository userRepository) {
        this.adminService = adminService;
        this.productService = productService;
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        Map<String, Object> stats = adminService.getPlatformStats();
        List<Order> recentOrders = orderService.getAllOrders().stream().limit(6).toList();

        model.addAttribute("stats", stats);
        model.addAttribute("recentOrders", recentOrders);
        return "admin/dashboard";
    }

    @GetMapping("/sellers")
    public String sellers(Model model) {
        List<Seller> sellers = adminService.getAllSellers();
        model.addAttribute("sellers", sellers);
        return "admin/sellers";
    }

    @PostMapping("/sellers/{id}/status")
    public String updateSellerStatus(@PathVariable Long id,
                                     @RequestParam String status,
                                     RedirectAttributes redirectAttributes) {
        try {
            adminService.updateSellerStatus(id, status);
            redirectAttributes.addFlashAttribute("successMessage", "Seller approval status set to: " + status);
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/admin/sellers";
    }

    @GetMapping("/buyers")
    public String buyers(Model model) {
        List<Buyer> buyers = adminService.getAllBuyers();
        model.addAttribute("buyers", buyers);
        return "admin/buyers";
    }

    @PostMapping("/buyers/{id}/status")
    public String updateBuyerStatus(@PathVariable Long id,
                                    @RequestParam String status,
                                    RedirectAttributes redirectAttributes) {
        try {
            adminService.updateUserStatus(id, status);
            redirectAttributes.addFlashAttribute("successMessage", "Buyer user status updated to: " + status);
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/admin/buyers";
    }

    @GetMapping("/products")
    public String products(Model model) {
        List<Product> products = productService.getAllProductsForAdmin();
        model.addAttribute("products", products);
        return "admin/products";
    }

    @PostMapping("/products/delete/{id}")
    public String deleteProduct(@PathVariable Long id,
                                Authentication authentication,
                                RedirectAttributes redirectAttributes) {
        try {
            productService.deleteProduct(id, authentication.getName());
            redirectAttributes.addFlashAttribute("successMessage", "Product removed from marketplace.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/admin/products";
    }

    @GetMapping("/orders")
    public String orders(Model model) {
        List<Order> orders = orderService.getAllOrders();
        model.addAttribute("orders", orders);
        return "admin/orders";
    }

    @GetMapping("/reports")
    public String reports(Model model) {
        Map<String, Object> stats = adminService.getPlatformStats();
        List<Product> products = productService.getAllProductsForAdmin();
        List<Order> orders = orderService.getAllOrders();

        model.addAttribute("stats", stats);
        model.addAttribute("products", products);
        model.addAttribute("orders", orders);
        return "admin/reports";
    }

    @GetMapping("/profile")
    public String profile(Authentication authentication, Model model) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        model.addAttribute("user", user);
        return "admin/profile";
    }
}
