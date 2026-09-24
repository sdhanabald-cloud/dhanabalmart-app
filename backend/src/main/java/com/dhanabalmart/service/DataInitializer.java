package com.dhanabalmart.service;

import com.dhanabalmart.model.*;
import com.dhanabalmart.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final SellerRepository sellerRepository;
    private final BuyerRepository buyerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           AdminRepository adminRepository,
                           SellerRepository sellerRepository,
                           BuyerRepository buyerRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           CartRepository cartRepository,
                           OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository,
                           PaymentRepository paymentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.sellerRepository = sellerRepository;
        this.buyerRepository = buyerRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("DhanabalMart database already seeded. Skipping initial seeding.");
            return;
        }

        log.info("Initializing DhanabalMart seed data with Admin, Sellers, Buyers, Categories, and Products...");

        // 1. Seed Admin
        User adminUser = new User(
                "admin@dhanabalmart.com",
                passwordEncoder.encode("Admin@123"),
                "Dhanabal Admin",
                "+91 98765 00001",
                Role.ROLE_ADMIN,
                "ACTIVE"
        );
        adminUser = userRepository.save(adminUser);
        adminRepository.save(new Admin(adminUser, "Platform Administration", "ALL_PRIVILEGES"));

        // 2. Seed Sellers
        User sellerUser1 = new User(
                "seller1@dhanabalmart.com",
                passwordEncoder.encode("Seller@123"),
                "Ramesh Sundaram",
                "+91 98765 11111",
                Role.ROLE_SELLER,
                "ACTIVE"
        );
        sellerUser1 = userRepository.save(sellerUser1);
        Seller seller1 = sellerRepository.save(new Seller(
                sellerUser1,
                "Royal Kanchipuram Silks",
                "12 Weaver Street, Kanchipuram, Tamil Nadu",
                "GSTIN33ABCDE1234F1Z5",
                "APPROVED"
        ));

        User sellerUser2 = new User(
                "seller2@dhanabalmart.com",
                passwordEncoder.encode("Seller@123"),
                "Dr. Meera Nambiar",
                "+91 98765 22222",
                Role.ROLE_SELLER,
                "ACTIVE"
        );
        sellerUser2 = userRepository.save(sellerUser2);
        Seller seller2 = sellerRepository.save(new Seller(
                sellerUser2,
                "Vedic Spices & Botanicals",
                "45 Plantation Hills, Munnar, Kerala",
                "GSTIN32XYZPQ9876A2B1",
                "APPROVED"
        ));

        User sellerUser3 = new User(
                "seller3@dhanabalmart.com",
                passwordEncoder.encode("Seller@123"),
                "Vikramaditya Roy",
                "+91 98765 33333",
                Role.ROLE_SELLER,
                "ACTIVE"
        );
        sellerUser3 = userRepository.save(sellerUser3);
        Seller seller3 = sellerRepository.save(new Seller(
                sellerUser3,
                "Thanjavur Brass & Bronze Crafts",
                "88 Artisan Lane, Thanjavur, Tamil Nadu",
                "GSTIN33TANJU4455C3D2",
                "PENDING" // Pending approval for testing admin approval
        ));

        // 3. Seed Buyers
        User buyerUser1 = new User(
                "buyer1@gmail.com",
                passwordEncoder.encode("Buyer@123"),
                "Aarav Sharma",
                "+91 98765 44444",
                Role.ROLE_BUYER,
                "ACTIVE"
        );
        buyerUser1 = userRepository.save(buyerUser1);
        Buyer buyer1 = buyerRepository.save(new Buyer(
                buyerUser1,
                "Flat 402, Peacock Heights, Jubilee Hills",
                "Hyderabad",
                "500033"
        ));
        cartRepository.save(new Cart(buyer1));

        User buyerUser2 = new User(
                "buyer2@gmail.com",
                passwordEncoder.encode("Buyer@123"),
                "Ananya Krishnan",
                "+91 98765 55555",
                Role.ROLE_BUYER,
                "ACTIVE"
        );
        buyerUser2 = userRepository.save(buyerUser2);
        Buyer buyer2 = buyerRepository.save(new Buyer(
                buyerUser2,
                "78 Coral Reef Boulevard, Adyar",
                "Chennai",
                "600020"
        ));
        cartRepository.save(new Cart(buyer2));

        // 4. Seed Categories
        Category catSilks = categoryRepository.save(new Category(
                "Pure Silk & Handlooms",
                "pure-silk-handlooms",
                "Authentic Kanchipuram, Banarasi, and Chanderi pure silk handlooms with gold zari.",
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
        ));

        Category catSpices = categoryRepository.save(new Category(
                "Estate Spices & Groceries",
                "estate-spices-groceries",
                "Single-origin Malabar black pepper, Idukki green cardamom, and organic hill honey.",
                "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
        ));

        Category catDecor = categoryRepository.save(new Category(
                "Heritage Handcrafts & Decor",
                "heritage-handcrafts-decor",
                "Cast bronze Nataraja idols, temple lamps (Diyas), and Thanjavur gold foil art.",
                "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80"
        ));

        Category catWellness = categoryRepository.save(new Category(
                "Ayurveda & Herbal Wellness",
                "ayurveda-herbal-wellness",
                "Cold-pressed virgin coconut oils, saffron face serums, and pure botanical powders.",
                "https://images.unsplash.com/photo-1608248597359-25143a5796d1?auto=format&fit=crop&w=600&q=80"
        ));

        Category catJewelry = categoryRepository.save(new Category(
                "Temple Jewelry & Gold Works",
                "temple-jewelry-gold-works",
                "Kemp stone encrusted heritage jewelry, antique chokers, and handcrafted jhumkas.",
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
        ));

        // 5. Seed 12+ Products
        List<Product> products = new ArrayList<>();

        products.add(new Product(
                seller1, catSilks,
                "Kanchipuram Peacock Blue Pure Silk Saree",
                "Woven with 100% pure Mulberry silk featuring intricate metallic gold zari peacocks and rich crimson border.",
                new BigDecimal("12499.00"), 15,
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller1, catSilks,
                "Emerald Green Bridal Tissue Banarasi Saree",
                "Regal lightweight metallic tissue saree with floral kadwa brocade motifs in antique gold luster.",
                new BigDecimal("14999.00"), 8,
                "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller1, catSilks,
                "Crimson & Olive Hand-Dyed Tussar Silk Dupatta",
                "Tribal Kantha hand embroidery on wild organic tussar silk. Soft drape, luxurious texture.",
                new BigDecimal("3299.00"), 25,
                "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller2, catSpices,
                "Tellicherry Garbled Extra Bold Black Pepper (500g)",
                "The finest harvest of Malabar pepper, handpicked at peak ripeness for intense citrus aroma and pungent kick.",
                new BigDecimal("799.00"), 100,
                "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller2, catSpices,
                "Idukki Premium Green Cardamom 8mm Pods (250g)",
                "Naturally shadow-dried emerald cardamom pods boasting high essential oil content and vibrant fragrance.",
                new BigDecimal("949.00"), 60,
                "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller2, catSpices,
                "Wild Raw Forest Honey from Western Ghats (1000g)",
                "Unheated, unfiltered multi-floral raw honey harvested sustainably by indigenous tribals.",
                new BigDecimal("1150.00"), 45,
                "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller2, catWellness,
                "Cold-Pressed Kerala Virgin Coconut Oil (1L)",
                "Extracted from fresh coconut milk using traditional expeller pressing. Ideal for skin, hair, and cooking.",
                new BigDecimal("599.00"), 80,
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller2, catWellness,
                "Kashmir Mogra Saffron (Grade A1 - 2g)",
                "Certified ISO Grade 1 pure red stigma saffron with deep coloring power and therapeutic crocin levels.",
                new BigDecimal("1299.00"), 30,
                "https://images.unsplash.com/photo-1608248597359-25143a5796d1?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller1, catDecor,
                "Handcrafted Brass Peacock Hanging Oil Diya",
                "Traditional hanging deepam crafted by master metalsmiths with solid brass chain and oil reservoir.",
                new BigDecimal("2499.00"), 20,
                "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller1, catDecor,
                "Authentic 22K Gold Foil Thanjavur Painting (Lord Ganesha)",
                "Created on seasoned teakwood board using semi-precious Jaipur gems, French chalk, and genuine 22K gold leaf.",
                new BigDecimal("8999.00"), 5,
                "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller1, catJewelry,
                "Heritage 24K Gold-Dipped Kemp Temple Choker",
                "Handmade silver-based antique necklace encrusted with ruby red kemp stones and natural freshwater pearls.",
                new BigDecimal("6899.00"), 12,
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        products.add(new Product(
                seller1, catJewelry,
                "Peacock Motif Gold Plated Jhumka Earrings",
                "Artisan temple bells with fine filigree work and cascading emerald green glass drops.",
                new BigDecimal("1899.00"), 40,
                "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
                "ACTIVE"
        ));

        productRepository.saveAll(products);

        // 6. Seed Sample Order for Buyer 1
        Order sampleOrder = new Order(
                buyer1,
                "DBM-20260924-1001",
                new BigDecimal("13298.00"),
                buyer1.getShippingAddress() + ", " + buyer1.getCity() + " - " + buyer1.getPostalCode(),
                "SHIPPED",
                "PAID"
        );
        sampleOrder = orderRepository.save(sampleOrder);

        OrderItem item1 = new OrderItem(
                sampleOrder,
                products.get(0), // Saree
                seller1,
                1,
                products.get(0).getPrice(),
                products.get(0).getPrice()
        );
        OrderItem item2 = new OrderItem(
                sampleOrder,
                products.get(3), // Black Pepper
                seller2,
                1,
                products.get(3).getPrice(),
                products.get(3).getPrice()
        );
        orderItemRepository.save(item1);
        orderItemRepository.save(item2);

        Payment payment = new Payment(
                sampleOrder,
                "UPI",
                "TXN-DEMO-998877",
                new BigDecimal("13298.00"),
                "COMPLETED"
        );
        paymentRepository.save(payment);

        log.info("DhanabalMart seed data successfully loaded!");
    }
}
