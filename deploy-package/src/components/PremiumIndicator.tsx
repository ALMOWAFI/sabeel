import React, { useEffect, useState } from 'react';
import { Shield, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PremiumIndicator = () => {
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated as premium
    const authStatus = sessionStorage.getItem('member-authenticated');
    setIsPremium(authStatus === 'premium');
  }, []);

  if (!isPremium) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-xs"
      onClick={() => navigate('/secret-organization')}
    >
      <Shield className="h-3 w-3" />
      <span>المنظمة السرية</span>
      <Key className="h-3 w-3 ml-1" />
    </motion.div>
  );
};

export default PremiumIndicator;