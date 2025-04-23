"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Upload, Scan, Activity, BrainCircuit, MessageSquare, 
  Pill, AlertTriangle, User, Clock, Sparkles, 
  HeartPulse, Syringe, FlaskConical, Bot, Zap,Send,FileText
} from "lucide-react"

export default function AIAnalysisInterface() {
  const [file, setFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; content: string }[]>([])
  const [userMessage, setUserMessage] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      toast({
        title: "File Uploaded",
        description: `${uploadedFile.name} has been successfully uploaded.`,
      })
    }
  }

  const handleAnalysis = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload a prescription or medical record first.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    // Simulating progressive analysis with different stages
    setTimeout(() => {
      setAnalysisResult({
        status: "extracting",
        progress: 30
      })
    }, 800)

    setTimeout(() => {
      setAnalysisResult({
        status: "analyzing",
        progress: 60
      })
    }, 1600)

    setTimeout(() => {
      setAnalysisResult({
        status: "complete",
        medications: [
          { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", purpose: "Blood pressure control" },
          { name: "Metformin", dosage: "500mg", frequency: "Twice daily", purpose: "Type 2 diabetes management" },
        ],
        patientInfo: {
          name: "John Doe",
          age: 45,
          gender: "Male",
          conditions: ["Hypertension", "Type 2 Diabetes"]
        },
        warnings: [
          "Potential interaction between Lisinopril and NSAIDs may reduce antihypertensive effectiveness",
          "Metformin may cause vitamin B12 deficiency with long-term use"
        ],
        alternatives: [
          { 
            original: "Lisinopril", 
            alternative: "Losartan", 
            reason: "Better tolerated with similar efficacy",
            benefits: ["Lower risk of cough", "Once daily dosing"]
          }
        ],
        adherenceTips: [
          "Take Lisinopril at the same time each day, preferably in the morning",
          "Metformin should be taken with meals to reduce gastrointestinal side effects"
        ],
        progress: 100
      })
      setIsAnalyzing(false)
      setActiveTab("results")
      toast({
        title: "Analysis Complete",
        description: "The prescription has been successfully analyzed.",
      })
    }, 3000)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userMessage.trim()) {
      setChatMessages([...chatMessages, { role: "user", content: userMessage }])
      setUserMessage("")
      
      // Simulating AI typing indicator
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          role: "ai", 
          content: generateAIResponse(userMessage) 
        }])
      }, 1500)
    }
  }

  const generateAIResponse = (query: string): string => {
    if (query.toLowerCase().includes("side effect")) {
      return "Common side effects may include mild symptoms like headache or dizziness. Severe reactions are rare but should be reported immediately. Would you like me to check for specific side effects of any medication?"
    } else if (query.toLowerCase().includes("interaction")) {
      return "I can analyze potential drug interactions. For example, some blood pressure medications may interact with NSAIDs. Would you like me to check your current medications for interactions?"
    } else {
      return "As an AI medical assistant, I can provide general information about medications, side effects, and interactions. However, for personalized medical advice, please consult with your healthcare provider. How else may I assist you?"
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  return (
    <div className="space-y-8 p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
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
          <BrainCircuit className="h-10 w-10 text-blue-600" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            MediScan AI
          </h1>
          <p className="text-sm text-gray-500">Advanced Prescription Analysis System</p>
        </div>
      </motion.div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TabsList className="bg-gradient-to-r from-blue-50 to-purple-50">
            <motion.div whileHover={{ scale: 1.03 }}>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }}>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                Results
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }}>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Assistant
              </TabsTrigger>
            </motion.div>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="upload">
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Upload className="h-6 w-6" />
                    <span>Upload Medical Documents</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Upload prescriptions, lab results, or medical records for AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 cursor-pointer"
                  >
                    <Label htmlFor="file-upload" className="flex flex-col items-center gap-3 cursor-pointer">
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <Upload className="h-10 w-10 text-blue-500" />
                      </motion.div>
                      <p className="font-medium">Drag and drop files here</p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </Label>
                    <Input 
                      id="file-upload" 
                      type="file" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </motion.div>
                  
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-white rounded-lg shadow-sm border flex items-center gap-3"
                    >
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t p-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleAnalysis} 
                      disabled={!file || isAnalyzing}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                    >
                      {isAnalyzing ? (
                        <span className="flex items-center gap-2">
                          <Activity className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Start AI Analysis
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Scan className="h-6 w-6" />
                    <span>AI Analysis Results</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Comprehensive medication analysis powered by artificial intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {isAnalyzing && !analysisResult?.status ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <motion.div
                        animate={{
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <BrainCircuit className="h-12 w-12 text-blue-500" />
                      </motion.div>
                      <p className="mt-4 text-lg font-medium">Initializing AI analysis...</p>
                    </div>
                  ) : analysisResult?.status === "extracting" || analysisResult?.status === "analyzing" ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity
                          }}
                        >
                          <FlaskConical className="h-12 w-12 mx-auto text-blue-500" />
                        </motion.div>
                        <h3 className="text-xl font-medium mt-4">
                          {analysisResult.status === "extracting" 
                            ? "Extracting medication data..." 
                            : "Analyzing potential interactions..."}
                        </h3>
                        <p className="text-gray-500 mt-2">
                          Our AI is carefully processing your medical information
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          initial={{ width: "0%" }}
                          animate={{ width: `${analysisResult.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  ) : analysisResult?.status === "complete" ? (
                    <div className="space-y-8">
                      {/* Patient Info */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-4 rounded-lg shadow-sm border"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <User className="h-5 w-5 text-purple-600" />
                          <h3 className="text-lg font-semibold">Patient Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{analysisResult.patientInfo.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="font-medium">{analysisResult.patientInfo.age}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">{analysisResult.patientInfo.gender}</p>
                          </div>
                        </div>
                        {analysisResult.patientInfo.conditions && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">Conditions</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {analysisResult.patientInfo.conditions.map((condition: string, index: number) => (
                                <Badge key={index} variant="outline" className="bg-blue-50">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Medications */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-4 rounded-lg shadow-sm border"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Pill className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">Medications</h3>
                        </div>
                        <div className="space-y-4">
                          {analysisResult.medications.map((med: any, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{med.name}</h4>
                                  <p className="text-sm text-gray-600">{med.dosage}, {med.frequency}</p>
                                  {med.purpose && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      <span className="font-medium">Purpose:</span> {med.purpose}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="outline" className="bg-green-50">
                                  Active
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Warnings */}
                      {analysisResult.warnings.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200 bg-yellow-50"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <h3 className="text-lg font-semibold text-yellow-700">Important Warnings</h3>
                          </div>
                          <ul className="space-y-3">
                            {analysisResult.warnings.map((warning: string, index: number) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="flex items-start gap-2"
                              >
                                <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                                <p className="text-sm text-yellow-800">{warning}</p>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Alternatives */}
                      {analysisResult.alternatives.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-white p-4 rounded-lg shadow-sm border border-green-200 bg-green-50"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <HeartPulse className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-700">Suggested Alternatives</h3>
                          </div>
                          <div className="space-y-4">
                            {analysisResult.alternatives.map((alt: any, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="p-3 border rounded-lg bg-white"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="text-red-500 line-through">{alt.original}</div>
                                  <ArrowRight className="h-4 w-4 text-gray-400" />
                                  <div className="font-medium text-green-600">{alt.alternative}</div>
                                </div>
                                {alt.reason && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    <span className="font-medium">Reason:</span> {alt.reason}
                                  </p>
                                )}
                                {alt.benefits && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-600">Benefits:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                      {alt.benefits.map((benefit: string, i: number) => (
                                        <li key={i}>{benefit}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Adherence Tips */}
                      {analysisResult.adherenceTips && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 bg-blue-50"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-blue-700">Medication Adherence Tips</h3>
                          </div>
                          <ul className="space-y-2">
                            {analysisResult.adherenceTips.map((tip: string, index: number) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-start gap-2"
                              >
                                <Zap className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                                <p className="text-sm text-blue-800">{tip}</p>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Scan className="h-12 w-12 text-gray-400" />
                      <h3 className="text-lg font-medium mt-4">No Analysis Results</h3>
                      <p className="text-gray-500 mt-2">
                        Upload and analyze a prescription to see detailed results
                      </p>
                      <Button 
                        onClick={() => setActiveTab("upload")} 
                        className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        Upload Prescription
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Bot className="h-6 w-6" />
                    <span>AI Medical Assistant</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Get answers to your medication-related questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-6">
                      {chatMessages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex items-start gap-3 max-w-[90%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                            >
                              <Avatar className="h-10 w-10">
                                {message.role === "ai" ? (
                                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                                ) : null}
                                <AvatarFallback className={message.role === "ai" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}>
                                  {message.role === "ai" ? "AI" : "U"}
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                            <motion.div
                              className={`p-4 rounded-2xl ${message.role === "user" ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : "bg-gray-100"}`}
                              whileHover={{ scale: 1.02 }}
                            >
                              {message.content}
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t p-4 bg-gray-50">
                  <form onSubmit={handleChatSubmit} className="flex w-full gap-2">
                    <Input
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder="Ask about medications, side effects, or interactions..."
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
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </motion.div>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}