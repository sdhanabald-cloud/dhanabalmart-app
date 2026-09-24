import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Database, Server, Globe, Cpu, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
        <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>Our Heritage & Vision</span>
        <h1 className="gold-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '1.25rem' }}>
          About DhanabalMart
        </h1>
        <p style={{ color: 'var(--color-light-pink)', fontSize: '1.15rem', lineHeight: '1.8' }}>
          DhanabalMart is an enterprise full-stack e-commerce marketplace dedicated to celebrating authentic regional craftmanship, pure agricultural produce, and handloom traditions.
        </p>
      </div>

      {/* Mission Grid */}
      <div className="grid grid-cols-2" style={{ gap: '2.5rem', marginBottom: '5rem' }}>
        <div className="dm-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ color: 'var(--color-gold)', fontSize: '1.6rem', marginBottom: '1rem' }}>
            Empowering Verified Artisans
          </h2>
          <p style={{ color: 'var(--text-dim)', lineHeight: '1.8', marginBottom: '1.25rem' }}>
            Historically, independent weavers and agrarian producers have faced intermediary markups and limited market access. DhanabalMart provides them with a dedicated seller portal to publish catalogs, track inventory, and connect directly with buyers nationwide.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-light-pink)' }}>
              <CheckCircle size={18} color="var(--color-olive)" /> Zero unfair middleman markups
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-light-pink)' }}>
              <CheckCircle size={18} color="var(--color-olive)" /> Transparent inventory and stock management
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-light-pink)' }}>
              <CheckCircle size={18} color="var(--color-olive)" /> Real-time order fulfillment updates
            </li>
          </ul>
        </div>

        <div className="dm-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ color: 'var(--color-gold)', fontSize: '1.6rem', marginBottom: '1rem' }}>
            Uncompromising Buyer Trust
          </h2>
          <p style={{ color: 'var(--text-dim)', lineHeight: '1.8', marginBottom: '1.25rem' }}>
            Every product on DhanabalMart undergoes strict verification. From pure Kanchipuram silk certified with silk marks to organic spices harvested at estate peaks, our buyers receive authentic goods delivered safely to their doorsteps.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-light-pink)' }}>
              <CheckCircle size={18} color="var(--color-gold)" /> Verified seller onboarding and admin approvals
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-light-pink)' }}>
              <CheckCircle size={18} color="var(--color-gold)" /> End-to-end order tracking and transaction history
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-light-pink)' }}>
              <CheckCircle size={18} color="var(--color-gold)" /> Secure JWT-authenticated shopping environment
            </li>
          </ul>
        </div>
      </div>

      {/* Technical Architecture Section */}
      <div className="dm-card-glass" style={{ padding: '3rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-olive" style={{ marginBottom: '0.5rem' }}>Architecture Blueprint</span>
          <h2 className="gold-heading" style={{ fontSize: '2rem' }}>Production Technology Stack</h2>
        </div>

        <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ color: 'var(--color-gold)', marginBottom: '0.75rem' }}><Server size={36} /></div>
            <h4 style={{ color: '#FFF', marginBottom: '0.4rem' }}>Java Spring Boot 3</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Robust REST API with Spring Security and JJWT authentication</p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ color: 'var(--color-gold)', marginBottom: '0.75rem' }}><Globe size={36} /></div>
            <h4 style={{ color: '#FFF', marginBottom: '0.4rem' }}>React + Vite</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Responsive SPA styled with Peacock Green & Metallic Gold palette</p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ color: 'var(--color-gold)', marginBottom: '0.75rem' }}><Database size={36} /></div>
            <h4 style={{ color: '#FFF', marginBottom: '0.4rem' }}>PostgreSQL Relational DB</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Normalized schema, foreign keys, cascade deletes, and indexes</p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ color: 'var(--color-gold)', marginBottom: '0.75rem' }}><Cpu size={36} /></div>
            <h4 style={{ color: '#FFF', marginBottom: '0.4rem' }}>Docker & Render</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Multi-stage production build running seamlessly on dynamic PORT</p>
          </div>
        </div>
      </div>

      {/* Portal Gateway Links */}
      <div style={{ textAlign: 'center' }}>
        <h3 className="gold-heading" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          Access Your Portal
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/login/buyer" className="btn btn-gold">Buyer Sign In</Link>
          <Link to="/login/seller" className="btn btn-brown">Seller Sign In</Link>
          <Link to="/login/admin" className="btn btn-outline">Admin Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
