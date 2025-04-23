"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Camera, Upload, Save, RotateCw, ZoomIn, ZoomOut, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Annotation {
  id: string
  type: "medication" | "dosage" | "frequency" | "doctor"
  text: string
  confidence: number
  bounds: { x: number; y: number; width: number; height: number }
}

export default function ScanInterface() {
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null)
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        processImage()
      }
      reader.readAsDataURL(file)
    }
  }

  const processImage = async () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate processing steps
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setProgress(i)
    }

    // Simulate OCR results
    const mockAnnotations: Annotation[] = [
      {
        id: "1",
        type: "medication",
        text: "Amoxicillin",
        confidence: 0.95,
        bounds: { x: 100, y: 100, width: 150, height: 30 },
      },
      {
        id: "2",
        type: "dosage",
        text: "500mg",
        confidence: 0.92,
        bounds: { x: 260, y: 100, width: 80, height: 30 },
      },
      {
        id: "3",
        type: "frequency",
        text: "Three times daily",
        confidence: 0.88,
        bounds: { x: 100, y: 140, width: 200, height: 30 },
      },
    ]

    setAnnotations(mockAnnotations)
    setIsProcessing(false)
    toast({
      title: "Processing Complete",
      description: "The prescription has been successfully analyzed.",
    })
  }

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotation(annotation)
  }

  const updateAnnotation = (id: string, newText: string) => {
    setAnnotations(annotations.map((ann) => (ann.id === id ? { ...ann, text: newText } : ann)))
    setSelectedAnnotation(null)
    toast({
      title: "Annotation Updated",
      description: "The text has been successfully updated.",
    })
  }

  const handleZoom = (factor: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + factor)))
  }

  const getAnnotationColor = (type: Annotation["type"]) => {
    const colors = {
      medication: "bg-blue-500",
      dosage: "bg-green-500",
      frequency: "bg-yellow-500",
      doctor: "bg-purple-500",
    }
    return colors[type]
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prescription Scanner</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleZoom(-0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => handleZoom(0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Scan Area</CardTitle>
            <CardDescription>Upload or scan a prescription to begin analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-2 border-dashed rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              {!image && (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <label htmlFor="file-upload" className="mt-4 cursor-pointer">
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <Button variant="outline">Upload Prescription</Button>
                  </label>
                  <p className="mt-2 text-sm text-gray-500">or</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-2">
                        <Camera className="mr-2 h-4 w-4" />
                        Scan Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Scan Prescription</DialogTitle>
                        <DialogDescription>Position the prescription within the camera frame</DialogDescription>
                      </DialogHeader>
                      <div className="aspect-video bg-black rounded-lg"></div>
                      <Button
                        onClick={() => {
                          /* Implement camera capture */
                        }}
                      >
                        Capture
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              {image && (
                <div className="relative w-full h-full min-h-[400px]" style={{ transform: `scale(${zoom})` }}>
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Scanned prescription"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  {annotations.map((annotation) => (
                    <div
                      key={annotation.id}
                      className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-pointer"
                      style={{
                        left: `${annotation.bounds.x}px`,
                        top: `${annotation.bounds.y}px`,
                        width: `${annotation.bounds.width}px`,
                        height: `${annotation.bounds.height}px`,
                      }}
                      onClick={() => handleAnnotationClick(annotation)}
                    />
                  ))}
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <RotateCw className="mx-auto h-8 w-8 animate-spin" />
                    <p className="mt-2">Processing...</p>
                    <Progress value={progress} className="w-64 mt-2" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detected Items</CardTitle>
            <CardDescription>Review and edit detected text</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {annotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className="mb-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAnnotationClick(annotation)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={`${getAnnotationColor(annotation.type)} text-white`}>
                      {annotation.type}
                    </Badge>
                    <span className="text-sm text-gray-500">{Math.round(annotation.confidence * 100)}% confident</span>
                  </div>
                  <p className="font-medium">{annotation.text}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={annotations.length === 0}>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </Button>
          </CardFooter>
        </Card>
      </div>

      {selectedAnnotation && (
        <Dialog open={!!selectedAnnotation} onOpenChange={() => setSelectedAnnotation(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit {selectedAnnotation.type}</DialogTitle>
              <DialogDescription>Review and correct the detected text if needed</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Detected Text</Label>
                <Input
                  value={selectedAnnotation.text}
                  onChange={(e) => updateAnnotation(selectedAnnotation.id, e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedAnnotation(null)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={() => updateAnnotation(selectedAnnotation.id, selectedAnnotation.text)}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

