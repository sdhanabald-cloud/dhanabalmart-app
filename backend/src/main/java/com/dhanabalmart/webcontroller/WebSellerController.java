package com.dhanabalmart.webcontroller;

import com.dhanabalmart.dto.ProductRequest;
import com.dhanabalmart.model.*;
import com.dhanabalmart.repository.CategoryRepository;
import com.dhanabalmart.repository.SellerRepository;
import com.dhanabalmart.repository.UserRepository;
import com.dhanabalmart.service.OrderService;
import com.dhanabalmart.service.ProductService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/seller")
public class WebSellerController {

    private final ProductService productService;
    private final OrderService orderService;
    private final CategoryRepository categoryRepository;
    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;

    public WebSellerController(ProductService productService,
                               OrderService orderService,
                               CategoryRepository categoryRepository,
                               SellerRepository sellerRepository,
                               UserRepository userRepository) {
        this.productService = productService;
        this.orderService = orderService;
        this.categoryRepository = categoryRepository;
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/seller";
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        Seller seller = user != null ? sellerRepository.findByUserId(user.getId()).orElse(null) : null;

        List<Product> products = productService.getProductsBySellerEmail(email);
        List<OrderItem> orderItems = orderService.getSellerOrders(email);

        BigDecimal totalSales = orderItems.stream()
                .map(item -> item.getTotalPrice() != null ? item.getTotalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long lowStockCount = products.stream().filter(p -> p.getStockQuantity() <= 5).count();

        model.addAttribute("seller", seller);
        model.addAttribute("productsCount", products.size());
        model.addAttribute("ordersCount", orderItems.size());
        model.addAttribute("totalSales", totalSales);
        model.addAttribute("lowStockCount", lowStockCount);
        model.addAttribute("recentItems", orderItems.stream().limit(5).toList());
        return "seller/dashboard";
    }

    @GetMapping("/products")
    public String products(Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/seller";
        List<Product> products = productService.getProductsBySellerEmail(authentication.getName());
        model.addAttribute("products", products);
        return "seller/products";
    }

    @GetMapping("/products/new")
    public String newProductForm(Model model) {
        model.addAttribute("product", new ProductRequest());
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("isEdit", false);
        return "seller/product-form";
    }

    @PostMapping("/products/new")
    public String createProduct(Authentication authentication,
                                @ModelAttribute ProductRequest request,
                                RedirectAttributes redirectAttributes,
                                Model model) {
        if (authentication == null) return "redirect:/login/seller";
        try {
            productService.createProduct(authentication.getName(), request);
            redirectAttributes.addFlashAttribute("successMessage", "Product created successfully!");
            return "redirect:/seller/products";
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("product", request);
            model.addAttribute("categories", categoryRepository.findAll());
            model.addAttribute("isEdit", false);
            return "seller/product-form";
        }
    }

    @GetMapping("/products/edit/{id}")
    public String editProductForm(@PathVariable Long id, Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/seller";
        try {
            Product product = productService.getProductById(id);
            ProductRequest form = new ProductRequest();
            form.setName(product.getName());
            form.setDescription(product.getDescription());
            form.setPrice(product.getPrice());
            form.setStockQuantity(product.getStockQuantity());
            form.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
            form.setImageUrl(product.getImageUrl());
            form.setStatus(product.getStatus());

            model.addAttribute("productId", id);
            model.addAttribute("product", form);
            model.addAttribute("categories", categoryRepository.findAll());
            model.addAttribute("isEdit", true);
            return "seller/product-form";
        } catch (Exception e) {
            return "redirect:/seller/products";
        }
    }

    @PostMapping("/products/edit/{id}")
    public String updateProduct(@PathVariable Long id,
                                Authentication authentication,
                                @ModelAttribute ProductRequest request,
                                RedirectAttributes redirectAttributes,
                                Model model) {
        if (authentication == null) return "redirect:/login/seller";
        try {
            productService.updateProduct(id, authentication.getName(), request);
            redirectAttributes.addFlashAttribute("successMessage", "Product updated successfully!");
            return "redirect:/seller/products";
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("productId", id);
            model.addAttribute("product", request);
            model.addAttribute("categories", categoryRepository.findAll());
            model.addAttribute("isEdit", true);
            return "seller/product-form";
        }
    }

    @PostMapping("/products/delete/{id}")
    public String deleteProduct(@PathVariable Long id,
                                Authentication authentication,
                                RedirectAttributes redirectAttributes) {
        if (authentication == null) return "redirect:/login/seller";
        try {
            productService.deleteProduct(id, authentication.getName());
            redirectAttributes.addFlashAttribute("successMessage", "Product deleted successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/seller/products";
    }

    @GetMapping("/orders")
    public String orders(Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/seller";
        List<OrderItem> items = orderService.getSellerOrders(authentication.getName());
        model.addAttribute("orderItems", items);
        return "seller/orders";
    }

    @PostMapping("/orders/{id}/status")
    public String updateOrderStatus(@PathVariable Long id,
                                    @RequestParam String status,
                                    Authentication authentication,
                                    RedirectAttributes redirectAttributes) {
        if (authentication == null) return "redirect:/login/seller";
        try {
            orderService.updateOrderStatus(id, authentication.getName(), status);
            redirectAttributes.addFlashAttribute("successMessage", "Order status updated to " + status);
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/seller/orders";
    }

    @GetMapping("/profile")
    public String profile(Authentication authentication, Model model) {
        if (authentication == null) return "redirect:/login/seller";
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Seller seller = sellerRepository.findByUserId(user.getId()).orElse(null);
        model.addAttribute("user", user);
        model.addAttribute("seller", seller);
        return "seller/profile";
    }

    @PostMapping("/profile")
    public String updateProfile(Authentication authentication,
                                @RequestParam String storeName,
                                @RequestParam String phone,
                                @RequestParam(required = false) String businessAddress,
                                @RequestParam(required = false) String taxId,
                                RedirectAttributes redirectAttributes) {
        if (authentication == null) return "redirect:/login/seller";
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        user.setPhone(phone.trim());
        userRepository.save(user);

        Seller seller = sellerRepository.findByUserId(user.getId()).orElse(null);
        if (seller != null) {
            seller.setStoreName(storeName.trim());
            seller.setBusinessAddress(businessAddress);
            seller.setTaxId(taxId);
            sellerRepository.save(seller);
        }
        redirectAttributes.addFlashAttribute("successMessage", "Seller profile updated successfully!");
        return "redirect:/seller/profile";
    }
}
