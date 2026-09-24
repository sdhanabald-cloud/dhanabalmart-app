package com.dhanabalmart.webcontroller;

import com.dhanabalmart.model.Category;
import com.dhanabalmart.model.Product;
import com.dhanabalmart.repository.CategoryRepository;
import com.dhanabalmart.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class WebCatalogController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;

    public WebCatalogController(ProductService productService, CategoryRepository categoryRepository) {
        this.productService = productService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/products")
    public String products(@RequestParam(required = false) Long category,
                           @RequestParam(required = false) String search,
                           Model model) {
        List<Product> products = productService.getAllProducts(category, search);
        List<Category> categories = categoryRepository.findAll();

        model.addAttribute("products", products);
        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategory", category);
        model.addAttribute("searchTerm", search != null ? search : "");
        model.addAttribute("totalCount", products.size());
        return "products";
    }

    @GetMapping("/products/{id}")
    public String productDetails(@PathVariable Long id, Model model) {
        try {
            Product product = productService.getProductById(id);
            model.addAttribute("product", product);
            return "product-details";
        } catch (Exception e) {
            return "redirect:/products?error=ProductNotFound";
        }
    }
}
