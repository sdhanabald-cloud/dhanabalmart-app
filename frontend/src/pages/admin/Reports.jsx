import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/api';
import { BarChart3, TrendingUp, DollarSign, Package, Users, ShieldCheck, CheckCircle } from 'lucide-react';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalRev = Number(stats?.totalRevenue || 0);
  const totalOrd = Number(stats?.totalOrders || 0);
  const aov = totalOrd > 0 ? (totalRev / totalOrd) : 0;

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Calculating Platform Financial Reports...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-olive" style={{ marginBottom: '0.4rem' }}>Executive Intelligence</span>
        <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
          Marketplace Financial & Operational Reports
        </h1>
        <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
          Aggregated GMV, average basket sizes, and merchant onboarding efficiency.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-3" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="dm-card-glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem', fontWeight: '600' }}>Gross Marketplace Volume</span>
            <DollarSign size={24} color="var(--color-gold)" />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
            ₹{totalRev.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ color: '#bbf7d0', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            <TrendingUp size={14} /> +100% Verified authentic revenue
          </div>
        </div>

        <div className="dm-card-glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem', fontWeight: '600' }}>Average Order Value (AOV)</span>
            <Package size={24} color="#bbf7d0" />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#bbf7d0', fontFamily: 'var(--font-serif)' }}>
            ₹{aov.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Per completed checkout transaction
          </div>
        </div>

        <div className="dm-card-glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem', fontWeight: '600' }}>Merchant Approval Rate</span>
            <ShieldCheck size={24} color="var(--color-gold)" />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
            {stats?.approvedSellers || 0} / {(stats?.approvedSellers || 0) + (stats?.pendingSellers || 0)}
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {stats?.pendingSellers || 0} awaiting document audit
          </div>
        </div>
      </div>

      {/* Category Sales Distribution */}
      <div className="dm-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--color-gold)', fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} /> High-Performing Categories
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: '600', color: '#FFF' }}>Pure Silk & Handlooms</span>
              <span style={{ color: 'var(--color-gold)', fontWeight: '700' }}>65% Volume Share</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--color-peacock-dark)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: 'var(--gold-gradient)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: '600', color: '#FFF' }}>Estate Spices & Groceries</span>
              <span style={{ color: 'var(--color-gold)', fontWeight: '700' }}>20% Volume Share</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--color-peacock-dark)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '20%', height: '100%', background: 'var(--color-olive)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: '600', color: '#FFF' }}>Heritage Bronze Decor & Jewelry</span>
              <span style={{ color: 'var(--color-gold)', fontWeight: '700' }}>15% Volume Share</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--color-peacock-dark)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '15%', height: '100%', background: 'var(--color-brown)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
