'use client'

import { ArrowRight, BarChart2, DollarSign, Edit3, PieChart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 border-b">
        <div className="text-2xl font-bold">CapX</div>
        <div>
          <Button variant="outline" className="mr-2" onClick={() => router.push('/login')}>Login</Button>
          <Button onClick={() => router.push('/singup')}>Sign up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Manage Your Stock Portfolio with Ease</h1>
        <p className="text-xl mb-8">Track, analyze, and optimize your investments in real-time</p>
        <Button size="lg" onClick={() => router.push('/dashboard')}>
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard 
              icon={<Edit3 className="h-10 w-10" />}
              title="Manage Holdings"
              description="Add, view, edit, and delete your stock holdings with ease."
            />
            <FeatureCard 
              icon={<DollarSign className="h-10 w-10" />}
              title="Real-time Tracking"
              description="Track your total portfolio value based on real-time stock prices."
            />
            <FeatureCard 
              icon={<BarChart2 className="h-10 w-10" />}
              title="Portfolio Metrics"
              description="View key metrics like total value and top-performing stocks."
            />
            <FeatureCard 
              icon={<PieChart className="h-10 w-10" />}
              title="Portfolio Distribution"
              description="Visualize your portfolio distribution for better insights."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Investments?</h2>
        <p className="text-xl mb-8">Join CapX today and start optimizing your stock portfolio</p>
        <Button size="lg" onClick={() => router.push('/signup')}>
          Create Your Free Account
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  )
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

