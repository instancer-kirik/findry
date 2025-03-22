
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight">TandemX</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/artists" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Artists
            </Link>
            <Link to="/groups" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Groups
            </Link>
            <Link to="/venues" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Venues
            </Link>
            <Link to="/discover" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Discover
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium bg-white dark:bg-black border border-border rounded-full shadow-sm hover:bg-secondary transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black rounded-full shadow-sm hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </nav>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden flex items-center p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={`fixed inset-0 z-40 bg-white dark:bg-black flex flex-col pt-20 px-4 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col space-y-6 py-8">
          <Link 
            to="/artists" 
            className="text-lg font-medium py-2 border-b border-border"
            onClick={() => setMobileMenuOpen(false)}
          >
            Artists
          </Link>
          <Link 
            to="/groups" 
            className="text-lg font-medium py-2 border-b border-border"
            onClick={() => setMobileMenuOpen(false)}
          >
            Groups
          </Link>
          <Link 
            to="/venues" 
            className="text-lg font-medium py-2 border-b border-border"
            onClick={() => setMobileMenuOpen(false)}
          >
            Venues
          </Link>
          <Link 
            to="/discover" 
            className="text-lg font-medium py-2 border-b border-border"
            onClick={() => setMobileMenuOpen(false)}
          >
            Discover
          </Link>
          <div className="flex flex-col space-y-4 pt-4">
            <Link 
              to="/login" 
              className="w-full py-3 text-center text-foreground bg-background border border-border rounded-full shadow-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="w-full py-3 text-center text-white bg-black dark:bg-white dark:text-black rounded-full shadow-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
