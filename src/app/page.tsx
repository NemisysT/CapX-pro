'use client'

import { ArrowRight, BarChart2, DollarSign, Edit3, PieChart, Cpu, Layers, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100 overflow-x-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
          className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-black opacity-30"
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -50,
              opacity: 0
            }}
            animate={{ 
              y: window.innerHeight + 50,
              x: Math.random() * window.innerWidth,
              opacity: [0, 0.5, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-gray-500 rounded-full"
          />
        ))}
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between p-6 border-b border-gray-800 bg-black/50 backdrop-blur-md fixed w-full z-20"
      >
        <div className="text-3xl font-extrabold text-gray-100 flex items-center">
          <Cpu className="mr-2 text-blue-400" />
          CapX
        </div>
        <div>
          <Button 
            variant="outline" 
            className="mr-4 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          <Button 
            className="bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300" 
            onClick={() => router.push('/signup')}
          >
            Sign up
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen text-center px-4 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-black/30 blur-3xl -z-10"
        />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        >
          Elevate Your <span className="text-gray-100">Stock Portfolio</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl mb-8 text-gray-400"
        >
          Cutting-edge investment management with real-time precision.
        </motion.p>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            size="lg" 
            className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 group"
            onClick={() => router.push('/dashboard')}
          >
            Get Started 
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
            Technological Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[{
              icon: <Edit3 className="h-10 w-10 text-blue-400" />, 
              title: "Advanced Portfolio Management", 
              description: "Sophisticated tools for precise stock holding management."
            }, {
              icon: <DollarSign className="h-10 w-10 text-green-400" />, 
              title: "Real-time Financial Intelligence", 
              description: "Instantaneous tracking of portfolio value with quantum-like precision."
            }, {
              icon: <BarChart2 className="h-10 w-10 text-purple-400" />, 
              title: "Comprehensive Portfolio Metrics", 
              description: "Deep analytical insights into your investment performance."
            }, {
              icon: <PieChart className="h-10 w-10 text-red-400" />, 
              title: "Intelligent Portfolio Visualization", 
              description: "Advanced graphical representation of your investment distribution."
            }].map((feature, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900 border border-gray-800 rounded-xl flex items-center space-x-4 hover:bg-gray-800 hover:border-blue-600 transition-all duration-300 group"
              >
                <div className="p-3 bg-gray-800 rounded-full group-hover:rotate-6 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-100">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 blur-2xl -z-10"
        />
        <motion.h2 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        >
          Your Financial Future Starts Now
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl mb-8 text-gray-400"
        >
          Unleash the power of intelligent investment management.
        </motion.p>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button 
            size="lg" 
            className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 group"
            onClick={() => router.push('/signup')}
          >
            Revolutionize Your Investments 
            <Zap className="ml-2 h-5 w-5 group-hover:scale-125 transition-transform" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}