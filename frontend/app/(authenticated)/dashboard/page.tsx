"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import {
  Calendar,
  Pill,
  TrendingUp,
  Activity,
  Heart,
  Droplet,
  Thermometer,
  Clock,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Bell,
  RefreshCw,
  FileText,
  BarChart3,
  PieChart,
  ChevronRight,
  Plus,
  Download,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CalendarDays,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { format } from "date-fns/format"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

interface Medication {
  name: string
  dosage: string
  frequency: string
  prescribed_date: string
  next_refill?: string
}

interface HealthMetric {
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  change?: number
}

interface PatientData {
  full_name: string
  active_prescriptions: Medication[]
  upcoming_refills: Medication[]
  adherence_rate: number
  upcoming_appointments: {
    title: string
    date: string
    doctor: string
    location?: string
  }[]
  health_metrics: {
    blood_pressure: { systolic: number; diastolic: number }
    heart_rate: number
    blood_sugar: number
    cholesterol: { total: number; hdl: number; ldl: number }
    weight: number
    height: number
  }
  adherence_history: { date: string; rate: number }[]
  medication_schedule: {
    medication: string
    time: string
    taken: boolean
  }[]
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [adherenceProgress, setAdherenceProgress] = useState(0)
  const [userName, setUserName] = useState("")
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const { toast } = useToast()

  // Enhanced data for charts
  const adherenceData = [
    { name: "Mon", rate: 100 },
    { name: "Tue", rate: 80 },
    { name: "Wed", rate: 100 },
    { name: "Thu", rate: 90 },
    { name: "Fri", rate: 85 },
    { name: "Sat", rate: 100 },
    { name: "Sun", rate: 95 },
  ]

  const medicationDistribution = [
    { name: "Morning", value: 3 },
    { name: "Afternoon", value: 2 },
    { name: "Evening", value: 4 },
    { name: "Bedtime", value: 1 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  // Enhanced vital signs history with 12 months of data
  const vitalSignsHistory = [
    { date: "Jan", heartRate: 72, bloodPressure: 120, bloodSugar: 95 },
    { date: "Feb", heartRate: 74, bloodPressure: 122, bloodSugar: 98 },
    { date: "Mar", heartRate: 70, bloodPressure: 118, bloodSugar: 92 },
    { date: "Apr", heartRate: 73, bloodPressure: 121, bloodSugar: 94 },
    { date: "May", heartRate: 71, bloodPressure: 119, bloodSugar: 93 },
    { date: "Jun", heartRate: 72, bloodPressure: 120, bloodSugar: 95 },
    { date: "Jul", heartRate: 73, bloodPressure: 122, bloodSugar: 97 },
    { date: "Aug", heartRate: 75, bloodPressure: 123, bloodSugar: 99 },
    { date: "Sep", heartRate: 74, bloodPressure: 121, bloodSugar: 96 },
    { date: "Oct", heartRate: 72, bloodPressure: 120, bloodSugar: 94 },
    { date: "Nov", heartRate: 71, bloodPressure: 118, bloodSugar: 93 },
    { date: "Dec", heartRate: 70, bloodPressure: 117, bloodSugar: 92 },
  ]

  // New data for health trends
  const healthTrends = [
    { month: "Jan", weight: 76.2, bmi: 24.2 },
    { month: "Feb", weight: 75.8, bmi: 24.1 },
    { month: "Mar", weight: 75.5, bmi: 24.0 },
    { month: "Apr", weight: 75.0, bmi: 23.8 },
    { month: "May", weight: 74.8, bmi: 23.7 },
    { month: "Jun", weight: 75.0, bmi: 23.8 },
  ]

  useEffect(() => {
    // Animate adherence progress
    const timer = setTimeout(() => {
      if (patientData) {
        setAdherenceProgress(patientData.adherence_rate)
      } else {
        setAdherenceProgress(92)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [patientData])

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        // Fetch user profile
        const userResponse = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserName(userData.full_name)

          // In a real app, you would fetch patient data from your API
          // For now, we'll simulate it with enhanced mock data
          const mockPatientData: PatientData = {
            full_name: userData.full_name || "John Doe",
            active_prescriptions: [
              { name: "Amoxicillin", dosage: "500mg", frequency: "3x daily", prescribed_date: "2023-05-15" },
              { name: "Lisinopril", dosage: "10mg", frequency: "1x daily", prescribed_date: "2023-05-10" },
              { name: "Metformin", dosage: "850mg", frequency: "2x daily", prescribed_date: "2023-04-22" },
              { name: "Atorvastatin", dosage: "20mg", frequency: "1x daily", prescribed_date: "2023-03-18" },
              { name: "Levothyroxine", dosage: "75mcg", frequency: "1x daily", prescribed_date: "2023-02-05" },
            ],
            upcoming_refills: [
              {
                name: "Lisinopril",
                dosage: "10mg",
                frequency: "1x daily",
                prescribed_date: "2023-05-10",
                next_refill: "2023-06-10",
              },
              {
                name: "Metformin",
                dosage: "850mg",
                frequency: "2x daily",
                prescribed_date: "2023-04-22",
                next_refill: "2023-06-22",
              },
              {
                name: "Atorvastatin",
                dosage: "20mg",
                frequency: "1x daily",
                prescribed_date: "2023-03-18",
                next_refill: "2023-07-18",
              },
            ],
            adherence_rate: 92,
            upcoming_appointments: [
              {
                title: "Annual Checkup",
                date: "2023-06-15",
                doctor: "Dr. Smith",
                location: "Memorial Hospital, Room 302",
              },
              {
                title: "Cardiology Follow-up",
                date: "2023-07-02",
                doctor: "Dr. Johnson",
                location: "Heart Center, Suite 105",
              },
            ],
            health_metrics: {
              blood_pressure: { systolic: 122, diastolic: 78 },
              heart_rate: 72,
              blood_sugar: 95,
              cholesterol: { total: 180, hdl: 50, ldl: 110 },
              weight: 75,
              height: 180,
            },
            adherence_history: [
              { date: "2023-05-24", rate: 100 },
              { date: "2023-05-25", rate: 80 },
              { date: "2023-05-26", rate: 100 },
              { date: "2023-05-27", rate: 90 },
              { date: "2023-05-28", rate: 85 },
              { date: "2023-05-29", rate: 100 },
              { date: "2023-05-30", rate: 95 },
            ],
            medication_schedule: [
              { medication: "Metformin", time: "8:00 AM", taken: true },
              { medication: "Lisinopril", time: "9:00 AM", taken: true },
              { medication: "Metformin", time: "8:00 PM", taken: false },
              { medication: "Atorvastatin", time: "10:00 PM", taken: false },
            ],
          }

          setPatientData(mockPatientData)

          // Create enhanced health metrics from patient data with change percentages
          const metrics: HealthMetric[] = [
            {
              name: "Blood Pressure",
              value: mockPatientData.health_metrics.blood_pressure.systolic,
              unit: `/${mockPatientData.health_metrics.blood_pressure.diastolic} mmHg`,
              status: "normal",
              trend: "stable",
              change: 0,
            },
            {
              name: "Heart Rate",
              value: mockPatientData.health_metrics.heart_rate,
              unit: "bpm",
              status: "normal",
              trend: "down",
              change: -2.5,
            },
            {
              name: "Blood Sugar",
              value: mockPatientData.health_metrics.blood_sugar,
              unit: "mg/dL",
              status: "normal",
              trend: "up",
              change: 1.8,
            },
            {
              name: "Cholesterol",
              value: mockPatientData.health_metrics.cholesterol.total,
              unit: "mg/dL",
              status: "warning",
              trend: "down",
              change: -3.2,
            },
          ]

          setHealthMetrics(metrics)
        } else {
          console.error("Failed to fetch user data")
          toast({
            title: "Error",
            description: "Failed to load user data. Please try again later.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Connection Error",
          description: "Could not connect to the server. Please check your internet connection.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-50"
      case "warning":
        return "bg-yellow-50"
      case "critical":
        return "bg-red-50"
      default:
        return "bg-gray-50"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case "stable":
        return <Minus className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getMetricIcon = (name: string) => {
    switch (name) {
      case "Blood Pressure":
        return <Heart className="h-5 w-5 text-red-500" />
      case "Heart Rate":
        return <Activity className="h-5 w-5 text-pink-500" />
      case "Blood Sugar":
        return <Droplet className="h-5 w-5 text-blue-500" />
      case "Cholesterol":
        return <Thermometer className="h-5 w-5 text-yellow-500" />
      default:
        return <Stethoscope className="h-5 w-5 text-gray-500" />
    }
  }

  const handleMarkAsTaken = (medicationName: string) => {
    if (!patientData) return

    // Update the medication schedule
    const updatedSchedule = patientData.medication_schedule.map((med) =>
      med.medication === medicationName ? { ...med, taken: true } : med,
    )

    setPatientData({
      ...patientData,
      medication_schedule: updatedSchedule,
    })

    toast({
      title: "Medication Taken",
      description: `You've marked ${medicationName} as taken.`,
      variant: "default",
    })
  }

  const handleRequestRefill = (medicationName: string) => {
    toast({
      title: "Refill Requested",
      description: `Your refill request for ${medicationName} has been sent to your healthcare provider.`,
      variant: "default",
    })
  }

  const handleScheduleAppointment = () => {
    toast({
      title: "Appointment Scheduler",
      description: "Opening appointment scheduler...",
      variant: "default",
    })
  }

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-80 md:col-span-2" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-6"
    >
      {/* Header with user info and date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
            <p className="text-muted-foreground">Here's your health summary for today</p>
          </div>
        </motion.div>

        <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="flex items-center gap-3">
          <Badge variant="outline" className="py-2 px-3 bg-blue-50 gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            <span>{(new Date(), "EEEE, MMMM d, yyyy")}</span>
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" size="sm" onClick={handleScheduleAppointment}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Book a new appointment with your doctor</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>

      {/* Health summary cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientData?.active_prescriptions.length || 5}</div>
            <p className="text-xs text-muted-foreground">
              {patientData?.upcoming_refills.length || 2} refills needed soon
            </p>
          </CardContent>
          <CardFooter className="p-2 bg-blue-50/50">
            <Button variant="ghost" size="sm" className="w-full text-blue-600 text-xs gap-1">
              <FileText className="h-3 w-3" />
              View All Prescriptions
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Refills</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientData?.upcoming_refills.length || 3}</div>
            <p className="text-xs text-muted-foreground">Next refill in {Math.floor(Math.random() * 5) + 1} days</p>
          </CardContent>
          <CardFooter className="p-2 bg-orange-50/50">
            <Button variant="ghost" size="sm" className="w-full text-orange-600 text-xs gap-1">
              <RefreshCw className="h-3 w-3" />
              Request Refills
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Adherence</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adherenceProgress}%</div>
            <Progress value={adherenceProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </CardContent>
          <CardFooter className="p-2 bg-green-50/50">
            <Button variant="ghost" size="sm" className="w-full text-green-600 text-xs gap-1">
              <BarChart3 className="h-3 w-3" />
              View Adherence Details
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Stethoscope className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">{patientData?.upcoming_appointments[0]?.title || "Annual Checkup"}</div>
            <p className="text-xs text-muted-foreground">
              {patientData?.upcoming_appointments[0]?.date || "June 15, 2023"} with{" "}
              {patientData?.upcoming_appointments[0]?.doctor || "Dr. Smith"}
            </p>
          </CardContent>
          <CardFooter className="p-2 bg-purple-50/50">
            <Button variant="ghost" size="sm" className="w-full text-purple-600 text-xs gap-1">
              <Calendar className="h-3 w-3" />
              View Calendar
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Health metrics and medication schedule */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Health Metrics
                  </CardTitle>
                  <CardDescription>Your vital signs and health indicators</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <Download className="h-3 w-3" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <Share2 className="h-3 w-3" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vitalSignsHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBloodPressure" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBloodSugar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="heartRate"
                      name="Heart Rate (bpm)"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorHeartRate)"
                      activeDot={{ r: 6 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bloodPressure"
                      name="Blood Pressure (systolic)"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorBloodPressure)"
                      activeDot={{ r: 6 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bloodSugar"
                      name="Blood Sugar (mg/dL)"
                      stroke="#ffc658"
                      fillOpacity={1}
                      fill="url(#colorBloodSugar)"
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {healthMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className={`flex flex-col p-3 border rounded-lg ${getStatusBgColor(metric.status)} cursor-pointer`}
                    onClick={() => setSelectedMetric(metric.name)}
                  >
                    <div className="flex items-center mb-2">
                      {getMetricIcon(metric.name)}
                      <span className="ml-2 text-sm font-medium">{metric.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xl font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value}
                        {metric.unit}
                      </span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        {metric.change !== 0 && (
                          <span
                            className={`text-xs ${metric.trend === "up" ? "text-red-500" : metric.trend === "down" ? "text-green-500" : "text-blue-500"}`}
                          >
                            {metric.change !== undefined && metric.change > 0 ? "+" : ""}
                            {metric.change}%
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Today's Medication
                  </CardTitle>
                  <CardDescription>Your medication schedule for today</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Bell className="h-3 w-3" />
                  Set Reminders
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {patientData?.medication_schedule.map((med, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="flex items-center">
                        <Pill className="h-4 w-4 mr-2 text-blue-500" />
                        <p className="font-medium">{med.medication}</p>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1 text-gray-400" />
                        <p className="text-sm text-muted-foreground">{med.time}</p>
                      </div>
                    </div>
                    {med.taken ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Taken
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsTaken(med.medication)}>
                        Mark as Taken
                      </Button>
                    )}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Medication
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed health information tabs */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <Tabs defaultValue="adherence" className="space-y-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="adherence" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Adherence Trends</span>
              <span className="sm:hidden">Adherence</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Medication Analysis</span>
              <span className="sm:hidden">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Recent Prescriptions</span>
              <span className="sm:hidden">Prescriptions</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Weight & BMI</span>
              <span className="sm:hidden">Weight</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adherence">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Medication Adherence Trends
                    </CardTitle>
                    <CardDescription>Your weekly medication adherence pattern</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Last 7 Days
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={adherenceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#888888" />
                        <YAxis domain={[0, 100]} stroke="#888888" />
                        <ReTooltip
                          formatter={(value) => [`${value}%`, "Adherence Rate"]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                          }}
                        />
                        <Bar dataKey="rate" name="Adherence Rate" radius={[4, 4, 0, 0]}>
                          {adherenceData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.rate < 80 ? "#f97316" : entry.rate < 90 ? "#f59e0b" : "#10b981"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600">{adherenceProgress}%</div>
                      <p className="text-sm text-muted-foreground">Overall Adherence Rate</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Morning Doses</span>
                        <Progress value={95} className="w-32" />
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Afternoon Doses</span>
                        <Progress value={85} className="w-32" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Evening Doses</span>
                        <Progress value={90} className="w-32" />
                        <span className="text-sm font-medium">90%</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Tip:</strong> Setting reminders on your phone can help improve your adherence rate.
                          You can also ask your pharmacist about pill organizers.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Medication Distribution
                    </CardTitle>
                    <CardDescription>Analysis of your medication schedule</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      By Time of Day
                    </Badge>
                    <Badge variant="outline">By Type</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={medicationDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {medicationDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="#ffffff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <ReTooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                          }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Medication Types</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm">Cardiovascular (2)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm">Metabolic (1)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span className="text-sm">Antibiotics (1)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-sm">Hormonal (1)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Medication Frequency</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Once daily</span>
                          <Progress value={60} className="w-32" />
                          <span className="text-sm">3 meds</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Twice daily</span>
                          <Progress value={20} className="w-32" />
                          <span className="text-sm">1 med</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Three times daily</span>
                          <Progress value={20} className="w-32" />
                          <span className="text-sm">1 med</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Reminder:</strong> Take medications with food as prescribed by your doctor. Some
                          medications may interact with certain foods or other medications.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Recent Prescriptions
                    </CardTitle>
                    <CardDescription>Your most recent medication prescriptions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientData?.active_prescriptions.slice(0, 4).map((prescription, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <Pill className="h-5 w-5 mr-2 text-blue-500" />
                            <h3 className="text-lg font-medium">{prescription.name}</h3>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Dosage:</span> {prescription.dosage}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Frequency:</span> {prescription.frequency}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Prescribed:</span> {prescription.prescribed_date}
                            </p>
                            {prescription.next_refill && (
                              <p className="text-sm">
                                <span className="font-medium">Next Refill:</span> {prescription.next_refill}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <FileText className="h-4 w-4" />
                            View Details
                          </Button>
                          {prescription.next_refill && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleRequestRefill(prescription.name)}
                            >
                              <RefreshCw className="h-4 w-4" />
                              Request Refill
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button variant="outline" className="gap-1">
                    <ChevronRight className="h-4 w-4" />
                    View All Prescriptions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Weight & BMI Tracking
                    </CardTitle>
                    <CardDescription>Monitor your weight and BMI over time</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Last 6 Months
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#888888" />
                        <YAxis yAxisId="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <ReTooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                          }}
                        />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="weight"
                          name="Weight (kg)"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="bmi"
                          name="BMI"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-green-600">
                        {patientData?.health_metrics.weight || 75} kg
                      </div>
                      <p className="text-sm text-muted-foreground">Current Weight</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">BMI</span>
                          <span className="text-sm font-medium">
                            {(
                              (patientData?.health_metrics.weight || 75) /
                              Math.pow((patientData?.health_metrics.height || 180) / 100, 2)
                            ).toFixed(1)}
                          </span>
                        </div>
                        <Progress
                          value={
                            ((patientData?.health_metrics.weight || 75) /
                              Math.pow((patientData?.health_metrics.height || 180) / 100, 2)) *
                            4
                          }
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Underweight</span>
                          <span>Normal</span>
                          <span>Overweight</span>
                          <span>Obese</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Height</span>
                        <span className="text-sm font-medium">{patientData?.health_metrics.height || 180} cm</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Weight Change (6 months)</span>
                        <Badge variant={healthTrends[0].weight > healthTrends[5].weight ? "default" : "destructive"}>
                          {healthTrends[0].weight > healthTrends[5].weight ? "+" : ""}
                          {(healthTrends[0].weight - healthTrends[5].weight).toFixed(1)} kg
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Health Tip:</strong> Regular physical activity and a balanced diet can help maintain a
                          healthy weight. Aim for 150 minutes of moderate exercise per week.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
