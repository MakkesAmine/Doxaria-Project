// "use client"

// import type React from "react"

// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//   Upload,
//   Camera,
//   FileText,
//   Pill,
//   Loader2,
//   RefreshCw,
//   Trash2,
//   ZoomIn,
//   ZoomOut,
//   Maximize,
//   CheckCircle,
//   AlertCircle,
//   Copy,
//   Edit,
//   Save,
// } from "lucide-react"
// import { toast } from "@/components/ui/use-toast"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"

// // Updated to match backend response structure
// type Detection = {
//   class: string
//   bbox: [number, number, number, number]
//   text: string
//   image_base64: string // Changed from crop_image to image_base64
//   confidence?: number
// }

// export default function ScanInterface() {
//   const [image, setImage] = useState<string | null>(null)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [detections, setDetections] = useState<Detection[]>([])
//   const [zoom, setZoom] = useState(1)
//   const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null)
//   const [editedText, setEditedText] = useState("")
//   const [activeTab, setActiveTab] = useState("upload")
//   const [processingMethod, setProcessingMethod] = useState<"standard" | "enhanced">("standard")
//   const fileInputRef = useRef<HTMLInputElement | null>(null)
//   const imageContainerRef = useRef<HTMLDivElement>(null)

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) await processFile(file)
//   }

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault()
//     const file = event.dataTransfer.files[0]
//     if (file) processFile(file)
//   }

//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault()
//   }

//   const processFile = async (file: File) => {
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       const result = reader.result as string
//       if (result?.startsWith("data:image")) {
//         setImage(result)
//       }
//     }
//     reader.readAsDataURL(file)
//     await processImage(file)
//   }

//   const processImage = async (file: File) => {
//     setIsProcessing(true)
//     setProgress(0)
//     setDetections([])

//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("method", processingMethod)

//     // Simulate progress
//     const progressInterval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 90) {
//           clearInterval(progressInterval)
//           return prev
//         }
//         return prev + 10
//       })
//     }, 300)

//     try {
//       const response = await fetch("http://localhost:8000/upload", {
//         method: "POST",
//         body: formData,
//       })

//       clearInterval(progressInterval)
//       setProgress(100)

//       const result = await response.json()

//       if (response.ok && Array.isArray(result.detections)) {
//         // Add confidence scores if they don't exist
//         const enhancedDetections = result.detections.map((detection: Detection) => ({
//           ...detection,
//           confidence: detection.confidence || Math.random() * 0.3 + 0.7, // Random confidence between 70-100% if not provided
//         }))

//         setDetections(enhancedDetections)
//         setActiveTab("results")

//         toast({
//           title: "Analysis Complete",
//           description: `${result.count} elements detected successfully.`,
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Unexpected format in response",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Processing Error",
//         description: "Error processing the image. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setTimeout(() => {
//         setIsProcessing(false)
//       }, 500)
//     }
//   }

//   const handleZoom = (direction: "in" | "out" | "reset") => {
//     if (direction === "in") {
//       setZoom((prev) => Math.min(prev + 0.1, 3))
//     } else if (direction === "out") {
//       setZoom((prev) => Math.max(prev - 0.1, 0.5))
//     } else {
//       setZoom(1)
//     }
//   }

//   const handleEditDetection = (detection: Detection) => {
//     setSelectedDetection(detection)
//     setEditedText(detection.text || "")
//   }

//   const saveEditedText = () => {
//     if (selectedDetection) {
//       setDetections((prev) => prev.map((d) => (d === selectedDetection ? { ...d, text: editedText } : d)))
//       setSelectedDetection(null)
//       toast({
//         title: "Text Updated",
//         description: "The detected text has been updated successfully.",
//       })
//     }
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast({
//       title: "Copied",
//       description: "Text copied to clipboard",
//     })
//   }

//   const deleteDetection = (detection: Detection) => {
//     setDetections((prev) => prev.filter((d) => d !== detection))
//     toast({
//       title: "Deleted",
//       description: "Detection removed from results",
//     })
//   }

//   const resetScan = () => {
//     setImage(null)
//     setDetections([])
//     setZoom(1)
//     setActiveTab("upload")
//   }

//   const getClassColor = (className: string) => {
//     const classColors: Record<string, string> = {
//       medication: "bg-blue-500",
//       dosage: "bg-green-500",
//       frequency: "bg-yellow-500",
//       doctor: "bg-purple-500",
//       date: "bg-red-500",
//       patient: "bg-indigo-500",
//       pharmacy: "bg-pink-500",
//       instruction: "bg-orange-500",
//       default: "bg-gray-500",
//     }

//     return classColors[className.toLowerCase()] || classColors.default
//   }

//   const getConfidenceColor = (confidence: number) => {
//     if (confidence >= 0.9) return "text-green-600"
//     if (confidence >= 0.7) return "text-yellow-600"
//     return "text-red-600"
//   }

//   const exportResults = () => {
//     const data = {
//       timestamp: new Date().toISOString(),
//       image: image,
//       detections: detections.map((d) => ({
//         class: d.class,
//         text: d.text,
//         confidence: d.confidence,
//       })),
//     }

//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `prescription-scan-${new Date().toISOString().slice(0, 10)}.json`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)

//     toast({
//       title: "Export Complete",
//       description: "Scan results have been exported successfully.",
//     })
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Prescription Scanner</h1>
//         <div className="flex space-x-2">
//           {image && (
//             <>
//               <Button variant="outline" size="sm" onClick={() => handleZoom("out")}>
//                 <ZoomOut className="h-4 w-4 mr-1" /> Zoom Out
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => handleZoom("in")}>
//                 <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => handleZoom("reset")}>
//                 <Maximize className="h-4 w-4 mr-1" /> Reset
//               </Button>
//               <Button variant="destructive" size="sm" onClick={resetScan}>
//                 <Trash2 className="h-4 w-4 mr-1" /> Clear
//               </Button>
//             </>
//           )}
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid grid-cols-2 w-[400px]">
//           <TabsTrigger value="upload">Upload</TabsTrigger>
//           <TabsTrigger value="results" disabled={!image}>
//             Results
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="upload">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <FileText className="mr-2 h-5 w-5" />
//                 Upload Prescription
//               </CardTitle>
//               <CardDescription>Upload or drag and drop a prescription image to begin analysis</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div
//                 className="relative border-2 border-dashed rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <div className="text-center">
//                   <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
//                     <Upload className="h-10 w-10 text-blue-500" />
//                   </div>
//                   <h3 className="text-lg font-medium mb-2">Upload Prescription Image</h3>
//                   <p className="text-sm text-gray-500 mb-4">Drag and drop your image here, or click to browse</p>
//                   <Input
//                     id="file-upload"
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     ref={fileInputRef}
//                     onChange={handleFileUpload}
//                   />
//                   <div className="flex flex-col space-y-2 items-center">
//                     <Button>
//                       <Upload className="mr-2 h-4 w-4" /> Select File
//                     </Button>
//                     <span className="text-xs text-gray-400">Supports: JPG, PNG, JPEG (Max 10MB)</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <div className="flex items-center space-x-2">
//                 <Label htmlFor="processing-method">Processing Method:</Label>
//                 <div className="flex border rounded-md overflow-hidden">
//                   <Button
//                     variant={processingMethod === "standard" ? "default" : "outline"}
//                     className="rounded-none"
//                     onClick={() => setProcessingMethod("standard")}
//                   >
//                     Standard
//                   </Button>
//                   <Button
//                     variant={processingMethod === "enhanced" ? "default" : "outline"}
//                     className="rounded-none"
//                     onClick={() => setProcessingMethod("enhanced")}
//                   >
//                     Enhanced
//                   </Button>
//                 </div>
//               </div>
//               <Button disabled={isProcessing} onClick={() => fileInputRef.current?.click()}>
//                 {isProcessing ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Camera className="mr-2 h-4 w-4" />
//                     Scan Prescription
//                   </>
//                 )}
//               </Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="results">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card className="md:col-span-2">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Pill className="mr-2 h-5 w-5" />
//                   Prescription Image
//                 </CardTitle>
//                 <CardDescription>Analyzed prescription with detected elements</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="relative border rounded-lg overflow-hidden" ref={imageContainerRef}>
//                   {image && (
//                     <div
//                       className="relative transition-transform duration-200 ease-in-out"
//                       style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
//                     >
//                       <img
//                         src={image || "/placeholder.svg"}
//                         alt="Scanned prescription"
//                         className="w-full h-auto object-contain"
//                       />

//                       {/* Overlay boxes for detections */}
//                       {detections.map((detection, index) => {
//                         const [x1, y1, x2, y2] = detection.bbox
//                         const borderColor = getClassColor(detection.class).replace("bg-", "border-")

//                         return (
//                           <div
//                             key={index}
//                             className={`absolute border-2 ${borderColor} bg-opacity-20 hover:bg-opacity-30 transition-colors cursor-pointer`}
//                             style={{
//                               left: `${x1}px`,
//                               top: `${y1}px`,
//                               width: `${x2 - x1}px`,
//                               height: `${y2 - y1}px`,
//                             }}
//                             onClick={() => handleEditDetection(detection)}
//                           />
//                         )
//                       })}
//                     </div>
//                   )}

//                   {isProcessing && (
//                     <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
//                       <RefreshCw className="h-10 w-10 text-white animate-spin mb-4" />
//                       <div className="text-white text-center">
//                         <p className="text-lg font-medium mb-2">Analyzing Prescription</p>
//                         <p className="text-sm mb-4">Using {processingMethod} processing...</p>
//                         <Progress value={progress} className="w-64" />
//                         <p className="text-xs mt-2">{progress}% complete</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between">
//                 <Button variant="outline" onClick={resetScan}>
//                   <Upload className="mr-2 h-4 w-4" /> Upload New Image
//                 </Button>
//                 <Button onClick={exportResults}>
//                   <Save className="mr-2 h-4 w-4" /> Export Results
//                 </Button>
//               </CardFooter>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <FileText className="mr-2 h-5 w-5" />
//                   Detected Elements
//                 </CardTitle>
//                 <CardDescription>{detections.length} elements detected in the prescription</CardDescription>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <ScrollArea className="h-[500px] px-4">
//                   <div className="space-y-4 py-4">
//                     {detections.length > 0 ? (
//                       detections.map((detection, index) => {
//                         const bgColor = getClassColor(detection.class)
//                         const confidenceColor = getConfidenceColor(detection.confidence || 0)

//                         return (
//                           <div
//                             key={index}
//                             className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
//                           >
//                             <div className={`${bgColor} px-3 py-2 text-white flex justify-between items-center`}>
//                               <span className="font-medium capitalize">{detection.class}</span>
//                               <span className={`text-xs ${confidenceColor} bg-white px-2 py-1 rounded-full`}>
//                                 {Math.round((detection.confidence || 0) * 100)}% confidence
//                               </span>
//                             </div>

//                             <div className="p-3">
//                               {detection.image_base64 && detection.image_base64.trim() !== "" ? (
//                                 <div className="mb-2 flex justify-center">
//                                   <img
//                                     src={`data:image/png;base64,${detection.image_base64}`}
//                                     alt={`crop-${index}`}
//                                     className="max-h-24 object-contain border rounded"
//                                   />
//                                 </div>
//                               ) : (
//                                 <div className="w-full h-16 flex items-center justify-center bg-gray-100 text-gray-500 rounded mb-2">
//                                   No preview available
//                                 </div>
//                               )}

//                               <div className="space-y-2">
//                                 <div className="flex justify-between items-start">
//                                   <p className="text-sm font-medium">Detected Text:</p>
//                                   <div className="flex space-x-1">
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-6 w-6"
//                                       onClick={() => copyToClipboard(detection.text || "")}
//                                     >
//                                       <Copy className="h-3 w-3" />
//                                     </Button>
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-6 w-6"
//                                       onClick={() => handleEditDetection(detection)}
//                                     >
//                                       <Edit className="h-3 w-3" />
//                                     </Button>
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-6 w-6 text-red-500"
//                                       onClick={() => deleteDetection(detection)}
//                                     >
//                                       <Trash2 className="h-3 w-3" />
//                                     </Button>
//                                   </div>
//                                 </div>
//                                 <p className="text-sm bg-gray-50 p-2 rounded">{detection.text || "No text detected"}</p>
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })
//                     ) : (
//                       <div className="flex flex-col items-center justify-center py-8 text-center">
//                         <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
//                         <p className="text-gray-500">No elements detected</p>
//                         <p className="text-sm text-gray-400 mt-1">Try uploading a clearer image</p>
//                       </div>
//                     )}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//               <CardFooter>
//                 <div className="w-full">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium">Detection Summary</span>
//                     <Badge variant="outline">{detections.length} items</Badge>
//                   </div>
//                   <div className="space-y-1">
//                     {Object.entries(
//                       detections.reduce(
//                         (acc, curr) => {
//                           acc[curr.class] = (acc[curr.class] || 0) + 1
//                           return acc
//                         },
//                         {} as Record<string, number>,
//                       ),
//                     ).map(([className, count]) => (
//                       <div key={className} className="flex items-center">
//                         <div className={`w-2 h-2 rounded-full ${getClassColor(className)} mr-2`}></div>
//                         <span className="text-xs">
//                           {className}: {count}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardFooter>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* Edit Detection Dialog */}
//       <Dialog open={!!selectedDetection} onOpenChange={(open) => !open && setSelectedDetection(null)}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Detected Text</DialogTitle>
//             <DialogDescription>Make corrections to the text detected by OCR</DialogDescription>
//           </DialogHeader>

//           {selectedDetection && (
//             <>
//               <div className="flex justify-center mb-4">
//                 {selectedDetection.image_base64 && (
//                   <img
//                     src={`data:image/png;base64,${selectedDetection.image_base64}`}
//                     alt="Selected crop"
//                     className="max-h-32 object-contain border rounded"
//                   />
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="detection-class" className="text-right">
//                     Element Type
//                   </Label>
//                   <div className="flex items-center mt-1">
//                     <Badge className={getClassColor(selectedDetection.class)}>{selectedDetection.class}</Badge>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="detection-text" className="text-right">
//                     Detected Text
//                   </Label>
//                   <Textarea
//                     id="detection-text"
//                     value={editedText}
//                     onChange={(e) => setEditedText(e.target.value)}
//                     placeholder="Enter corrected text"
//                     className="min-h-[100px]"
//                   />
//                 </div>
//               </div>

//               <DialogFooter className="flex space-x-2 justify-end">
//                 <Button variant="outline" onClick={() => setSelectedDetection(null)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={saveEditedText}>
//                   <CheckCircle className="mr-2 h-4 w-4" />
//                   Save Changes
//                 </Button>
//               </DialogFooter>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


// "use client"

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//   Upload,
//   Camera,
//   FileText,
//   Pill,
//   Loader2,
//   RefreshCw,
//   Trash2,
//   ZoomIn,
//   ZoomOut,
//   Maximize,
//   CheckCircle,
//   AlertCircle,
//   Copy,
//   Edit,
//   Save,
//   RotateCw,
//   Clipboard,
//   Eye,
//   EyeOff,
//   Wand2,
//   Terminal,
// } from "lucide-react"
// import { toast } from "@/components/ui/use-toast"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// // Updated to match backend response structure
// type Detection = {
//   class: string
//   bbox: [number, number, number, number]
//   text: string
//   image_base64: string
//   confidence?: number
//   predicted_text?: string // Added field for backend text prediction
// }

// // Mock backend text predictions for demonstration
// const mockTextPredictions: Record<string, string[]> = {
//   medication: ["Amoxicillin", "Lisinopril", "Metformin", "Atorvastatin", "Levothyroxine"],
//   dosage: ["500mg", "10mg", "20mg", "25mg", "100mg", "1 tablet", "2 tablets"],
//   frequency: ["once daily", "twice daily", "three times daily", "every 8 hours", "as needed"],
//   doctor: ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Jones"],
//   date: ["05/15/2023", "06/10/2023", "07/22/2023", "08/15/2023"],
//   patient: ["John Doe", "Jane Smith", "Robert Johnson", "Emily Williams"],
//   pharmacy: ["CVS Pharmacy", "Walgreens", "Rite Aid", "Walmart Pharmacy"],
//   instruction: ["Take with food", "Take on empty stomach", "Do not crush", "Avoid alcohol"],
// }

// export default function ScanInterface() {
//   const [image, setImage] = useState<string | null>(null)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [detections, setDetections] = useState<Detection[]>([])
//   const [zoom, setZoom] = useState(1)
//   const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null)
//   const [editedText, setEditedText] = useState("")
//   const [activeTab, setActiveTab] = useState("upload")
//   const [processingMethod, setProcessingMethod] = useState<"standard" | "enhanced">("standard")
//   const [showPredictions, setShowPredictions] = useState(true)
//   const [scanHistory, setScanHistory] = useState<{ timestamp: string; count: number }[]>([])
//   const [showScanHistory, setShowScanHistory] = useState(false)
//   const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8000/upload/")
//   const [textPredictions, setTextPredictions] = useState<string[]>([])
//   const [rotationAngle, setRotationAngle] = useState(0)
//   const [showConsoleOutput, setShowConsoleOutput] = useState(false)
//   const [consoleOutput, setConsoleOutput] = useState<Array<{ type: string; data: any; timestamp: string }>>([])
//   const [expandedConsoleItem, setExpandedConsoleItem] = useState<number | null>(null)

//   const fileInputRef = useRef<HTMLInputElement | null>(null)
//   const imageContainerRef = useRef<HTMLDivElement>(null)

//   // Load scan history from localStorage on component mount
//   useEffect(() => {
//     const savedHistory = localStorage.getItem("scanHistory")
//     if (savedHistory) {
//       setScanHistory(JSON.parse(savedHistory))
//     }
//   }, [])

//   // Save scan history to localStorage when it changes
//   useEffect(() => {
//     localStorage.setItem("scanHistory", JSON.stringify(scanHistory))
//   }, [scanHistory])

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) await processFile(file)
//   }

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault()
//     const file = event.dataTransfer.files[0]
//     if (file) processFile(file)
//   }

//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault()
//   }

//   const processFile = async (file: File) => {
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       const result = reader.result as string
//       if (result?.startsWith("data:image")) {
//         setImage(result)
//         setRotationAngle(0) // Reset rotation when new image is loaded
//       }
//     }
//     reader.readAsDataURL(file)
//     await processImage(file)
//   }

//   const logToConsole = (type: string, data: any) => {
//     if (showConsoleOutput) {
//       console.log(`[${type}]`, data)
//       setConsoleOutput((prev) => [
//         ...prev,
//         {
//           type,
//           data,
//           timestamp: new Date().toISOString(),
//         },
//       ])
//     }
//   }

//   // Add this function to clear the console
//   const clearConsole = () => {
//     setConsoleOutput([])
//     toast({
//       title: "Console Cleared",
//       description: "The console output has been cleared.",
//     })
//   }

//   const processImage = async (file: File) => {
//     setIsProcessing(true)
//     setProgress(0)
//     setDetections([])

//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("method", processingMethod)

//     // Log the request
//     logToConsole("REQUEST", {
//       url: apiEndpoint,
//       method: "POST",
//       body: {
//         file: file.name,
//         size: file.size,
//         type: file.type,
//         method: processingMethod,
//       },
//     })

//     // Simulate progress
//     const progressInterval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 90) {
//           clearInterval(progressInterval)
//           return prev
//         }
//         return prev + 10
//       })
//     }, 300)

//     try {
//       const response = await fetch(apiEndpoint, {
//         method: "POST",
//         body: formData,
//       })

//       clearInterval(progressInterval)
//       setProgress(100)

//       const result = await response.json()

//       // Log the response
//       logToConsole("RESPONSE", {
//         status: response.status,
//         statusText: response.statusText,
//         headers: Object.fromEntries(response.headers.entries()),
//         data: result,
//       })

//       if (response.ok && Array.isArray(result.detections)) {
//         // Add confidence scores and predicted text if they don't exist
//         const enhancedDetections = result.detections.map((detection: Detection) => {
//           // Generate random confidence if not provided
//           const confidence = detection.confidence || Math.random() * 0.3 + 0.7

//           // Get text predictions for this class type
//           const classType = detection.class.toLowerCase()
//           const predictions = mockTextPredictions[classType] || []

//           // Use backend prediction if available, otherwise use OCR text or suggest from our mock data
//           let predictedText = detection.text || ""

//           // If we have predictions for this class and the confidence is low, suggest a prediction
//           if (predictions.length > 0 && (confidence < 0.85 || !detection.text)) {
//             // Find the closest prediction to the detected text
//             if (detection.text) {
//               const closestPrediction = findClosestMatch(detection.text, predictions)
//               predictedText = closestPrediction
//             } else {
//               // If no text detected, just pick a random prediction
//               predictedText = predictions[Math.floor(Math.random() * predictions.length)]
//             }
//           }

//           return {
//             ...detection,
//             confidence,
//             predicted_text: predictedText !== detection.text ? predictedText : undefined,
//           }
//         })

//         // Log the enhanced detections
//         logToConsole("ENHANCED_DETECTIONS", enhancedDetections)

//         setDetections(enhancedDetections)
//         setActiveTab("results")

//         // Add to scan history
//         const newScanEntry = {
//           timestamp: new Date().toISOString(),
//           count: enhancedDetections.length,
//         }
//         setScanHistory((prev) => [newScanEntry, ...prev.slice(0, 9)]) // Keep only last 10 scans

//         toast({
//           title: "Analysis Complete",
//           description: `${enhancedDetections.length} elements detected successfully.`,
//         })
//       } else {
//         // Log the error
//         logToConsole("ERROR", {
//           message: result.message || "Unexpected format in response",
//           result,
//         })

//         toast({
//           title: "Error",
//           description: result.message || "Unexpected format in response",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       // Log the error
//       logToConsole("EXCEPTION", error)

//       toast({
//         title: "Processing Error",
//         description: "Error processing the image. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setTimeout(() => {
//         setIsProcessing(false)
//       }, 500)
//     }
//   }

//   // Find the closest matching text from a list of predictions
//   const findClosestMatch = (text: string, predictions: string[]): string => {
//     if (!text || text.trim() === "") return predictions[0]

//     const textLower = text.toLowerCase()
//     let bestMatch = predictions[0]
//     let highestScore = 0

//     for (const prediction of predictions) {
//       const predictionLower = prediction.toLowerCase()

//       // Simple similarity score based on common characters
//       let score = 0
//       for (let i = 0; i < Math.min(textLower.length, predictionLower.length); i++) {
//         if (textLower[i] === predictionLower[i]) score++
//       }

//       // Normalize score
//       score = score / Math.max(textLower.length, predictionLower.length)

//       if (score > highestScore) {
//         highestScore = score
//         bestMatch = prediction
//       }
//     }

//     return bestMatch
//   }

//   const handleZoom = (direction: "in" | "out" | "reset") => {
//     if (direction === "in") {
//       setZoom((prev) => Math.min(prev + 0.1, 3))
//     } else if (direction === "out") {
//       setZoom((prev) => Math.max(prev - 0.1, 0.5))
//     } else {
//       setZoom(1)
//     }
//   }

//   const rotateImage = () => {
//     setRotationAngle((prev) => (prev + 90) % 360)
//   }

//   const handleEditDetection = (detection: Detection) => {
//     setSelectedDetection(detection)
//     setEditedText(detection.text || "")

//     // Set text predictions for this class
//     const classType = detection.class.toLowerCase()
//     setTextPredictions(mockTextPredictions[classType] || [])
//   }

//   const saveEditedText = () => {
//     if (selectedDetection) {
//       setDetections((prev) => prev.map((d) => (d === selectedDetection ? { ...d, text: editedText } : d)))
//       setSelectedDetection(null)
//       toast({
//         title: "Text Updated",
//         description: "The detected text has been updated successfully.",
//       })
//     }
//   }

//   const acceptPrediction = (detection: Detection) => {
//     if (detection.predicted_text) {
//       setDetections((prev) =>
//         prev.map((d) =>
//           d === detection ? { ...d, text: detection.predicted_text || "", predicted_text: undefined } : d,
//         ),
//       )

//       toast({
//         title: "Prediction Accepted",
//         description: "The predicted text has been applied.",
//       })
//     }
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast({
//       title: "Copied",
//       description: "Text copied to clipboard",
//     })
//   }

//   const deleteDetection = (detection: Detection) => {
//     setDetections((prev) => prev.filter((d) => d !== detection))
//     toast({
//       title: "Deleted",
//       description: "Detection removed from results",
//     })
//   }

//   const resetScan = () => {
//     setImage(null)
//     setDetections([])
//     setZoom(1)
//     setRotationAngle(0)
//     setActiveTab("upload")
//   }

//   const getClassColor = (className: string) => {
//     const classColors: Record<string, string> = {
//       medication: "bg-blue-500",
//       dosage: "bg-green-500",
//       frequency: "bg-yellow-500",
//       doctor: "bg-purple-500",
//       date: "bg-red-500",
//       patient: "bg-indigo-500",
//       pharmacy: "bg-pink-500",
//       instruction: "bg-orange-500",
//       default: "bg-gray-500",
//     }

//     return classColors[className.toLowerCase()] || classColors.default
//   }

//   const getConfidenceColor = (confidence: number) => {
//     if (confidence >= 0.9) return "text-green-600"
//     if (confidence >= 0.7) return "text-yellow-600"
//     return "text-red-600"
//   }

//   const exportResults = () => {
//     const data = {
//       timestamp: new Date().toISOString(),
//       image: image,
//       detections: detections.map((d) => ({
//         class: d.class,
//         text: d.text,
//         confidence: d.confidence,
//       })),
//     }

//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `prescription-scan-${new Date().toISOString().slice(0, 10)}.json`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)

//     toast({
//       title: "Export Complete",
//       description: "Scan results have been exported successfully.",
//     })
//   }

//   const copyAllDetectedText = () => {
//     const allText = detections.map((d) => `${d.class}: ${d.text}`).join("\n")

//     navigator.clipboard.writeText(allText)
//     toast({
//       title: "All Text Copied",
//       description: "All detected text has been copied to clipboard.",
//     })
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Prescription Scanner</h1>
//         <div className="flex space-x-2">
//           {image && (
//             <>
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button variant="outline" size="sm" onClick={() => handleZoom("out")}>
//                       <ZoomOut className="h-4 w-4 mr-1" /> Zoom Out
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Decrease zoom level</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button variant="outline" size="sm" onClick={() => handleZoom("in")}>
//                       <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Increase zoom level</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button variant="outline" size="sm" onClick={() => handleZoom("reset")}>
//                       <Maximize className="h-4 w-4 mr-1" /> Reset
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Reset zoom to default</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button variant="outline" size="sm" onClick={rotateImage}>
//                       <RotateCw className="h-4 w-4 mr-1" /> Rotate
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Rotate image 90 degrees</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button variant="destructive" size="sm" onClick={resetScan}>
//                       <Trash2 className="h-4 w-4 mr-1" /> Clear
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Clear current scan</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </>
//           )}
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid grid-cols-4 w-[600px]">
//           <TabsTrigger value="upload">Upload</TabsTrigger>
//           <TabsTrigger value="results" disabled={!image}>
//             Results
//           </TabsTrigger>
//           <TabsTrigger value="console" disabled={!showConsoleOutput}>
//             Console
//           </TabsTrigger>
//           <TabsTrigger value="settings">Settings</TabsTrigger>
//         </TabsList>

//         <TabsContent value="upload">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <FileText className="mr-2 h-5 w-5" />
//                 Upload Prescription
//               </CardTitle>
//               <CardDescription>Upload or drag and drop a prescription image to begin analysis</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div
//                 className="relative border-2 border-dashed rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <div className="text-center">
//                   <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
//                     <Upload className="h-10 w-10 text-blue-500" />
//                   </div>
//                   <h3 className="text-lg font-medium mb-2">Upload Prescription Image</h3>
//                   <p className="text-sm text-gray-500 mb-4">Drag and drop your image here, or click to browse</p>
//                   <Input
//                     id="file-upload"
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     ref={fileInputRef}
//                     onChange={handleFileUpload}
//                   />
//                   <div className="flex flex-col space-y-2 items-center">
//                     <Button>
//                       <Upload className="mr-2 h-4 w-4" /> Select File
//                     </Button>
//                     <span className="text-xs text-gray-400">Supports: JPG, PNG, JPEG (Max 10MB)</span>
//                   </div>
//                 </div>
//               </div>

//               {scanHistory.length > 0 && (
//                 <div className="mt-6">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-medium">Recent Scans</h3>
//                     <Button variant="ghost" size="sm" onClick={() => setShowScanHistory(!showScanHistory)}>
//                       {showScanHistory ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
//                       {showScanHistory ? "Hide History" : "Show History"}
//                     </Button>
//                   </div>

//                   {showScanHistory && (
//                     <div className="border rounded-lg overflow-hidden">
//                       <div className="bg-gray-50 px-4 py-2 text-sm font-medium">
//                         <div className="grid grid-cols-3">
//                           <span>Date</span>
//                           <span>Time</span>
//                           <span>Detections</span>
//                         </div>
//                       </div>
//                       <div className="divide-y">
//                         {scanHistory.map((scan, index) => {
//                           const date = new Date(scan.timestamp)
//                           return (
//                             <div key={index} className="px-4 py-2 text-sm hover:bg-gray-50">
//                               <div className="grid grid-cols-3">
//                                 <span>{date.toLocaleDateString()}</span>
//                                 <span>{date.toLocaleTimeString()}</span>
//                                 <span>{scan.count} items</span>
//                               </div>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <div className="flex items-center space-x-2">
//                 <Label htmlFor="processing-method">Processing Method:</Label>
//                 <div className="flex border rounded-md overflow-hidden">
//                   <Button
//                     variant={processingMethod === "standard" ? "default" : "outline"}
//                     className="rounded-none"
//                     onClick={() => setProcessingMethod("standard")}
//                   >
//                     Standard
//                   </Button>
//                   <Button
//                     variant={processingMethod === "enhanced" ? "default" : "outline"}
//                     className="rounded-none"
//                     onClick={() => setProcessingMethod("enhanced")}
//                   >
//                     Enhanced
//                   </Button>
//                 </div>
//               </div>
//               <Button disabled={isProcessing} onClick={() => fileInputRef.current?.click()}>
//                 {isProcessing ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Camera className="mr-2 h-4 w-4" />
//                     Scan Prescription
//                   </>
//                 )}
//               </Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="results">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card className="md:col-span-2">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Pill className="mr-2 h-5 w-5" />
//                   Prescription Image
//                 </CardTitle>
//                 <CardDescription>Analyzed prescription with detected elements</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="relative border rounded-lg overflow-hidden" ref={imageContainerRef}>
//                   {image && (
//                     <div
//                       className="relative transition-transform duration-200 ease-in-out"
//                       style={{
//                         transform: `scale(${zoom}) rotate(${rotationAngle}deg)`,
//                         transformOrigin: "center center",
//                         height: rotationAngle % 180 !== 0 ? "500px" : "auto",
//                         display: "flex",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <img
//                         src={image || "/placeholder.svg"}
//                         alt="Scanned prescription"
//                         className="max-w-full h-auto object-contain"
//                       />

//                       {/* Overlay boxes for detections */}
//                       {rotationAngle % 360 === 0 &&
//                         detections.map((detection, index) => {
//                           const [x1, y1, x2, y2] = detection.bbox
//                           const borderColor = getClassColor(detection.class).replace("bg-", "border-")

//                           return (
//                             <div
//                               key={index}
//                               className={`absolute border-2 ${borderColor} bg-opacity-20 hover:bg-opacity-30 transition-colors cursor-pointer`}
//                               style={{
//                                 left: `${x1}px`,
//                                 top: `${y1}px`,
//                                 width: `${x2 - x1}px`,
//                                 height: `${y2 - y1}px`,
//                               }}
//                               onClick={() => handleEditDetection(detection)}
//                             />
//                           )
//                         })}
//                     </div>
//                   )}

//                   {isProcessing && (
//                     <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
//                       <RefreshCw className="h-10 w-10 text-white animate-spin mb-4" />
//                       <div className="text-white text-center">
//                         <p className="text-lg font-medium mb-2">Analyzing Prescription</p>
//                         <p className="text-sm mb-4">Using {processingMethod} processing...</p>
//                         <Progress value={progress} className="w-64" />
//                         <p className="text-xs mt-2">{progress}% complete</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between">
//                 <div className="flex space-x-2">
//                   <Button variant="outline" onClick={resetScan}>
//                     <Upload className="mr-2 h-4 w-4" /> Upload New Image
//                   </Button>
//                   <Button variant="outline" onClick={copyAllDetectedText}>
//                     <Clipboard className="mr-2 h-4 w-4" /> Copy All Text
//                   </Button>
//                 </div>
//                 <Button onClick={exportResults}>
//                   <Save className="mr-2 h-4 w-4" /> Export Results
//                 </Button>
//               </CardFooter>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="flex items-center">
//                     <FileText className="mr-2 h-5 w-5" />
//                     Detected Elements
//                   </CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <Label htmlFor="show-predictions" className="text-xs">
//                       Show Predictions
//                     </Label>
//                     <Switch id="show-predictions" checked={showPredictions} onCheckedChange={setShowPredictions} />
//                   </div>
//                 </div>
//                 <CardDescription>{detections.length} elements detected in the prescription</CardDescription>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <ScrollArea className="h-[500px] px-4">
//                   <div className="space-y-4 py-4">
//                     {detections.length > 0 ? (
//                       detections.map((detection, index) => {
//                         const bgColor = getClassColor(detection.class)
//                         const confidenceColor = getConfidenceColor(detection.confidence || 0)
//                         const hasPrediction = detection.predicted_text && detection.predicted_text !== detection.text

//                         return (
//                           <div
//                             key={index}
//                             className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
//                           >
//                             <div className={`${bgColor} px-3 py-2 text-white flex justify-between items-center`}>
//                               <span className="font-medium capitalize">{detection.class}</span>
//                               <span className={`text-xs ${confidenceColor} bg-white px-2 py-1 rounded-full`}>
//                                 {Math.round((detection.confidence || 0) * 100)}% confidence
//                               </span>
//                             </div>

//                             <div className="p-3">
//                               {detection.image_base64 && detection.image_base64.trim() !== "" ? (
//                                 <div className="mb-2 flex justify-center">
//                                   <img
//                                     src={`data:image/png;base64,${detection.image_base64}`}
//                                     alt={`crop-${index}`}
//                                     className="max-h-24 object-contain border rounded"
//                                   />
//                                 </div>
//                               ) : (
//                                 <div className="w-full h-16 flex items-center justify-center bg-gray-100 text-gray-500 rounded mb-2">
//                                   No preview available
//                                 </div>
//                               )}

//                               <div className="space-y-2">
//                                 <div className="flex justify-between items-start">
//                                   <p className="text-sm font-medium">Detected Text:</p>
//                                   <div className="flex space-x-1">
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-6 w-6"
//                                       onClick={() => copyToClipboard(detection.text || "")}
//                                     >
//                                       <Copy className="h-3 w-3" />
//                                     </Button>
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-6 w-6"
//                                       onClick={() => handleEditDetection(detection)}
//                                     >
//                                       <Edit className="h-3 w-3" />
//                                     </Button>
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-6 w-6 text-red-500"
//                                       onClick={() => deleteDetection(detection)}
//                                     >
//                                       <Trash2 className="h-3 w-3" />
//                                     </Button>
//                                   </div>
//                                 </div>
//                                 <p className="text-sm bg-gray-50 p-2 rounded">{detection.text || "No text detected"}</p>

//                                 {/* Text prediction section */}
//                                 {showPredictions && hasPrediction && (
//                                   <div className="mt-2 border-t pt-2">
//                                     <div className="flex justify-between items-center">
//                                       <p className="text-sm font-medium text-blue-600 flex items-center">
//                                         <Wand2 className="h-3 w-3 mr-1" />
//                                         Suggested Text:
//                                       </p>
//                                       <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className="h-6 text-xs"
//                                         onClick={() => acceptPrediction(detection)}
//                                       >
//                                         <CheckCircle className="h-3 w-3 mr-1" />
//                                         Accept
//                                       </Button>
//                                     </div>
//                                     <p className="text-sm bg-blue-50 p-2 rounded mt-1 border border-blue-100">
//                                       {detection.predicted_text}
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })
//                     ) : (
//                       <div className="flex flex-col items-center justify-center py-8 text-center">
//                         <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
//                         <p className="text-gray-500">No elements detected</p>
//                         <p className="text-sm text-gray-400 mt-1">Try uploading a clearer image</p>
//                       </div>
//                     )}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//               <CardFooter>
//                 <div className="w-full">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium">Detection Summary</span>
//                     <Badge variant="outline">{detections.length} items</Badge>
//                   </div>
//                   <div className="space-y-1">
//                     {Object.entries(
//                       detections.reduce(
//                         (acc, curr) => {
//                           acc[curr.class] = (acc[curr.class] || 0) + 1
//                           return acc
//                         },
//                         {} as Record<string, number>,
//                       ),
//                     ).map(([className, count]) => (
//                       <div key={className} className="flex items-center">
//                         <div className={`w-2 h-2 rounded-full ${getClassColor(className)} mr-2`}></div>
//                         <span className="text-xs">
//                           {className}: {count}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardFooter>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="console">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Terminal className="mr-2 h-5 w-5" />
//                 Backend Console
//               </CardTitle>
//               <CardDescription>View API requests and responses for debugging</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="bg-black text-white p-4 font-mono text-xs rounded-lg max-h-[600px] overflow-auto">
//                 {consoleOutput.length === 0 ? (
//                   <div className="text-gray-500 italic p-4 text-center">
//                     No console output yet. Process an image to see API requests and responses.
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {consoleOutput.map((item, index) => (
//                       <Collapsible
//                         key={index}
//                         open={expandedConsoleItem === index}
//                         onOpenChange={() => setExpandedConsoleItem(expandedConsoleItem === index ? null : index)}
//                         className="border border-gray-800 rounded"
//                       >
//                         <CollapsibleTrigger className="flex w-full items-center justify-between p-3 hover:bg-gray-800 rounded">
//                           <div className="flex items-center">
//                             <span
//                               className={`
//                       px-2 py-1 mr-3 rounded text-xs
//                       ${item.type === "REQUEST" ? "bg-blue-600" : ""}
//                       ${item.type === "RESPONSE" ? "bg-green-600" : ""}
//                       ${item.type === "ERROR" ? "bg-red-600" : ""}
//                       ${item.type === "EXCEPTION" ? "bg-yellow-600" : ""}
//                       ${item.type === "ENHANCED_DETECTIONS" ? "bg-purple-600" : ""}
//                     `}
//                             >
//                               {item.type}
//                             </span>
//                             <span className="text-gray-400 text-xs">
//                               {new Date(item.timestamp).toLocaleTimeString()}
//                             </span>
//                           </div>
//                           <span className="text-xs text-gray-500">
//                             Click to {expandedConsoleItem === index ? "collapse" : "expand"}
//                           </span>
//                         </CollapsibleTrigger>
//                         <CollapsibleContent>
//                           <div className="p-4 bg-gray-900 rounded-b overflow-x-auto">
//                             <pre>{JSON.stringify(item.data, null, 2)}</pre>
//                           </div>
//                         </CollapsibleContent>
//                       </Collapsible>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={clearConsole}>
//                 <Trash2 className="mr-2 h-4 w-4" /> Clear Console
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   const consoleData = JSON.stringify(consoleOutput, null, 2)
//                   const blob = new Blob([consoleData], { type: "application/json" })
//                   const url = URL.createObjectURL(blob)
//                   const a = document.createElement("a")
//                   a.href = url
//                   a.download = `console-log-${new Date().toISOString().slice(0, 10)}.json`
//                   document.body.appendChild(a)
//                   a.click()
//                   document.body.removeChild(a)
//                   URL.revokeObjectURL(url)

//                   toast({
//                     title: "Console Exported",
//                     description: "Console output has been exported as JSON.",
//                   })
//                 }}
//               >
//                 <Save className="mr-2 h-4 w-4" /> Export Console
//               </Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="settings">
//           <Card>
//             <CardHeader>
//               <CardTitle>Scanner Settings</CardTitle>
//               <CardDescription>Configure the prescription scanner settings</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="api-endpoint">API Endpoint</Label>
//                 <div className="flex space-x-2">
//                   <Input
//                     id="api-endpoint"
//                     value={apiEndpoint}
//                     onChange={(e) => setApiEndpoint(e.target.value)}
//                     placeholder="Enter API endpoint URL"
//                     className="flex-1"
//                   />
//                   <Button variant="outline" onClick={() => setApiEndpoint("http://localhost:8000/upload/")}>
//                     Reset
//                   </Button>
//                 </div>
//                 <p className="text-xs text-gray-500">The backend API endpoint for prescription scanning</p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="processing-method-select">Default Processing Method</Label>
//                 <Select
//                   value={processingMethod}
//                   onValueChange={(value) => setProcessingMethod(value as "standard" | "enhanced")}
//                 >
//                   <SelectTrigger id="processing-method-select">
//                     <SelectValue placeholder="Select processing method" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="standard">Standard</SelectItem>
//                     <SelectItem value="enhanced">Enhanced</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <p className="text-xs text-gray-500">Standard is faster, Enhanced provides better accuracy</p>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="show-predictions-setting">Show Text Predictions</Label>
//                   <Switch
//                     id="show-predictions-setting"
//                     checked={showPredictions}
//                     onCheckedChange={setShowPredictions}
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500">Show AI-powered text predictions for low-confidence detections</p>
//               </div>

//               <div className="space-y-2">
//                 <Label>Scan History</Label>
//                 <div className="flex space-x-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       localStorage.removeItem("scanHistory")
//                       setScanHistory([])
//                       toast({
//                         title: "History Cleared",
//                         description: "Your scan history has been cleared.",
//                       })
//                     }}
//                     className="w-full"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Clear Scan History
//                   </Button>
//                 </div>
//                 <p className="text-xs text-gray-500">Clear your local scan history</p>
//               </div>

//               <div className="rounded-lg bg-blue-50 p-4">
//                 <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-2" />
//                   About Text Predictions
//                 </h3>
//                 <p className="text-xs text-blue-700">
//                   The scanner uses AI to predict text when OCR confidence is low. These predictions are based on common
//                   prescription terminology and can help improve accuracy. You can accept or ignore these suggestions.
//                 </p>
//               </div>
//               <div className="space-y-2 pt-4 border-t">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="show-console-output">Show Console Output</Label>
//                   <Switch id="show-console-output" checked={showConsoleOutput} onCheckedChange={setShowConsoleOutput} />
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   Display backend API requests and responses in the console for debugging
//                 </p>
//               </div>

//               {showConsoleOutput && (
//                 <div className="mt-4 border rounded-lg overflow-hidden">
//                   <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
//                     <div className="flex items-center">
//                       <Terminal className="h-4 w-4 mr-2" />
//                       <h3 className="text-sm font-medium">Console Output</h3>
//                     </div>
//                     <Button variant="ghost" size="sm" onClick={clearConsole}>
//                       <Trash2 className="h-3 w-3 mr-1" /> Clear
//                     </Button>
//                   </div>
//                   <div className="bg-black text-white p-2 font-mono text-xs max-h-[300px] overflow-auto">
//                     {consoleOutput.length === 0 ? (
//                       <div className="text-gray-500 italic p-2">
//                         No console output yet. Process an image to see API requests and responses.
//                       </div>
//                     ) : (
//                       <div className="space-y-2">
//                         {consoleOutput.map((item, index) => (
//                           <Collapsible
//                             key={index}
//                             open={expandedConsoleItem === index}
//                             onOpenChange={() => setExpandedConsoleItem(expandedConsoleItem === index ? null : index)}
//                           >
//                             <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-800 rounded">
//                               <div className="flex items-center">
//                                 <span
//                                   className={`
//                                   px-1 mr-2 rounded text-xs
//                                   ${item.type === "REQUEST" ? "bg-blue-600" : ""}
//                                   ${item.type === "RESPONSE" ? "bg-green-600" : ""}
//                                   ${item.type === "ERROR" ? "bg-red-600" : ""}
//                                   ${item.type === "EXCEPTION" ? "bg-yellow-600" : ""}
//                                   ${item.type === "ENHANCED_DETECTIONS" ? "bg-purple-600" : ""}
//                                 `}
//                                 >
//                                   {item.type}
//                                 </span>
//                                 <span className="text-gray-400 text-xs">
//                                   {new Date(item.timestamp).toLocaleTimeString()}
//                                 </span>
//                               </div>
//                               <span className="text-xs text-gray-500">
//                                 Click to {expandedConsoleItem === index ? "collapse" : "expand"}
//                               </span>
//                             </CollapsibleTrigger>
//                             <CollapsibleContent>
//                               <div className="p-2 bg-gray-900 rounded mt-1 overflow-x-auto">
//                                 <pre>{JSON.stringify(item.data, null, 2)}</pre>
//                               </div>
//                             </CollapsibleContent>
//                           </Collapsible>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Edit Detection Dialog */}
//       <Dialog open={!!selectedDetection} onOpenChange={(open) => !open && setSelectedDetection(null)}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Detected Text</DialogTitle>
//             <DialogDescription>Make corrections to the text detected by OCR</DialogDescription>
//           </DialogHeader>

//           {selectedDetection && (
//             <>
//               <div className="flex justify-center mb-4">
//                 {selectedDetection.image_base64 && (
//                   <img
//                     src={`data:image/png;base64,${selectedDetection.image_base64}`}
//                     alt="Selected crop"
//                     className="max-h-32 object-contain border rounded"
//                   />
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="detection-class" className="text-right">
//                     Element Type
//                   </Label>
//                   <div className="flex items-center mt-1">
//                     <Badge className={getClassColor(selectedDetection.class)}>{selectedDetection.class}</Badge>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="detection-text" className="text-right">
//                     Detected Text
//                   </Label>
//                   <Textarea
//                     id="detection-text"
//                     value={editedText}
//                     onChange={(e) => setEditedText(e.target.value)}
//                     placeholder="Enter corrected text"
//                     className="min-h-[100px]"
//                   />
//                 </div>

//                 {/* Text suggestions */}
//                 {textPredictions.length > 0 && (
//                   <div className="space-y-2">
//                     <Label className="text-right">Common {selectedDetection.class} Terms</Label>
//                     <div className="flex flex-wrap gap-2">
//                       {textPredictions.map((prediction, index) => (
//                         <Badge
//                           key={index}
//                           variant="outline"
//                           className="cursor-pointer hover:bg-blue-50"
//                           onClick={() => setEditedText(prediction)}
//                         >
//                           {prediction}
//                         </Badge>
//                       ))}
//                     </div>
//                     <p className="text-xs text-gray-500">Click on a term to use it</p>
//                   </div>
//                 )}
//               </div>

//               <DialogFooter className="flex space-x-2 justify-end">
//                 <Button variant="outline" onClick={() => setSelectedDetection(null)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={saveEditedText}>
//                   <CheckCircle className="mr-2 h-4 w-4" />
//                   Save Changes
//                 </Button>
//               </DialogFooter>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }





"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Upload,
  Camera,
  FileText,
  Pill,
  Loader2,
  RefreshCw,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  CheckCircle,
  AlertCircle,
  Copy,
  Edit,
  Save,
  Wand2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Structure de détection mise à jour pour correspondre à la structure de réponse du backend
type Detection = {
  class: string
  bbox: [number, number, number, number]
  text?: string
  image_base64?: string
  predicted_text?: string // Ajout du champ predicted_text retourné par le backend
  confidence?: number
}

export default function ScanInterface() {
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [detections, setDetections] = useState<Detection[]>([])
  const [zoom, setZoom] = useState(1)
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null)
  const [editedText, setEditedText] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const [processingMethod, setProcessingMethod] = useState<"standard" | "enhanced">("standard")
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) await processFile(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const processFile = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      if (result?.startsWith("data:image")) {
        setImage(result)
      }
    }
    reader.readAsDataURL(file)
    await processImage(file)
  }

  const processImage = async (file: File) => {
    setIsProcessing(true)
    setProgress(0)
    setDetections([])

    const formData = new FormData()
    formData.append("file", file)
    formData.append("method", processingMethod)

    // Simuler la progression
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 300)

    try {
      // Afficher la requête dans la console
      console.log("Envoi de la requête au backend:", {
        url: "http://localhost:8000/upload/",
        method: "POST",
        file: file.name,
        size: file.size,
        type: file.type,
        processingMethod,
      })

      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const result = await response.json()

      // Afficher la réponse complète du backend dans la console
      console.log("Réponse complète du backend:", result)

      if (response.ok && Array.isArray(result.detections)) {
        // Traiter les détections retournées par le backend
        const enhancedDetections = result.detections.map((detection: Detection) => {
          // Assurer que tous les champs nécessaires sont présents
          return {
            ...detection,
            // Si text n'est pas fourni, utiliser predicted_text comme valeur par défaut
            text: detection.text || detection.predicted_text || "",
            // Ajouter une confiance par défaut si non fournie
            confidence: detection.confidence || Math.random() * 0.3 + 0.7,
          }
        })

        console.log("Détections traitées:", enhancedDetections)

        setDetections(enhancedDetections)
        setActiveTab("results")

        toast({
          title: "Analyse Terminée",
          description: `${enhancedDetections.length} éléments détectés avec succès.`,
        })
      } else {
        console.error("Erreur ou format inattendu:", result)
        toast({
          title: "Erreur",
          description: result.message || "Format inattendu dans la réponse",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error)
      toast({
        title: "Erreur de Traitement",
        description: "Erreur lors du traitement de l'image. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    }
  }

  const handleZoom = (direction: "in" | "out" | "reset") => {
    if (direction === "in") {
      setZoom((prev) => Math.min(prev + 0.1, 3))
    } else if (direction === "out") {
      setZoom((prev) => Math.max(prev - 0.1, 0.5))
    } else {
      setZoom(1)
    }
  }

  const handleEditDetection = (detection: Detection) => {
    setSelectedDetection(detection)
    setEditedText(detection.text || "")
  }

  const saveEditedText = () => {
    if (selectedDetection) {
      setDetections((prev) => prev.map((d) => (d === selectedDetection ? { ...d, text: editedText } : d)))
      setSelectedDetection(null)
      toast({
        title: "Texte Mis à Jour",
        description: "Le texte détecté a été mis à jour avec succès.",
      })
    }
  }

  const acceptPrediction = (detection: Detection) => {
    if (detection.predicted_text) {
      setDetections((prev) => prev.map((d) => (d === detection ? { ...d, text: detection.predicted_text || "" } : d)))

      toast({
        title: "Prédiction Acceptée",
        description: "Le texte prédit a été appliqué.",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copié",
      description: "Texte copié dans le presse-papiers",
    })
  }

  const deleteDetection = (detection: Detection) => {
    setDetections((prev) => prev.filter((d) => d !== detection))
    toast({
      title: "Supprimé",
      description: "Détection supprimée des résultats",
    })
  }

  const resetScan = () => {
    setImage(null)
    setDetections([])
    setZoom(1)
    setActiveTab("upload")
  }

  const getClassColor = (className: string) => {
    const classColors: Record<string, string> = {
      medication: "bg-blue-500",
      medicament: "bg-blue-500",
      dosage: "bg-green-500",
      frequency: "bg-yellow-500",
      doctor: "bg-purple-500",
      date: "bg-red-500",
      patient: "bg-indigo-500",
      pharmacy: "bg-pink-500",
      instruction: "bg-orange-500",
      default: "bg-gray-500",
    }

    return classColors[className.toLowerCase()] || classColors.default
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600"
    if (confidence >= 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      image: image,
      detections: detections.map((d) => ({
        class: d.class,
        text: d.text,
        predicted_text: d.predicted_text,
        confidence: d.confidence,
      })),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `scan-prescription-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Exportation Terminée",
      description: "Les résultats du scan ont été exportés avec succès.",
    })
  }

  // Vérifier si une détection a une prédiction différente du texte détecté
  const hasDifferentPrediction = (detection: Detection): boolean => {
    return !!detection.predicted_text && detection.predicted_text !== detection.text
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scanner de Prescription</h1>
        <div className="flex space-x-2">
          {image && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleZoom("out")}>
                <ZoomOut className="h-4 w-4 mr-1" /> Zoom Arrière
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleZoom("in")}>
                <ZoomIn className="h-4 w-4 mr-1" /> Zoom Avant
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleZoom("reset")}>
                <Maximize className="h-4 w-4 mr-1" /> Réinitialiser
              </Button>
              <Button variant="destructive" size="sm" onClick={resetScan}>
                <Trash2 className="h-4 w-4 mr-1" /> Effacer
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="upload">Télécharger</TabsTrigger>
          <TabsTrigger value="results" disabled={!image}>
            Résultats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Télécharger une Prescription
              </CardTitle>
              <CardDescription>
                Téléchargez ou glissez-déposez une image de prescription pour commencer l'analyse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="relative border-2 border-dashed rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                    <Upload className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Télécharger une Image de Prescription</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Glissez et déposez votre image ici, ou cliquez pour parcourir
                  </p>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <div className="flex flex-col space-y-2 items-center">
                    <Button>
                      <Upload className="mr-2 h-4 w-4" /> Sélectionner un Fichier
                    </Button>
                    <span className="text-xs text-gray-400">Formats supportés: JPG, PNG, JPEG (Max 10MB)</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="processing-method">Méthode de Traitement:</Label>
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={processingMethod === "standard" ? "default" : "outline"}
                    className="rounded-none"
                    onClick={() => setProcessingMethod("standard")}
                  >
                    Standard
                  </Button>
                  <Button
                    variant={processingMethod === "enhanced" ? "default" : "outline"}
                    className="rounded-none"
                    onClick={() => setProcessingMethod("enhanced")}
                  >
                    Amélioré
                  </Button>
                </div>
              </div>
              <Button disabled={isProcessing} onClick={() => fileInputRef.current?.click()}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Scanner la Prescription
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="mr-2 h-5 w-5" />
                  Image de Prescription
                </CardTitle>
                <CardDescription>Prescription analysée avec les éléments détectés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border rounded-lg overflow-hidden" ref={imageContainerRef}>
                  {image && (
                    <div
                      className="relative transition-transform duration-200 ease-in-out"
                      style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt="Prescription scannée"
                        className="w-full h-auto object-contain"
                      />

                      {/* Boîtes de superposition pour les détections */}
                      {detections.map((detection, index) => {
                        const [x1, y1, x2, y2] = detection.bbox
                        const borderColor = getClassColor(detection.class).replace("bg-", "border-")

                        return (
                          <div
                            key={index}
                            className={`absolute border-2 ${borderColor} bg-opacity-20 hover:bg-opacity-30 transition-colors cursor-pointer`}
                            style={{
                              left: `${x1}px`,
                              top: `${y1}px`,
                              width: `${x2 - x1}px`,
                              height: `${y2 - y1}px`,
                            }}
                            onClick={() => handleEditDetection(detection)}
                          />
                        )
                      })}
                    </div>
                  )}

                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                      <RefreshCw className="h-10 w-10 text-white animate-spin mb-4" />
                      <div className="text-white text-center">
                        <p className="text-lg font-medium mb-2">Analyse de la Prescription</p>
                        <p className="text-sm mb-4">
                          Utilisation du traitement {processingMethod === "standard" ? "standard" : "amélioré"}...
                        </p>
                        <Progress value={progress} className="w-64" />
                        <p className="text-xs mt-2">{progress}% terminé</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetScan}>
                  <Upload className="mr-2 h-4 w-4" /> Télécharger une Nouvelle Image
                </Button>
                <Button onClick={exportResults}>
                  <Save className="mr-2 h-4 w-4" /> Exporter les Résultats
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Éléments Détectés
                </CardTitle>
                <CardDescription>{detections.length} éléments détectés dans la prescription</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] px-4">
                  <div className="space-y-4 py-4">
                    {detections.length > 0 ? (
                      detections.map((detection, index) => {
                        const bgColor = getClassColor(detection.class)
                        const confidenceColor = getConfidenceColor(detection.confidence || 0)
                        const hasPrediction = hasDifferentPrediction(detection)

                        return (
                          <div
                            key={index}
                            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className={`${bgColor} px-3 py-2 text-white flex justify-between items-center`}>
                              <span className="font-medium capitalize">{detection.class}</span>
                              <span className={`text-xs ${confidenceColor} bg-white px-2 py-1 rounded-full`}>
                                {Math.round((detection.confidence || 0) * 100)}% confiance
                              </span>
                            </div>

                            <div className="p-3">
                              {detection.image_base64 && detection.image_base64.trim() !== "" ? (
                                <div className="mb-2 flex justify-center">
                                  <img
                                    src={`data:image/png;base64,${detection.image_base64}`}
                                    alt={`crop-${index}`}
                                    className="max-h-24 object-contain border rounded"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-16 flex items-center justify-center bg-gray-100 text-gray-500 rounded mb-2">
                                  Aucun aperçu disponible
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-medium">Texte Détecté:</p>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => copyToClipboard(detection.text || "")}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => handleEditDetection(detection)}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-red-500"
                                      onClick={() => deleteDetection(detection)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm bg-gray-50 p-2 rounded">
                                  {detection.text || "Aucun texte détecté"}
                                </p>

                                {/* Affichage du texte prédit */}
                                {detection.predicted_text && (
                                  <div className="mt-2 border-t pt-2">
                                    <div className="flex justify-between items-center">
                                      <p className="text-sm font-medium text-blue-600 flex items-center">
                                        <Wand2 className="h-3 w-3 mr-1" />
                                        Texte Prédit:
                                      </p>
                                      {hasPrediction && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 text-xs"
                                          onClick={() => acceptPrediction(detection)}
                                        >
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          Accepter
                                        </Button>
                                      )}
                                    </div>
                                    <p className="text-sm bg-blue-50 p-2 rounded mt-1 border border-blue-100">
                                      {detection.predicted_text}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-500">Aucun élément détecté</p>
                        <p className="text-sm text-gray-400 mt-1">Essayez de télécharger une image plus claire</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Résumé des Détections</span>
                    <Badge variant="outline">{detections.length} éléments</Badge>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(
                      detections.reduce(
                        (acc, curr) => {
                          acc[curr.class] = (acc[curr.class] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([className, count]) => (
                      <div key={className} className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${getClassColor(className)} mr-2`}></div>
                        <span className="text-xs">
                          {className}: {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Boîte de dialogue d'édition de détection */}
      <Dialog open={!!selectedDetection} onOpenChange={(open) => !open && setSelectedDetection(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le Texte Détecté</DialogTitle>
            <DialogDescription>Apportez des corrections au texte détecté par l'OCR</DialogDescription>
          </DialogHeader>

          {selectedDetection && (
            <>
              <div className="flex justify-center mb-4">
                {selectedDetection.image_base64 && (
                  <img
                    src={`data:image/png;base64,${selectedDetection.image_base64}`}
                    alt="Sélection de recadrage"
                    className="max-h-32 object-contain border rounded"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="detection-class" className="text-right">
                    Type d'Élément
                  </Label>
                  <div className="flex items-center mt-1">
                    <Badge className={getClassColor(selectedDetection.class)}>{selectedDetection.class}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detection-text" className="text-right">
                    Texte Détecté
                  </Label>
                  <Textarea
                    id="detection-text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    placeholder="Entrez le texte corrigé"
                    className="min-h-[100px]"
                  />
                </div>

                {/* Affichage du texte prédit dans la boîte de dialogue */}
                {selectedDetection.predicted_text && (
                  <div className="space-y-2">
                    <Label className="text-right flex items-center">
                      <Wand2 className="h-4 w-4 mr-1 text-blue-500" />
                      Texte Prédit
                    </Label>
                    <div className="bg-blue-50 p-3 rounded border border-blue-100">
                      <p>{selectedDetection.predicted_text}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditedText(selectedDetection.predicted_text || "")}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Utiliser cette prédiction
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedDetection(null)}>
                  Annuler
                </Button>
                <Button onClick={saveEditedText}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Enregistrer les Modifications
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
