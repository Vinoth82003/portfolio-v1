'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When path changes, start loading
    setLoading(true);
    
    // Simulate initial loading completion or actual finish
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // Very fast as Next.js handles most things, this is for visual feedback

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          exit={{ opacity: 0 }}
          transition={{ 
            width: { duration: 0.3, ease: 'easeIn' },
            opacity: { duration: 0.2 }
          }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-accent z-[9999] shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
        />
      )}
    </AnimatePresence>
  );
}
