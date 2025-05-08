// import React, { useState, useEffect, useRef } from "react";
// import { Pill, AlertCircle, Stethoscope, Microscope, MessageCircle, Activity, Shield } from "lucide-react"; // Add Stethoscope, Microscope, MessageCircle, Activity, and Shield icon import
// import { Badge } from "@/components/ui/badge";

// // Define the Message type if not already defined
// type Message = {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   timestamp: Date;
//   category?: string;
//   status?: string;
//   references?: string[];
// };

// const [messages, setMessages] = useState<Message[]>([]);
// const [isTyping, setIsTyping] = useState(false);
// const [input, setInput] = useState(""); // Add this line to fix the error
// const [activePulse, setActivePulse] = useState(false); // Add this line to fix setActivePulse error
// const scrollRef = useRef<HTMLDivElement>(null); // Add this line to define scrollRef

// const handleSend = async () => {
//   if (input.trim()) {
//     // Creating the user message and adding it to the state
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: "user",
//       content: input,
//       timestamp: new Date(),
//     }
//     setMessages((prev) => [...prev, userMessage])

//     // Resetting the input field and starting the "typing" state
//     setInput("")
//     setIsTyping(true)
//     setActivePulse(true)

//     try {
//       // Making the API request
//       const res = await fetch("http://localhost:8000/chat/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ question: input }), // Sending user input to the API
//       })

//       if (!res.ok) {
//         throw new Error("Failed to fetch response")
//       }

//       const data = await res.json()

//       // Constructing the AI response message from the API
//       const aiMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: data.response, // The response from the API
//         timestamp: new Date(),
//         category: "general", // You can adjust this depending on the response
//       }

//       // Adding the AI response message to the state
//       setMessages((prev) => [...prev, aiMessage])
//     } catch (error) {
//       // Handling errors
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: (Date.now() + 2).toString(),
//           role: "assistant",
//           content: "⚠️ Error connecting to server. Please try again.",
//           timestamp: new Date(),
//         },
//       ])
//     } finally {
//       // Resetting the "typing" state and stopping the active pulse
//       setIsTyping(false)
//       setActivePulse(false)
//     }
//   }
// }

  
//   const determineCategory = (query: string): "medication" | "interaction" | "side-effect" | "diagnosis" | "general" => {
//     if (query.toLowerCase().includes("interaction")) return "interaction"
//     if (query.toLowerCase().includes("side effect")) return "side-effect"
//     if (query.toLowerCase().includes("medication") || query.toLowerCase().includes("prescription")) return "medication"
//     if (query.toLowerCase().includes("lab") || query.toLowerCase().includes("result")) return "diagnosis"
//     return "general"
//   }

//   const generateMedicalResponse = (query: string): string => {
//     const lowerQuery = query.toLowerCase();
  
//     // Medical-only responses
//     if (!isMedicalQuestion(lowerQuery)) {
//       return "I specialize only in medical advice. Please describe symptoms or ask health-related questions.";
//     }
  
//     // Symptom -> Diagnosis patterns
//     if (containsAll(lowerQuery, ["headache", "fever"])) {
//       return "Diagnosis: Likely viral infection such as flu. Precautions: Get plenty of rest, drink fluids, monitor temperature regularly. Medications: Fever reducers like acetaminophen or ibuprofen. Emergency signs: Stiff neck, confusion, fever lasting more than 3 days, or difficulty breathing.";
//     }
  
//     if (containsAll(lowerQuery, ["headache", "fever", "muscle pain"])) {
//       return "Diagnosis: Probable influenza. Precautions: Isolate to prevent spread, use separate towels, disinfect surfaces. Medications: Antiviral medication (if started within 48 hours), pain relievers. Emergency signs: Severe chest pain, bluish lips, or inability to stay hydrated.";
//     }
  
//     if (containsAll(lowerQuery, ["stomach pain", "diarrhea", "nausea"])) {
//       return "Diagnosis: Likely gastroenteritis. Precautions: Wash hands frequently, avoid dairy, use separate bathroom if possible. Medications: Oral rehydration solutions, anti-nausea medication if needed. Emergency signs: Blood in vomit or stool, signs of dehydration like dry mouth or dizziness when standing.";
//     }
  
//     if (containsAll(lowerQuery, ["rash", "itching", "swelling"])) {
//       return "Diagnosis: Allergic reaction. Precautions: Identify and avoid allergen, wear loose clothing. Medications: Oral antihistamines like cetirizine, topical hydrocortisone cream. Emergency signs: Swelling of face/lips/tongue, trouble breathing, or feeling faint.";
//     }
//     // Default response for unrecognized medical queries
//     return "I understand you have health concerns. For accurate assessment, please describe: 1) Your main symptoms 2) How long they've lasted 3) Any worsening factors. This will help me provide better guidance.";
//   };
  
//   // Helper functions
//   const containsAll = (query: string, terms: string[]): boolean => 
//     terms.every(term => query.includes(term));
  
//   const isMedicalQuestion = (query: string): boolean => {
//     const medicalTerms = [
//       'pain', 'ache', 'fever', 'cough', 'headache', 'nausea', 
//       'vomit', 'dizzy', 'rash', 'swell', 'medic', 'pill',
//       'symptom', 'diagnos', 'treat', 'disease', 'illness'
//     ];
//     return medicalTerms.some(term => query.includes(term));
//   };

//   const getCategoryIcon = (category?: string) => {
//     switch (category) {
//       case "medication":
//         return <Pill className="h-4 w-4 text-purple-500" />
//       case "interaction":
//         return <AlertCircle className="h-4 w-4 text-red-500" />
//       case "side-effect":
//         return <Stethoscope className="h-4 w-4 text-yellow-500" />
//       case "diagnosis":
//         return <Microscope className="h-4 w-4 text-blue-500" />
//       default:
//         return <MessageCircle className="h-4 w-4 text-gray-500" />
//     }
//   }

//   const getStatusBadge = (status?: string) => {
//     switch (status) {
//       case "analyzing":
//         return <Badge className="bg-blue-100 text-blue-800"><Activity className="h-3 w-3 mr-1 animate-spin" /> Analyzing</Badge>
//       case "verified":
//         return <Badge className="bg-green-100 text-green-800"><Shield className="h-3 w-3 mr-1" /> Verified</Badge>
//       case "warning":
//         return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" /> Warning</Badge>
//       default:
//         return null
//     }
//   }

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }
//   }, [messages])

//   return (
//     <div className="space-y-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
//       {/* Animated Header */}
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex justify-between items-center"
//       >
//         <div className="flex items-center space-x-4">
//           <motion.div 
//             animate={{ 
//               rotate: [0, 10, -10, 0],
//               scale: [1, 1.1, 1]
//             }}
//             transition={{ 
//               duration: 2,
//               repeat: Infinity,
//               repeatType: "reverse"
//             }}
//           >
//             <Bot className="h-10 w-10 text-blue-600" />
//           </motion.div>
//           <div>
//             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//               MedBot 
//             </h1>
//             <p className="text-sm text-gray-500">Advanced Medical Intelligence System</p>
//           </div>
//         </div>
        
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Badge variant="outline" className="flex items-center gap-2 bg-white shadow-sm">
//             <motion.div
//               animate={activePulse ? {
//                 scale: [1, 1.2, 1],
//                 opacity: [1, 0.7, 1]
//               } : {}}
//               transition={{ duration: 1.5, repeat: Infinity }}
//             >
//               < HeartPulse className="h-4 w-4 text-red-500" />
//             </motion.div>
//             <span>AI Neural Network Active</span>
//           </Badge>
//         </motion.div>
//       </motion.div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Main Chat Area */}
//         <motion.div 
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//           className="lg:col-span-3"
//         >
//           <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//               <div className="flex items-center space-x-3">
//                 <motion.div
//                   animate={{
//                     boxShadow: [
//                       "0 0 0 0 rgba(59, 130, 246, 0.7)",
//                       "0 0 0 10px rgba(59, 130, 246, 0)",
//                     ]
//                   }}
//                   transition={{
//                     duration: 2,
//                     repeat: Infinity
//                   }}
//                   className="p-1 rounded-full"
//                 >
//                   <BrainCircuit className="h-6 w-6" />
//                 </motion.div>
//                 <CardTitle>Medical Consultation Interface</CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent className="p-0 bg-gray-50">
//               <ScrollArea className="h-[600px] p-4" ref={scrollRef}>
//                 <AnimatePresence>
//                   {messages.map((message) => (
//                     <motion.div
//                       key={message.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className={`flex mb-6 ${message.role === "user" ? "justify-end" : "justify-start"}`}
//                     >
//                       <div
//                         className={`flex items-start gap-3 max-w-[90%] ${
//                           message.role === "user" ? "flex-row-reverse" : ""
//                         }`}
//                       >
//                         {message.role === "assistant" ? (
//                           <motion.div
//                             whileHover={{ rotate: 10 }}
//                             className="relative"
//                           >
//                             <Avatar className="h-10 w-10 border-2 border-blue-400 bg-blue-100">
//                               <AvatarImage src="/medbot-avatar.png" alt="AI" />
//                               <AvatarFallback className="bg-blue-100 text-blue-600">
//                                 <Bot className="h-5 w-5" />
//                               </AvatarFallback>
//                             </Avatar>
//                             <motion.div
//                               animate={{
//                                 scale: [1, 1.1, 1],
//                                 opacity: [0.8, 1, 0.8]
//                               }}
//                               transition={{
//                                 duration: 2,
//                                 repeat: Infinity
//                               }}
//                               className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1"
//                             >
//                               <Zap className="h-3 w-3 text-white" />
//                             </motion.div>
//                           </motion.div>
//                         ) : (
//                           <Avatar className="h-10 w-10 border-2 border-purple-400 bg-purple-100">
//                             <AvatarFallback className="bg-purple-100 text-purple-600">
//                               <Heart className="h-5 w-5" />
//                             </AvatarFallback>
//                           </Avatar>
//                         )}
                        
//                         <motion.div 
//                           className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
//                           whileHover={{ scale: 1.01 }}
//                         >
//                           <motion.div
//                             className={`p-4 rounded-2xl ${
//                               message.role === "user" 
//                                 ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
//                                 : "bg-white shadow-md"
//                             }`}
//                             initial={{ scale: 0.95 }}
//                             animate={{ scale: 1 }}
//                           >
//                             {message.content}
//                           </motion.div>
                          
//                           {message.role === "assistant" && (
//                             <motion.div 
//                               className="mt-2 flex items-center gap-2 flex-wrap"
//                               initial={{ opacity: 0 }}
//                               animate={{ opacity: 1 }}
//                               transition={{ delay: 0.3 }}
//                             >
//                               {message.category && (
//                                 <Badge variant="outline" className="text-xs">
//                                   <span className="mr-1">{getCategoryIcon(message.category)}</span>
//                                   {message.category.replace("-", " ")}
//                                 </Badge>
//                               )}
//                               {message.status && getStatusBadge(message.status)}
//                               <span className="text-xs text-gray-500">
//                                 <Clock className="h-3 w-3 inline mr-1" />
//                                 {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                               </span>
//                             </motion.div>
//                           )}
                          
//                           {message.references && (
//                             <motion.div 
//                               className="mt-3 text-xs text-gray-600 bg-gray-100 p-2 rounded-lg"
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: 'auto' }}
//                             >
//                               <div className="flex items-center gap-1 font-medium">
//                                 <FileText className="h-3 w-3" />
//                                 Medical Sources:
//                               </div>
//                               <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
//                                 {message.references.map((ref, index) => (
//                                   <li key={index}>{ref}</li>
//                                 ))}
//                               </ul>
//                             </motion.div>
//                           )}
//                         </motion.div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>

//                 {isTyping && (
//                   <motion.div 
//                     className="flex items-center gap-3 text-gray-500 pl-14"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                   >
//                     <motion.div
//                       animate={{
//                         y: [0, -5, 0],
//                       }}
//                       transition={{
//                         duration: 1,
//                         repeat: Infinity,
//                       }}
//                     >
//                       <Avatar className="h-8 w-8 bg-blue-100 border border-blue-200">
//                         <AvatarFallback className="bg-transparent">
//                           <Bot className="h-5 w-5 text-blue-500" />
//                         </AvatarFallback>
//                       </Avatar>
//                     </motion.div>
//                     <motion.div
//                       className="flex items-center gap-1"
//                       initial={{ opacity: 0.5 }}
//                       animate={{ opacity: [0.5, 1, 0.5] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                     >
//                       <span>Analyzing medical data</span>
//                       <span className="flex">
//                         <span className="inline-block w-1 h-1 mx-[1px] bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
//                         <span className="inline-block w-1 h-1 mx-[1px] bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
//                         <span className="inline-block w-1 h-1 mx-[1px] bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
//                       </span>
//                     </motion.div>
//                   </motion.div>
//                 )}
//               </ScrollArea>
              
//               <div className="p-4 border-t bg-white">
//                 <motion.form
//                   onSubmit={(e) => {
//                     e.preventDefault()
//                     handleSend()
//                   }}
//                   className="flex gap-2"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                 >
//                   <Input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Ask about medications, interactions, or health concerns..."
//                     className="flex-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3"
//                   />
//                   <motion.div
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Button 
//                       type="submit" 
//                       className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-6 py-3 shadow-md"
//                     >
//                       <SendIcon className="h-4 w-4 mr-2" />
//                       Send
//                     </Button>
//                   </motion.div>
//                 </motion.form>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Quick Questions Panel */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <Card className="border-0 shadow-lg rounded-xl h-full bg-gradient-to-b from-white to-blue-50">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-3">
//                 <motion.div
//                   animate={{ rotate: [0, 10, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                 >
//                   <Syringe className="h-6 w-6 text-blue-600" />
//                 </motion.div>
//                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//                   Quick Medical Queries
//                 </span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {suggestions.map((suggestion, in&dex) => (
//                   <motion.div
//                     key={index}
//                     whileHover={{ x: 5 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-left h-auto py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all"
//                       onClick={() => {
//                         setInput(suggestion.text)
//                         document.querySelector('input')?.focus()
//                       }}
//                     >
//                       <span className="mr-3">{suggestion.icon}</span>
//                       <span>{suggestion.text}</span>
//                     </Button>
//                   </motion.div>
//                 ))}
//               </div>

//               <motion.div 
//                 className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <h3 className="font-medium flex items-center gap-2 text-blue-800">
//                   <Shield className="h-4 w-4" />
//                   Medical Disclaimer
//                 </h3>
//                 <p className="text-xs text-blue-700 mt-1">
//                   MedBot  provides general health information, not medical advice. Always consult a healthcare professional for personal medical concerns.
//                 </p>
//               </motion.div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// function SendIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m22 2-7 20-4-9-9-4Z" />
//       <path d="M22 2 11 13" />
//     </svg>
//   )
// }






'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill,
  AlertCircle,
  Stethoscope,
  Microscope,
  MessageCircle,
  Activity,
  Shield,
  Bot,
  HeartPulse,
  BrainCircuit,
  Heart,
  Zap,
  Clock,
  FileText,
  Syringe,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the Message type
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
  status?: string;
  references?: string[];
};

// SendIcon component
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
  );
}

// Main component
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [activePulse, setActivePulse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Define suggestions
  const suggestions = [
    { text: 'What are common side effects of ibuprofen?', icon: '💊' },
    { text: 'How to manage high blood pressure?', icon: '🩺' },
    { text: 'What foods help with digestion?', icon: '🥗' },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setActivePulse(true);

    try {
      const res = await fetch('http://localhost:8000/chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        category: determineCategory(input),
        status: 'verified',
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: '⚠️ Error connecting to server. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setActivePulse(false);
    }
  };

  // Determine category for messages
  const determineCategory = (query: string): 'medication' | 'interaction' | 'side-effect' | 'diagnosis' | 'general' => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('interaction')) return 'interaction';
    if (lowerQuery.includes('side effect')) return 'side-effect';
    if (lowerQuery.includes('medication') || lowerQuery.includes('prescription')) return 'medication';
    if (lowerQuery.includes('lab') || lowerQuery.includes('result')) return 'diagnosis';
    return 'general';
  };

  // Category icon mapping
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'medication':
        return <Pill className="h-4 w-4 text-purple-500" />;
      case 'interaction':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'side-effect':
        return <Stethoscope className="h-4 w-4 text-yellow-500" />;
      case 'diagnosis':
        return <Microscope className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Status badge mapping
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'analyzing':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Activity className="h-3 w-3 mr-1 animate-spin" /> Analyzing
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800">
            <Shield className="h-3 w-3 mr-1" /> Verified
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" /> Warning
          </Badge>
        );
      default:
        return null;
    }
  };

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
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
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

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Badge variant="outline" className="flex items-center gap-2 bg-white shadow-sm">
            <motion.div
              animate={
                activePulse
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <HeartPulse className="h-4 w-4 text-red-500" />
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
                      '0 0 0 0 rgba(59, 130, 246, 0.7)',
                      '0 0 0 10px rgba(59, 130, 246, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
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
                      className={`flex mb-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-[90%] ${
                          message.role === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <motion.div whileHover={{ rotate: 10 }} className="relative">
                            <Avatar className="h-10 w-10 border-2 border-blue-400 bg-blue-100">
                              <AvatarImage src="/medbot-avatar.png" alt="AI" />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                <Bot className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.8, 1, 0.8],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
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
                          className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                          whileHover={{ scale: 1.01 }}
                        >
                          <motion.div
                            className={`p-4 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                : 'bg-white shadow-md'
                            }`}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                          >
                            {message.content}
                          </motion.div>

                          {message.role === 'assistant' && (
                            <motion.div
                              className="mt-2 flex items-center gap-2 flex-wrap"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {message.category && (
                                <Badge variant="outline" className="text-xs">
                                  <span className="mr-1">{getCategoryIcon(message.category)}</span>
                                  {message.category.replace('-', ' ')}
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
                        <span
                          className="inline-block w-1 h-1 mx-[1px] bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></span>
                        <span
                          className="inline-block w-1 h-1 mx-[1px] bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></span>
                        <span
                          className="inline-block w-1 h-1 mx-[1px] bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></span>
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </ScrollArea>

              <div className="p-4 border-t bg-white">
                <motion.form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
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
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                  <motion.div key={index} whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all"
                      onClick={() => {
                        setInput(suggestion.text);
                        document.querySelector('input')?.focus();
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
                  MedBot provides general health information, not medical advice. Always consult a healthcare
                  professional for personal medical concerns.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}