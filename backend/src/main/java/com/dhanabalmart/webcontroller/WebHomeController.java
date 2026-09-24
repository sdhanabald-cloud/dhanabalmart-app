package com.dhanabalmart.webcontroller;

import com.dhanabalmart.model.Category;
import com.dhanabalmart.model.Product;
import com.dhanabalmart.repository.CategoryRepository;
import com.dhanabalmart.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class WebHomeController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;

    public WebHomeController(ProductService productService, CategoryRepository categoryRepository) {
        this.productService = productService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/")
    public String home(Model model) {
        List<Product> products = productService.getAllProducts(null, null);
        List<Category> categories = categoryRepository.findAll();
        // Featured products (top 8)
        List<Product> featured = products.stream().limit(8).toList();

        model.addAttribute("featuredProducts", featured);
        model.addAttribute("categories", categories);
        return "home";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }
}
