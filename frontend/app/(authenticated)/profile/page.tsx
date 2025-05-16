"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import {
  X,
  Plus,
  Pill,
  Stethoscope,
  Clipboard,
  Activity,
  Edit,
  FileText,
  HeartPulse,
  AlertTriangle,
  User,
  Cake,
  Droplet,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface PatientProfile {
  name: string
  email: string
  dateOfBirth: string
  bio: string
  bloodType: string
  allergies: Array<{ type: string; name: string; reaction: string }>
  medicalHistory: Array<{ condition: string; startYear: number; treatment: string }>
  contraindications: string[]
  weight?: number
  height?: number
  currentMedications: Array<{ name: string; dosage: string; frequency: string }>
  labResults?: { [key: string]: number }
  treatmentPreferences?: { galenicForm: string[]; genericAcceptance: boolean }
  emergencyContact?: { name: string; relationship: string; phone: string }
  consentForDataProcessing: boolean
  profileImage: string
  [key: string]: any
}

export default function PatientProfile() {
  const initialProfile: PatientProfile = {
    name: "Miryam Hfaidhia",
    email: "Miryam.hfaidhia@gmail.com",
    dateOfBirth: "2001-08-08",
    bio: "Patient engaged in proactive health management.",
    bloodType: "A+",
    allergies: [
      { type: "Medication", name: "Penicillin", reaction: "Hives" },
      { type: "Food", name: "Peanuts", reaction: "Edema" },
    ],
    medicalHistory: [
      { condition: "Hypertension", startYear: 2018, treatment: "Lisinopril" },
      { condition: "Type 2 Diabetes", startYear: 2020, treatment: "Metformin" },
    ],
    contraindications: ["Pregnancy", "Renal insufficiency"],
    weight: 68,
    height: 170,
    currentMedications: [
      { name: "Metformin", dosage: "500mg", frequency: "2x/day" },
      { name: "Lisinopril", dosage: "10mg", frequency: "1x/day" },
    ],
    labResults: {
      "Blood Glucose": 1.1,
      Cholesterol: 1.85,
      Creatinine: 80,
    },
    treatmentPreferences: {
      galenicForm: ["Tablet", "Capsule"],
      genericAcceptance: true,
    },
    emergencyContact: {
      name: "Pierre Martin",
      relationship: "Spouse",
      phone: "06 12 34 56 78",
    },
    consentForDataProcessing: true,
    profileImage: "/placeholder-user.jpg",
  }

  const [profile, setProfile] = useState<PatientProfile>(initialProfile)
  const [originalProfile, setOriginalProfile] = useState<PatientProfile>(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    allergies: true,
    medicalHistory: true,
    medications: true,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!response.ok) throw new Error("Failed to load profile")
        const data = await response.json()
        setProfile(data)
        setOriginalProfile(data)
        setProfile(initialProfile)
        setOriginalProfile(initialProfile)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
      }
    }

    fetchProfile()
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const startEditing = () => {
    setOriginalProfile({ ...profile })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setProfile({ ...originalProfile })
    setIsEditing(false)
  }

  const handleNestedChange = (section: string, index: number, field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [section]: prev[section].map((item: any, i: number) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addSectionItem = (section: string, template: any) => {
    setProfile((prev) => ({
      ...prev,
      [section]: [...(prev[section as keyof PatientProfile] as any[]), template],
    }))
  }

  const removeSectionItem = (section: string, index: number) => {
    setProfile((prev) => ({
      ...prev,
      [section]: (prev[section as keyof PatientProfile] as any[]).filter((_, i) => i !== index),
    }))
  }

  const handleChange = (field: keyof PatientProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profileImage: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Simulation of sending
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setShowSuccessDialog(true)
      setOriginalProfile({ ...profile })
      toast({
        title: "Profile updated",
        description: "Your information has been saved",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Failed",
        description: "Error updating profile",
        variant: "destructive",
      })
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const calculateBMI = (weight?: number, height?: number) => {
    if (!weight || !height) return null
    return (weight / (height / 100) ** 2).toFixed(1)
  }

  const bmi = calculateBMI(profile.weight, profile.height)
  const bmiCategory = bmi
    ? Number(bmi) < 18.5
      ? "Underweight"
      : Number(bmi) < 25
        ? "Normal weight"
        : Number(bmi) < 30
          ? "Overweight"
          : "Obesity"
    : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-6"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Medical Profile
          </h1>
          <p className="text-muted-foreground">Manage my health information and preferences</p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={isEditing ? cancelEditing : startEditing} className="gap-2">
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column - Summary */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Card className="border-blue-100">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Identity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-24 h-24 border-4 border-blue-100">
                    <AvatarImage src={profile.profileImage || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback>
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="text-center">
                      <Label
                        htmlFor="profile-image"
                        className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Change photo
                      </Label>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  <p className="text-muted-foreground flex items-center justify-center gap-1">
                    <Cake className="h-4 w-4" />
                    {calculateAge(profile.dateOfBirth)} years old
                  </p>
                  <p className="text-muted-foreground flex items-center justify-center gap-1">
                    <Droplet className="h-4 w-4" />
                    Blood type: {profile.bloodType}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Card className="border-green-100">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.weight && profile.height && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium">{profile.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Height</span>
                      <span className="font-medium">{profile.height} cm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">BMI</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{bmi}</span>
                        <Badge
                          variant={
                            bmiCategory === "Normal weight"
                              ? "default"
                              : bmiCategory === "Overweight"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {bmiCategory}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <Pill className="h-6 w-6 text-blue-600 mb-1" />
                    <span className="text-sm text-muted-foreground">Medications</span>
                    <span className="font-bold">{profile.currentMedications.length}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-green-600 mb-1" />
                    <span className="text-sm text-muted-foreground">Conditions</span>
                    <span className="font-bold">{profile.medicalHistory.length}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mb-1" />
                    <span className="text-sm text-muted-foreground">Allergies</span>
                    <span className="font-bold">{profile.allergies.length}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600 mb-1" />
                    <span className="text-sm text-muted-foreground">Lab Tests</span>
                    <span className="font-bold">{profile.labResults ? Object.keys(profile.labResults).length : 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Card className="border-red-100">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HeartPulse className="h-5 w-5 text-red-600" />
                  <span>Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    {isEditing ? (
                      <Input
                        value={profile.emergencyContact?.name || ""}
                        onChange={(e) =>
                          handleChange("emergencyContact", {
                            ...profile.emergencyContact,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="font-medium">{profile.emergencyContact?.name}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Relationship</Label>
                    {isEditing ? (
                      <Input
                        value={profile.emergencyContact?.relationship || ""}
                        onChange={(e) =>
                          handleChange("emergencyContact", {
                            ...profile.emergencyContact,
                            relationship: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="font-medium">{profile.emergencyContact?.relationship}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    {isEditing ? (
                      <Input
                        value={profile.emergencyContact?.phone || ""}
                        onChange={(e) =>
                          handleChange("emergencyContact", {
                            ...profile.emergencyContact,
                            phone: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="font-medium">{profile.emergencyContact?.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right column - Details */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Medical Profile Details</CardTitle>
                <CardDescription>
                  {isEditing ? "Edit your medical information below" : "View your complete medical information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="personal" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Personal
                      </TabsTrigger>
                      <TabsTrigger value="medical" className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Medical
                      </TabsTrigger>
                      <TabsTrigger value="medications" className="flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Medications
                      </TabsTrigger>
                      <TabsTrigger value="preferences" className="flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" />
                        Preferences
                      </TabsTrigger>
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Full name</Label>
                          <Input
                            value={profile.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label>Date of birth</Label>
                          <Input
                            type="date"
                            value={profile.dateOfBirth}
                            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label>Blood type</Label>
                          <Select
                            disabled={!isEditing}
                            value={profile.bloodType}
                            onValueChange={(value) => handleChange("bloodType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>About me</Label>
                        <Textarea
                          value={profile.bio}
                          onChange={(e) => handleChange("bio", e.target.value)}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                    </TabsContent>

                    {/* Medical Information Tab */}
                    <TabsContent value="medical" className="space-y-6">
                      {/* Allergies */}
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleSection("allergies")}
                          className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <h3 className="font-semibold">Allergies</h3>
                            <Badge variant="outline" className="px-2 py-0.5">
                              {profile.allergies.length}
                            </Badge>
                          </div>
                          {expandedSections.allergies ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedSections.allergies && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4"
                            >
                              <div className="space-y-4">
                                {profile.allergies.map((allergy, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start"
                                  >
                                    <div>
                                      <Label className="text-muted-foreground">Type</Label>
                                      <Input
                                        value={allergy.type}
                                        onChange={(e) => handleNestedChange("allergies", index, "type", e.target.value)}
                                        disabled={!isEditing}
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Substance</Label>
                                      <Input
                                        value={allergy.name}
                                        onChange={(e) => handleNestedChange("allergies", index, "name", e.target.value)}
                                        disabled={!isEditing}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <div className="flex-1">
                                        <Label className="text-muted-foreground">Reaction</Label>
                                        <Input
                                          value={allergy.reaction}
                                          onChange={(e) =>
                                            handleNestedChange("allergies", index, "reaction", e.target.value)
                                          }
                                          disabled={!isEditing}
                                        />
                                      </div>
                                      {isEditing && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="mt-[1.75rem]"
                                          onClick={() => removeSectionItem("allergies", index)}
                                        >
                                          <X className="h-4 w-4 text-red-500" />
                                        </Button>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}

                                {isEditing && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => addSectionItem("allergies", { type: "", name: "", reaction: "" })}
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add allergy
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Medical History */}
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleSection("medicalHistory")}
                          className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Clipboard className="h-5 w-5 text-blue-500" />
                            <h3 className="font-semibold">Medical History</h3>
                            <Badge variant="outline" className="px-2 py-0.5">
                              {profile.medicalHistory.length}
                            </Badge>
                          </div>
                          {expandedSections.medicalHistory ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedSections.medicalHistory && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4"
                            >
                              <div className="space-y-4">
                                {profile.medicalHistory.map((history, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start"
                                  >
                                    <div>
                                      <Label className="text-muted-foreground">Condition</Label>
                                      <Input
                                        value={history.condition}
                                        onChange={(e) =>
                                          handleNestedChange("medicalHistory", index, "condition", e.target.value)
                                        }
                                        disabled={!isEditing}
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Year diagnosed</Label>
                                      <Input
                                        type="number"
                                        value={history.startYear}
                                        onChange={(e) =>
                                          handleNestedChange(
                                            "medicalHistory",
                                            index,
                                            "startYear",
                                            Number(e.target.value),
                                          )
                                        }
                                        disabled={!isEditing}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <div className="flex-1">
                                        <Label className="text-muted-foreground">Treatment</Label>
                                        <Input
                                          value={history.treatment}
                                          onChange={(e) =>
                                            handleNestedChange("medicalHistory", index, "treatment", e.target.value)
                                          }
                                          disabled={!isEditing}
                                        />
                                      </div>
                                      {isEditing && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="mt-[1.75rem]"
                                          onClick={() => removeSectionItem("medicalHistory", index)}
                                        >
                                          <X className="h-4 w-4 text-red-500" />
                                        </Button>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}

                                {isEditing && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() =>
                                      addSectionItem("medicalHistory", {
                                        condition: "",
                                        startYear: new Date().getFullYear(),
                                        treatment: "",
                                      })
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add condition
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Lab Results */}
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleSection("labResults")}
                          className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-purple-500" />
                            <h3 className="font-semibold">Lab Results</h3>
                            <Badge variant="outline" className="px-2 py-0.5">
                              {profile.labResults ? Object.keys(profile.labResults).length : 0}
                            </Badge>
                          </div>
                          {expandedSections.labResults ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedSections.labResults && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4"
                            >
                              <div className="space-y-4">
                                {profile.labResults &&
                                  Object.entries(profile.labResults).map(([key, value], index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start"
                                    >
                                      <div>
                                        <Label className="text-muted-foreground">Test</Label>
                                        <Input
                                          value={key}
                                          onChange={(e) => {
                                            const newLabResults = { ...profile.labResults }
                                            const oldValue = newLabResults[key]
                                            delete newLabResults[key]
                                            newLabResults[e.target.value] = oldValue
                                            handleChange("labResults", newLabResults)
                                          }}
                                          disabled={!isEditing}
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <div className="flex-1">
                                          <Label className="text-muted-foreground">Value</Label>
                                          <Input
                                            type="number"
                                            value={value}
                                            onChange={(e) => {
                                              const newLabResults = { ...profile.labResults }
                                              newLabResults[key] = Number(e.target.value)
                                              handleChange("labResults", newLabResults)
                                            }}
                                            disabled={!isEditing}
                                          />
                                        </div>
                                        {isEditing && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="mt-[1.75rem]"
                                            onClick={() => {
                                              const newLabResults = { ...profile.labResults }
                                              delete newLabResults[key]
                                              handleChange("labResults", newLabResults)
                                            }}
                                          >
                                            <X className="h-4 w-4 text-red-500" />
                                          </Button>
                                        )}
                                      </div>
                                    </motion.div>
                                  ))}

                                {isEditing && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => {
                                      const newLabResults = { ...profile.labResults }
                                      newLabResults["New test"] = 0
                                      handleChange("labResults", newLabResults)
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add result
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </TabsContent>

                    {/* Medications Tab */}
                    <TabsContent value="medications" className="space-y-6">
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleSection("medications")}
                          className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Pill className="h-5 w-5 text-green-500" />
                            <h3 className="font-semibold">Current Medications</h3>
                            <Badge variant="outline" className="px-2 py-0.5">
                              {profile.currentMedications.length}
                            </Badge>
                          </div>
                          {expandedSections.medications ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedSections.medications && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4"
                            >
                              <div className="space-y-4">
                                {profile.currentMedications.map((medication, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start"
                                  >
                                    <div>
                                      <Label className="text-muted-foreground">Medication</Label>
                                      <Input
                                        value={medication.name}
                                        onChange={(e) =>
                                          handleNestedChange("currentMedications", index, "name", e.target.value)
                                        }
                                        disabled={!isEditing}
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Dosage</Label>
                                      <Input
                                        value={medication.dosage}
                                        onChange={(e) =>
                                          handleNestedChange("currentMedications", index, "dosage", e.target.value)
                                        }
                                        disabled={!isEditing}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <div className="flex-1">
                                        <Label className="text-muted-foreground">Frequency</Label>
                                        <Input
                                          value={medication.frequency}
                                          onChange={(e) =>
                                            handleNestedChange("currentMedications", index, "frequency", e.target.value)
                                          }
                                          disabled={!isEditing}
                                        />
                                      </div>
                                      {isEditing && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="mt-[1.75rem]"
                                          onClick={() => removeSectionItem("currentMedications", index)}
                                        >
                                          <X className="h-4 w-4 text-red-500" />
                                        </Button>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}

                                {isEditing && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() =>
                                      addSectionItem("currentMedications", {
                                        name: "",
                                        dosage: "",
                                        frequency: "",
                                      })
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add medication
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-6">
                      <div className="border rounded-lg p-6">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                          <HeartPulse className="h-5 w-5 text-pink-500" />
                          Treatment Preferences
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <Label>Preferred galenic forms</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {profile.treatmentPreferences?.galenicForm.map((form, index) => (
                                <Badge key={index} variant="secondary" className="gap-1">
                                  {form}
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newForms =
                                          profile.treatmentPreferences?.galenicForm.filter((_, i) => i !== index) || []
                                        handleChange("treatmentPreferences", {
                                          ...profile.treatmentPreferences,
                                          galenicForm: newForms,
                                        })
                                      }}
                                      className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </Badge>
                              ))}
                            </div>

                            {isEditing && (
                              <div className="mt-3">
                                <Select
                                  onValueChange={(value) => {
                                    const currentForms = profile.treatmentPreferences?.galenicForm || []
                                    if (!currentForms.includes(value)) {
                                      handleChange("treatmentPreferences", {
                                        ...profile.treatmentPreferences,
                                        galenicForm: [...currentForms, value],
                                      })
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Add a form" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Tablet">Tablet</SelectItem>
                                    <SelectItem value="Capsule">Capsule</SelectItem>
                                    <SelectItem value="Liquid">Liquid</SelectItem>
                                    <SelectItem value="Injection">Injection</SelectItem>
                                    <SelectItem value="Patch">Patch</SelectItem>
                                    <SelectItem value="Inhaler">Inhaler</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 pt-4">
                            <Switch
                              id="generic-acceptance"
                              checked={profile.treatmentPreferences?.genericAcceptance || false}
                              onCheckedChange={(checked) =>
                                handleChange("treatmentPreferences", {
                                  ...profile.treatmentPreferences,
                                  genericAcceptance: checked,
                                })
                              }
                              disabled={!isEditing}
                            />
                            <Label htmlFor="generic-acceptance">I accept generic medications</Label>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="consent"
                            checked={profile.consentForDataProcessing}
                            onCheckedChange={(checked) => handleChange("consentForDataProcessing", checked)}
                            disabled={!isEditing}
                          />
                          <Label htmlFor="consent">I consent to the processing of my medical data</Label>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-6">
                      <Button type="button" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
            >
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </motion.div>
            <DialogTitle className="text-center mt-3">Profile updated successfully</DialogTitle>
            <DialogDescription className="text-center">Your changes have been saved successfully.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowSuccessDialog(false)} className="w-full">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
