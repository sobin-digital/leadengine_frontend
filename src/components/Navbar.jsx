import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  // Close everything when a link is clicked
  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="nav-logo" onClick={closeMenus}>
          LeadEngine UAE
        </Link>
        
        <div className={`nav-links-wrapper ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenus}>Home</Link>
          
          <div 
            className="dropdown-container"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span 
              className="nav-link dropdown-toggle" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Services ▼
            </span>
            
            {(isDropdownOpen || isMobileMenuOpen) && (
              <div className="dropdown-menu">
                <Link to="/ac-repair-dubai" className="dropdown-link" onClick={closeMenus}>
                  <span className="dd-icon">❄️</span> AC Repair
                </Link>
                <Link to="/plumber-dubai" className="dropdown-link" onClick={closeMenus}>
                  <span className="dd-icon">🔧</span> Plumbing
                </Link>
                <Link to="/cleaning-dubai" className="dropdown-link" onClick={closeMenus}>
                  <span className="dd-icon">🧹</span> Cleaning
                </Link>
                <Link to="/car-recovery-dubai" className="dropdown-link" onClick={closeMenus}>
                  <span className="dd-icon">🚗</span> Car Recovery
                </Link>
                <Link to="/electrician-dubai" className="dropdown-link" onClick={closeMenus}>
                  <span className="dd-icon">🔌</span> Electrician Services
                </Link>
                <Link to="/appliance-repair-dubai" className="dropdown-link" onClick={closeMenus}>
                  <span className="dd-icon">📺</span> Home Appliance Repair
                </Link>
              </div>
            )}
          </div>
          
          <Link to="/contact" className="nav-link" onClick={closeMenus}>Contact</Link>
          <Link to="/provider/login" className="nav-link vendor-btn" onClick={closeMenus}>Vendor Portal</Link>
        </div>
        
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
