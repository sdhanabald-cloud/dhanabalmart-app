import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [sortBy, setSortBy] = useState('newest');

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.categoryId = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const [prodRes, catRes] = await Promise.all([
        getProducts(params),
        getCategories()
      ]);

      let items = prodRes.data;

      // Apply client-side sorting
      if (sortBy === 'price-low') {
        items.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortBy === 'price-high') {
        items.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sortBy === 'name') {
        items.sort((a, b) => a.name.localeCompare(b.name));
      }

      setProducts(items);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCatalog();
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId) {
      setSearchParams({ categoryId: catId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Full Marketplace Catalog</span>
        <h1 className="gold-heading" style={{ fontSize: '2.5rem' }}>
          Discover Mastercrafted Treasures
        </h1>
        <p style={{ color: 'var(--color-light-pink)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Authentic silks, estate spices, handmade bronze decor, and sacred wellness essentials.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="dm-card" style={{ marginBottom: '2.5rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 300px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search products by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <button type="submit" className="btn btn-gold btn-sm" style={{ padding: '0.5rem 1.25rem' }}>
              Search
            </button>
          </form>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={16} color="var(--color-gold)" />
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '180px', padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value="newest">Featured & Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(232, 201, 207, 0.15)' }}>
          <button
            onClick={() => handleCategoryChange('')}
            className={`btn btn-sm ${selectedCategory === '' ? 'btn-gold' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(String(cat.id))}
              className={`btn btn-sm ${String(selectedCategory) === String(cat.id) ? 'btn-gold' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gold)' }}>
          <RefreshCw size={32} className="spin" style={{ marginBottom: '1rem' }} />
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>Loading DhanabalMart catalog...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="dm-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
            We could not find any products matching your current search or category filter.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory(''); }}
            className="btn btn-gold btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
            <span>Showing <strong>{products.length}</strong> authentic products</span>
          </div>

          <div className="grid grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
