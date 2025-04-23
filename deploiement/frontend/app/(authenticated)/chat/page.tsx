"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  AlertCircle, Brain, FileText, MessageCircle, PlusCircle, Pill, 
  Stethoscope, Clock,  HeartPulse, Heart, Activity, Zap, Bot, Syringe, 
  Shield, BrainCircuit, Microscope
} from "lucide-react"

interface Message {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: Date
  category?: "medication" | "interaction" | "side-effect" | "diagnosis" | "general"
  references?: string[]
  status?: "analyzing" | "verified" | "warning"
}

interface Suggestion {
  text: string
  category: string
  icon: JSX.Element
}

export default function MedicalAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm MedBot , your advanced medical AI assistant. I can analyze prescriptions, detect interactions, explain side effects, and provide evidence-based medical insights. How may I assist you today?",
      timestamp: new Date(),
      category: "general",
      status: "verified"
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activePulse, setActivePulse] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const suggestions: Suggestion[] = [
    { 
      text: "Analyze my current medications", 
      category: "medication",
      icon: <Pill className="h-4 w-4 text-purple-500" />
    },
    { 
      text: "Check for drug interactions", 
      category: "interaction",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />
    },
    { 
      text: "Explain possible side effects", 
      category: "side-effect",
      icon: <Stethoscope className="h-4 w-4 text-yellow-500" />
    },
    { 
      text: "Help interpret lab results", 
      category: "diagnosis",
      icon: <Microscope className="h-4 w-4 text-blue-500" />
    },
  ]

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsTyping(true)
      setActivePulse(true)

      // Simulate AI processing with different response times
      const processingTime = 1000 + Math.random() * 2000

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateMedicalResponse(input),
          timestamp: new Date(),
          category: determineCategory(input),
          status: Math.random() > 0.2 ? "verified" : "warning",
          references: [
            "National Institutes of Health Database",
            "Clinical Pharmacology Interactive",
            "UpToDate Medical Reference",
            "FDA Adverse Event Reporting System"
          ],
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
        setActivePulse(false)
      }, processingTime)
    }
  }

  const determineCategory = (query: string): "medication" | "interaction" | "side-effect" | "diagnosis" | "general" => {
    if (query.toLowerCase().includes("interaction")) return "interaction"
    if (query.toLowerCase().includes("side effect")) return "side-effect"
    if (query.toLowerCase().includes("medication") || query.toLowerCase().includes("prescription")) return "medication"
    if (query.toLowerCase().includes("lab") || query.toLowerCase().includes("result")) return "diagnosis"
    return "general"
  }

  const generateMedicalResponse = (query: string): string => {
    const responses = {
      medication: [
        "Based on your medication profile, I've analyzed your prescriptions. The optimal dosing schedule would be morning with breakfast and evening with dinner. Remember to stay hydrated.",
        "Your medication regimen has been cross-referenced with your health profile. No adjustments needed at this time. Continue as prescribed.",
        "Pharmaceutical analysis complete. These medications work synergistically to manage your condition effectively."
      ],
      interaction: [
        "Interaction scan complete: Moderate risk detected. These medications may increase dizziness. Avoid driving until you know how they affect you.",
        "No significant interactions found. However, I recommend taking them 2 hours apart for optimal absorption.",
        "Warning: Potential serotonin syndrome risk detected. Please consult your doctor before continuing this combination."
      ],
      "side-effect": [
        "Common side effects include mild headache (12% of patients) and nausea (8%). Severe reactions are rare (<1%).",
        "Side effect probability matrix generated. You have a 15% chance of experiencing dry mouth, typically resolving in 2-3 weeks.",
        "Adverse reaction database queried. Report any vision changes or muscle pain immediately to your healthcare provider."
      ],
      diagnosis: [
        "Lab results analysis: Your values are within expected parameters. No immediate concerns detected.",
        "Biomarker interpretation complete. Slightly elevated levels detected - may indicate early inflammation.",
        "Diagnostic cross-reference complete. These results suggest good response to current treatment plan."
      ],
      general: [
        "I've consulted multiple medical databases to provide this information. For personalized advice, please consult your healthcare provider.",
        "Medical knowledge base accessed. Here's what current evidence suggests about your query.",
        "Clinical decision support algorithm activated. Based on your profile, I recommend discussing this with your doctor."
      ]
    }

    const category = determineCategory(query)
    const categoryResponses = responses[category] || responses.general
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "medication":
        return <Pill className="h-4 w-4 text-purple-500" />
      case "interaction":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "side-effect":
        return <Stethoscope className="h-4 w-4 text-yellow-500" />
      case "diagnosis":
        return <Microscope className="h-4 w-4 text-blue-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "analyzing":
        return <Badge className="bg-blue-100 text-blue-800"><Activity className="h-3 w-3 mr-1 animate-spin" /> Analyzing</Badge>
      case "verified":
        return <Badge className="bg-green-100 text-green-800"><Shield className="h-3 w-3 mr-1" /> Verified</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" /> Warning</Badge>
      default:
        return null
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="space-y-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Animated Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Bot className="h-10 w-10 text-blue-600" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              MedBot 
            </h1>
            <p className="text-sm text-gray-500">Advanced Medical Intelligence System</p>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge variant="outline" className="flex items-center gap-2 bg-white shadow-sm">
            <motion.div
              animate={activePulse ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              < HeartPulse className="h-4 w-4 text-red-500" />
            </motion.div>
            <span>AI Neural Network Active</span>
          </Badge>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Area */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0.7)",
                      "0 0 0 10px rgba(59, 130, 246, 0)",
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                  className="p-1 rounded-full"
                >
                  <BrainCircuit className="h-6 w-6" />
                </motion.div>
                <CardTitle>Medical Consultation Interface</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-gray-50">
              <ScrollArea className="h-[600px] p-4" ref={scrollRef}>
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex mb-6 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-[90%] ${
                          message.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <motion.div
                            whileHover={{ rotate: 10 }}
                            className="relative"
                          >
                            <Avatar className="h-10 w-10 border-2 border-blue-400 bg-blue-100">
                              <AvatarImage src="/medbot-avatar.png" alt="AI" />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                <Bot className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.8, 1, 0.8]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity
                              }}
                              className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1"
                            >
                              <Zap className="h-3 w-3 text-white" />
                            </motion.div>
                          </motion.div>
                        ) : (
                          <Avatar className="h-10 w-10 border-2 border-purple-400 bg-purple-100">
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              <Heart className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <motion.div 
                          className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                          whileHover={{ scale: 1.01 }}
                        >
                          <motion.div
                            className={`p-4 rounded-2xl ${
                              message.role === "user" 
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                                : "bg-white shadow-md"
                            }`}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                          >
                            {message.content}
                          </motion.div>
                          
                          {message.role === "assistant" && (
                            <motion.div 
                              className="mt-2 flex items-center gap-2 flex-wrap"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {message.category && (
                                <Badge variant="outline" className="text-xs">
                                  <span className="mr-1">{getCategoryIcon(message.category)}</span>
                                  {message.category.replace("-", " ")}
                                </Badge>
                              )}
                              {message.status && getStatusBadge(message.status)}
                              <span className="text-xs text-gray-500">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </motion.div>
                          )}
                          
                          {message.references && (
                            <motion.div 
                              className="mt-3 text-xs text-gray-600 bg-gray-100 p-2 rounded-lg"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                            >
                              <div className="flex items-center gap-1 font-medium">
                                <FileText className="h-3 w-3" />
                                Medical Sources:
                              </div>
                              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                {message.references.map((ref, index) => (
                                  <li key={index}>{ref}</li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div 
                    className="flex items-center gap-3 text-gray-500 pl-14"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    >
                      <Avatar className="h-8 w-8 bg-blue-100 border border-blue-200">
                        <AvatarFallback className="bg-transparent">
                          <Bot className="h-5 w-5 text-blue-500" />
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-1"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span>Analyzing medical data</span>
                      <span className="flex">
                        <span className="inline-block w-1 h-1 mx-[1px] bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="inline-block w-1 h-1 mx-[1px] bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="inline-block w-1 h-1 mx-[1px] bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </ScrollArea>
              
              <div className="p-4 border-t bg-white">
                <motion.form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about medications, interactions, or health concerns..."
                    className="flex-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-6 py-3 shadow-md"
                    >
                      <SendIcon className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </motion.div>
                </motion.form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Questions Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg rounded-xl h-full bg-gradient-to-b from-white to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Syringe className="h-6 w-6 text-blue-600" />
                </motion.div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Quick Medical Queries
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all"
                      onClick={() => {
                        setInput(suggestion.text)
                        document.querySelector('input')?.focus()
                      }}
                    >
                      <span className="mr-3">{suggestion.icon}</span>
                      <span>{suggestion.text}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-medium flex items-center gap-2 text-blue-800">
                  <Shield className="h-4 w-4" />
                  Medical Disclaimer
                </h3>
                <p className="text-xs text-blue-700 mt-1">
                  MedBot  provides general health information, not medical advice. Always consult a healthcare professional for personal medical concerns.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}