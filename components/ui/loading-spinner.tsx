import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-4 border-t-4 border-t-transparent border-golden rounded-full"
        />
    );
};

export default LoadingSpinner;
