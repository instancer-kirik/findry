import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768); // Consider mobile if width is less than md breakpoint
      };
      
      // Initial check
      checkMobile();
      
      // Add event listener for resize
      window.addEventListener('resize', checkMobile);
      
      // Clean up event listener
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);
  
  return isMobile;
} 