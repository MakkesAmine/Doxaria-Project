"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { Pill, Stethoscope, BrainCircuit, Sparkles, Bot, CalendarCheck, ShieldCheck, TestTube2 } from "lucide-react"

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D1674] to-[#E0F7FA]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#00B4FF]/10"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <header className="container mx-auto px-4 py-8 relative z-10">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="lg" className="text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-3"
          >
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-[#00B4FF] hover:bg-[#008ACC] shadow-lg hover:shadow-[#00B4FF]/30">
              <Link href="/signup">Get Started</Link>
            </Button>
          </motion.div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-16 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn}>
            <div className="inline-flex items-center bg-[#00B4FF]/10 px-4 py-2 rounded-full mb-4 border border-[#00B4FF]/30">
              <Sparkles className="h-4 w-4 mr-2 text-[#00B4FF]" />
              <span className="text-sm text-[#00B4FF]">AI-Powered Prescription Management</span>
            </div>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl font-bold mb-6 text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00B4FF]">
              Revolutionizing
            </span> Your Medication Experience
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-xl mb-8 text-gray-200">
            Doxaria combines artificial intelligence with healthcare expertise to transform how you manage prescriptions, 
            medications, and overall wellness.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex justify-center gap-4">
            <Button size="lg" className="bg-[#00B4FF] hover:bg-[#008ACC] shadow-lg">
              Start Free Trial
            </Button>
            <Button size="lg"  className="text-white border-white hover:bg-white/10">
              See How It Works
            </Button>
          </motion.div>
          
          <motion.div variants={fadeIn} className="mt-12 relative">
            <div className="absolute -inset-4 bg-[#00B4FF]/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1">
              <div className="bg-gradient-to-br from-[#2D1674] to-[#4A1FB8] rounded-lg p-8">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#00B4FF]/10 p-4 rounded-full">
                    <Pill className="h-10 w-10 text-[#00B4FF]" />
                  </div>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Your Digital Prescription Hub</h3>
                <p className="text-gray-300">Upload, organize, and manage all your prescriptions in one secure place</p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Smart Healthcare Features</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Designed with cutting-edge technology to simplify your healthcare journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeIn}>
              <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00B4FF]/30 transition-all">
                <CardHeader>
                  <div className="bg-[#00B4FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Pill className="h-5 w-5 text-[#00B4FF]" />
                  </div>
                  <CardTitle className="text-white">Prescription Digitization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Snap a photo of your prescription and our AI instantly converts it to a digital, searchable format.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00B4FF]/30 transition-all">
                <CardHeader>
                  <div className="bg-[#00B4FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <BrainCircuit className="h-5 w-5 text-[#00B4FF]" />
                  </div>
                  <CardTitle className="text-white">AI Medication Advisor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Get personalized recommendations for alternative medications and potential interactions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00B4FF]/30 transition-all">
                <CardHeader>
                  <div className="bg-[#00B4FF]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <CalendarCheck className="h-5 w-5 text-[#00B4FF]" />
                  </div>
                  <CardTitle className="text-white">Smart Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Never miss a dose with our intelligent medication reminders and refill alerts.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">How Doxaria Works</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Three simple steps to transform your medication management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-[#00B4FF]/10 p-5 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[#00B4FF]">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Upload</h3>
              <p className="text-gray-300">
                Take a photo of your prescription or upload existing medical documents
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-[#00B4FF]/10 p-5 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[#00B4FF]">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Analyze</h3>
              <p className="text-gray-300">
                Our AI processes and organizes your medical information securely
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-[#00B4FF]/10 p-5 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[#00B4FF]">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Manage</h3>
              <p className="text-gray-300">
                Access your digital health profile anytime, anywhere
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section 
          className="bg-white rounded-2xl p-8 mb-24 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-12 text-center text-[#2D1674]">Trusted by Patients & Professionals</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-[#00B4FF]/10 p-3 rounded-full">
                    <Stethoscope className="h-5 w-5 text-[#00B4FF]" />
                  </div>
                  <div>
                    <CardTitle>Dr. Sarah Johnson</CardTitle>
                    <CardDescription>Cardiologist</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-700">
                  "Doxaria has transformed how my patients manage their medications. The AI-powered interaction checks are a game-changer for patient safety."
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-[#00B4FF]/10 p-3 rounded-full">
                    <TestTube2 className="h-5 w-5 text-[#00B4FF]" />
                  </div>
                  <div>
                    <CardTitle>Michael Chen</CardTitle>
                    <CardDescription>Chronic Illness Patient</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-700">
                  "Managing multiple prescriptions used to be overwhelming. Doxaria's smart reminders and pharmacy locator have simplified my life."
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="bg-gradient-to-r from-[#00B4FF] to-[#2D1674] rounded-2xl p-12 text-center mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Healthcare Experience?</h3>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of users who are taking control of their medications with Doxaria
          </p>
          <Button 
            size="lg" 
            className="bg-white text-[#2D1674] hover:bg-white/90 shadow-lg text-lg font-semibold"
          >
            Get Started for Free
          </Button>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2D1674] text-white py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size="lg" className="mb-4" />
              <p className="text-gray-300">
                AI-powered prescription management for better health outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="hover:text-[#00B4FF]">Features</Link></li>
                <li><Link href="#" className="hover:text-[#00B4FF]">Pricing</Link></li>
                <li><Link href="#" className="hover:text-[#00B4FF]">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="hover:text-[#00B4FF]">About</Link></li>
                <li><Link href="#" className="hover:text-[#00B4FF]">Careers</Link></li>
                <li><Link href="#" className="hover:text-[#00B4FF]">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="hover:text-[#00B4FF]">Twitter</Link></li>
                <li><Link href="#" className="hover:text-[#00B4FF]">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-[#00B4FF]">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Doxaria. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}