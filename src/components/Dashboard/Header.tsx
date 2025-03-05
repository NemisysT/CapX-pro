import { User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-md border-b border-gray-700"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-300">CapX</h1>
      </div>
      <div className="flex items-center">
        <Link href='/user' className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-200">
          <User className="h-6 w-6 text-gray-300" />
        </Link>
      </div>
    </motion.header>
  );
}