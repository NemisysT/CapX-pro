'use client'

import { ArrowRight, BarChart2, DollarSign, Edit3, PieChart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between p-6 border-b bg-white shadow-md fixed w-full z-10"
      >
        <div className="text-3xl font-extrabold text-blue-600">CapX</div>
        <div>
          <Button variant="outline" className="mr-4 hover:shadow-lg" onClick={() => router.push('/login')}>Login</Button>
          <Button className="hover:shadow-lg bg-blue-600 text-white" onClick={() => router.push('/signup')}>Sign up</Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-6xl font-bold mb-6"
        >
          Manage Your <span className="text-blue-600">Stock Portfolio</span> with Ease
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl mb-8"
        >
          Track, analyze, and optimize your investments in real-time.
        </motion.p>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button size="lg" className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700" onClick={() => router.push('/dashboard')}>
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[{
              icon: <Edit3 className="h-10 w-10 text-blue-600" />, title: "Manage Holdings", description: "Add, view, edit, and delete your stock holdings with ease."
            }, {
              icon: <DollarSign className="h-10 w-10 text-blue-600" />, title: "Real-time Tracking", description: "Track your total portfolio value based on real-time stock prices."
            }, {
              icon: <BarChart2 className="h-10 w-10 text-blue-600" />, title: "Portfolio Metrics", description: "View key metrics like total value and top-performing stocks."
            }, {
              icon: <PieChart className="h-10 w-10 text-blue-600" />, title: "Portfolio Distribution", description: "Visualize your portfolio distribution for better insights."
            }].map((feature, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 bg-white shadow-lg rounded-xl flex items-center space-x-4 hover:shadow-2xl transition-all"
              >
                {feature.icon}
                <div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <motion.h2 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4"
        >
          Ready to Take Control of Your Investments?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl mb-8"
        >
          Join CapX today and start optimizing your stock portfolio.
        </motion.p>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button size="lg" className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700" onClick={() => router.push('/signup')}>
            Create Your Free Account <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

