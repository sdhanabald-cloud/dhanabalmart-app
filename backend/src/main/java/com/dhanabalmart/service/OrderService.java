package com.dhanabalmart.service;

import com.dhanabalmart.dto.CheckoutRequest;
import com.dhanabalmart.model.*;
import com.dhanabalmart.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final BuyerRepository buyerRepository;
    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        PaymentRepository paymentRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        BuyerRepository buyerRepository,
                        SellerRepository sellerRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.buyerRepository = buyerRepository;
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order checkout(String buyerEmail, CheckoutRequest request) {
        User user = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + buyerEmail));
        Buyer buyer = buyerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Buyer profile not found: " + buyerEmail));

        Cart cart = cartRepository.findByBuyerId(buyer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Shopping cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Shopping cart is empty. Please add products before checking out.");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        // Verify stock for all items first
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product '" + product.getName() + "'. Available: " + product.getStockQuantity());
            }
            BigDecimal itemTotal = item.getPriceAtAddition().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        // Generate clean Order Number: DBM-YYYYMMDD-XXXX
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String suffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String orderNumber = "DBM-" + dateStr + "-" + suffix;

        Order order = new Order(
                buyer,
                orderNumber,
                totalAmount,
                request.getShippingAddress() != null && !request.getShippingAddress().isBlank()
                        ? request.getShippingAddress()
                        : (buyer.getShippingAddress() != null ? buyer.getShippingAddress() : "Standard Address"),
                "PROCESSING",
                "PAID"
        );
        order = orderRepository.save(order);

        // Create OrderItems and deduct inventory
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            BigDecimal itemTotal = item.getPriceAtAddition().multiply(BigDecimal.valueOf(item.getQuantity()));

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getSeller(),
                    item.getQuantity(),
                    item.getPriceAtAddition(),
                    itemTotal
            );
            orderItemRepository.save(orderItem);
            order.getItems().add(orderItem);

            // Deduct inventory
            int updatedStock = product.getStockQuantity() - item.getQuantity();
            product.setStockQuantity(updatedStock);
            if (updatedStock <= 0) {
                product.setStatus("OUT_OF_STOCK");
            }
            productRepository.save(product);
        }

        // Create simulated Payment record
        String txnId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Payment payment = new Payment(
                order,
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD",
                txnId,
                totalAmount,
                "COMPLETED"
        );
        paymentRepository.save(payment);
        order.setPayment(payment);

        // Clear user cart
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.save(cart);

        return order;
    }

    public List<Order> getBuyerOrders(String buyerEmail) {
        User user = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + buyerEmail));
        Buyer buyer = buyerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Buyer profile not found: " + buyerEmail));

        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyer.getId());
    }

    public Order getOrderById(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        // Admin can view any order
        if (user.getRole() == Role.ROLE_ADMIN) {
            return order;
        }

        // Buyer can view their own order
        if (user.getRole() == Role.ROLE_BUYER) {
            if (!order.getBuyer().getUser().getId().equals(user.getId())) {
                throw new AccessDeniedException("Unauthorized to view this order");
            }
            return order;
        }

        // Seller can view if their products are in the order
        if (user.getRole() == Role.ROLE_SELLER) {
            Seller seller = sellerRepository.findByUserId(user.getId()).orElse(null);
            if (seller != null) {
                boolean containsSellerProduct = order.getItems().stream()
                        .anyMatch(item -> item.getSeller().getId().equals(seller.getId()));
                if (containsSellerProduct) {
                    return order;
                }
            }
        }

        throw new AccessDeniedException("Unauthorized to view this order");
    }

    public List<OrderItem> getSellerOrders(String sellerEmail) {
        User user = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + sellerEmail));
        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Seller profile not found: " + sellerEmail));

        return orderItemRepository.findBySellerId(seller.getId());
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String userEmail, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseGet(() -> orderItemRepository.findById(orderId)
                        .map(OrderItem::getOrder)
                        .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId)));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        // Admin or Seller involved in the order can update status
        if (user.getRole() != Role.ROLE_ADMIN) {
            Seller seller = sellerRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new AccessDeniedException("Unauthorized"));
            boolean containsSellerProduct = order.getItems().stream()
                    .anyMatch(item -> item.getSeller().getId().equals(seller.getId()));
            if (!containsSellerProduct) {
                throw new AccessDeniedException("Unauthorized to update status of this order");
            }
        }

        order.setOrderStatus(newStatus.toUpperCase());
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
}
