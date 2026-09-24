import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Shield, Compass, ShoppingBag } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setFeaturedProducts(prodRes.data.slice(0, 6));
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 6rem',
        background: 'radial-gradient(circle at 50% 30%, rgba(11, 79, 79, 0.7) 0%, rgba(6, 55, 55, 0.95) 70%, var(--color-peacock-dark) 100%)',
        borderBottom: 'var(--gold-border)',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative gold circle */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-gold" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
              <Sparkles size={14} /> The Grand Marketplace
            </span>
          </div>

          <h1 className="gold-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: '1.2', marginBottom: '1.5rem', fontWeight: '900' }}>
            Curated Elegance & Heritage Crafts
          </h1>

          <p style={{
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--color-light-pink)',
            lineHeight: '1.7'
          }}>
            Discover authentic pure silk handlooms, estate-harvested spices, sacred bronze metalcraft, and certified Ayurvedic remedies directly from verified master artisans.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-gold" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              <ShoppingBag size={20} />
              <span>Explore Marketplace</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login/seller" className="btn btn-brown" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              <span>Become a Verified Seller</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-pink" style={{ marginBottom: '0.5rem' }}>Handpicked Collections</span>
              <h2 className="gold-heading" style={{ fontSize: '2rem' }}>Featured Categories</h2>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              View All Categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="dm-card"
                style={{
                  textDecoration: 'none',
                  position: 'relative',
                  height: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  backgroundImage: `linear-gradient(to top, rgba(6, 55, 55, 0.95) 20%, rgba(6, 55, 55, 0.3) 70%, transparent 100%), url(${cat.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  overflow: 'hidden'
                }}
              >
                <div style={{ zIndex: 2 }}>
                  <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
                    {cat.name}
                  </h3>
                  <p style={{ color: 'var(--color-light-pink)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section style={{ padding: '3rem 0 5rem', backgroundColor: 'rgba(3, 33, 33, 0.5)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Trending Now</span>
            <h2 className="gold-heading" style={{ fontSize: '2.4rem' }}>Popular Across DhanabalMart</h2>
            <p style={{ color: 'var(--color-light-pink)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Handcrafted with devotion, verified for purity, and shipped with care.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gold)' }}>
              Loading products from database...
            </div>
          ) : (
            <div className="grid grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/products" className="btn btn-gold" style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem' }}>
              Browse Complete Catalog <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Architecture Showcase */}
      <section style={{ padding: '5rem 0', borderTop: 'var(--gold-border)' }}>
        <div className="container">
          <div className="dm-card-glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '960px', margin: '0 auto' }}>
            <span className="badge badge-olive" style={{ marginBottom: '1rem' }}>Full-Stack Capstone Architecture</span>
            <h2 className="gold-heading" style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
              Engineered for Production & Scale
            </h2>
            <p style={{ color: 'var(--color-light-pink)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              DhanabalMart is crafted with a high-performance <strong>Java Spring Boot 3</strong> backend, a reactive <strong>React & Vite</strong> single-page application, and an enterprise <strong>PostgreSQL</strong> relational database schema. Deployed effortlessly using a multi-stage Docker build on <strong>Render</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/login/admin" className="btn btn-outline">
                <Shield size={16} /> Admin Portal
              </Link>
              <Link to="/login/seller" className="btn btn-outline">
                <Compass size={16} /> Seller Gateway
              </Link>
              <Link to="/login/buyer" className="btn btn-outline">
                <ShoppingBag size={16} /> Buyer Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
