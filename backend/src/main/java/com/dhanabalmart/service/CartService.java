package com.dhanabalmart.service;

import com.dhanabalmart.dto.AddToCartRequest;
import com.dhanabalmart.dto.UpdateCartItemRequest;
import com.dhanabalmart.model.*;
import com.dhanabalmart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final BuyerRepository buyerRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       BuyerRepository buyerRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.buyerRepository = buyerRepository;
        this.userRepository = userRepository;
    }

    public Cart getOrCreateCart(String buyerEmail) {
        User user = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + buyerEmail));
        Buyer buyer = buyerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Buyer profile not found for user: " + buyerEmail));

        return cartRepository.findByBuyerId(buyer.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart(buyer);
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public Cart addToCart(String buyerEmail, AddToCartRequest request) {
        Cart cart = getOrCreateCart(buyerEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + request.getProductId()));

        if (!"ACTIVE".equalsIgnoreCase(product.getStatus()) || product.getStockQuantity() <= 0) {
            throw new IllegalArgumentException("Product is currently out of stock or unavailable");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Cannot add more than available stock (" + product.getStockQuantity() + ")");
            }
            item.setQuantity(newQuantity);
            item.setPriceAtAddition(product.getPrice());
            cartItemRepository.save(item);
        } else {
            if (request.getQuantity() > product.getStockQuantity()) {
                throw new IllegalArgumentException("Cannot add more than available stock (" + product.getStockQuantity() + ")");
            }
            CartItem newItem = new CartItem(cart, product, request.getQuantity(), product.getPrice());
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItemQuantity(String buyerEmail, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(buyerEmail);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found with ID: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Item does not belong to your cart");
        }

        if (request.getQuantity() <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            Product product = item.getProduct();
            if (request.getQuantity() > product.getStockQuantity()) {
                throw new IllegalArgumentException("Cannot request more than available stock (" + product.getStockQuantity() + ")");
            }
            item.setQuantity(request.getQuantity());
            cartItemRepository.save(item);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(String buyerEmail, Long itemId) {
        Cart cart = getOrCreateCart(buyerEmail);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found with ID: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Item does not belong to your cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String buyerEmail) {
        Cart cart = getOrCreateCart(buyerEmail);
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.save(cart);
    }
}
