"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Zap,
  Bell,
  HeartPulse,
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
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"

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

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [adherenceProgress, setAdherenceProgress] = useState(0)
  const [userName, setUserName] = useState("")
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [activeTab, setActiveTab] = useState("adherence")
  const [showNotification, setShowNotification] = useState(true)
  
  const notificationRef = useRef<HTMLDivElement>(null)

  // Mock data for charts
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

  const vitalSignsHistory = [
    { date: "Jan", heartRate: 72, bloodPressure: 120, bloodSugar: 95 },
    { date: "Feb", heartRate: 74, bloodPressure: 122, bloodSugar: 98 },
    { date: "Mar", heartRate: 70, bloodPressure: 118, bloodSugar: 92 },
    { date: "Apr", heartRate: 73, bloodPressure: 121, bloodSugar: 94 },
    { date: "May", heartRate: 71, bloodPressure: 119, bloodSugar: 93 },
    { date: "Jun", heartRate: 72, bloodPressure: 120, bloodSugar: 95 },
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
        // Simulate API delay for skeleton loading
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock data
        const mockPatientData: PatientData = {
          full_name: "Miryam Hfaidhia",
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
            { title: "Annual Checkup", date: "2023-06-15", doctor: "Dr. Smith" },
            { title: "Cardiology Follow-up", date: "2023-07-02", doctor: "Dr. Johnson" },
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
        setUserName(mockPatientData.full_name)

        const metrics: HealthMetric[] = [
          {
            name: "Blood Pressure",
            value: mockPatientData.health_metrics.blood_pressure.systolic,
            unit: `/${mockPatientData.health_metrics.blood_pressure.diastolic} mmHg`,
            status: "normal",
            trend: "stable",
          },
          {
            name: "Heart Rate",
            value: mockPatientData.health_metrics.heart_rate,
            unit: "bpm",
            status: "normal",
            trend: "down",
          },
          {
            name: "Blood Sugar",
            value: mockPatientData.health_metrics.blood_sugar,
            unit: "mg/dL",
            status: "normal",
            trend: "up",
          },
          {
            name: "Cholesterol",
            value: mockPatientData.health_metrics.cholesterol.total,
            unit: "mg/dL",
            status: "warning",
            trend: "down",
          },
        ]

        setHealthMetrics(metrics)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
      case "stable":
        return <Activity className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getMetricIcon = (name: string) => {
    switch (name) {
      case "Blood Pressure":
        return <HeartPulse className="h-5 w-5 text-red-500" />
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

  const handleMarkAsTaken = (medName: string) => {
    if (patientData) {
      const updatedSchedule = patientData.medication_schedule.map(med => 
        med.medication === medName ? { ...med, taken: true } : med
      )
      setPatientData({
        ...patientData,
        medication_schedule: updatedSchedule
      })
    }
  }

  if (loading) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        <motion.div variants={fadeIn}>
          <Skeleton className="h-12 w-64" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={fadeIn}>
              <Skeleton className="h-40" />
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <motion.div key={i} variants={fadeIn}>
              <Skeleton className="h-80" />
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeIn}>
          <Skeleton className="h-96" />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8 relative">
      {/* Floating notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            ref={notificationRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute top-4 right-4 z-10"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-start">
                <motion.div animate={pulseAnimation}>
                  <Bell className="h-5 w-5 mr-2" />
                </motion.div>
                <div>
                  <h3 className="font-bold">Reminder!</h3>
                  <p className="text-sm">You have 2 medications to take today at 8:00 PM</p>
                </div>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="ml-2 text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mt-1"
          >
            Here's your health summary for today
          </motion.p>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Badge variant="outline" className="mr-2 bg-blue-50">
              <Calendar className="mr-1 h-3 w-3" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Badge>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {[
          {
            title: "Active Prescriptions",
            value: patientData?.active_prescriptions.length || 5,
            description: `${patientData?.upcoming_refills.length || 2} refills needed soon`,
            icon: <Pill className="h-4 w-4 text-blue-500" />,
            color: "blue"
          },
          {
            title: "Upcoming Refills",
            value: patientData?.upcoming_refills.length || 3,
            description: `Next refill in ${Math.floor(Math.random() * 5) + 1} days`,
            icon: <Calendar className="h-4 w-4 text-orange-500" />,
            color: "orange"
          },
          {
            title: "Medication Adherence",
            value: `${adherenceProgress}%`,
            description: "Last 30 days",
            icon: <TrendingUp className="h-4 w-4 text-green-500" />,
            color: "green",
            progress: adherenceProgress
          },
          {
            title: "Next Appointment",
            value: patientData?.upcoming_appointments[0]?.title || "Annual Checkup",
            description: `${patientData?.upcoming_appointments[0]?.date || "June 15, 2023"} with ${patientData?.upcoming_appointments[0]?.doctor || "Dr. Smith"}`,
            icon: <Stethoscope className="h-4 w-4 text-purple-500" />,
            color: "purple"
          }
        ].map((stat, index) => (
          <motion.div key={index} variants={fadeIn}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <motion.div animate={floatingAnimation}>
                  {stat.icon}
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.progress ? (
                  <>
                    <Progress value={stat.progress} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Health Metrics and Medication */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn} className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HeartPulse className="h-5 w-5 mr-2 text-red-500" />
                <span>Health Metrics</span>
              </CardTitle>
              <CardDescription>Your vital signs and health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vitalSignsHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBloodPressure" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBloodSugar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="heartRate"
                      name="Heart Rate (bpm)"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorHeartRate)"
                    />
                    <Area
                      type="monotone"
                      dataKey="bloodPressure"
                      name="Blood Pressure (systolic)"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorBloodPressure)"
                    />
                    <Area
                      type="monotone"
                      dataKey="bloodSugar"
                      name="Blood Sugar (mg/dL)"
                      stroke="#ffc658"
                      fillOpacity={1}
                      fill="url(#colorBloodSugar)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {healthMetrics.map((metric, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className="flex flex-col p-3 border rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm"
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
                      {getTrendIcon(metric.trend)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-blue-500" />
                <span>Today's Medication</span>
              </CardTitle>
              <CardDescription>Your medication schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {patientData?.medication_schedule.map((med, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-3 border rounded-lg hover:shadow-sm transition-shadow"
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
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Taken
                        </Badge>
                      </motion.div>
                    ) : (
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAsTaken(med.medication)}
                        >
                          <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                          Mark as Taken
                        </Button>
                      </motion.div>
                    )}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tabs Section */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <TabsList className="grid grid-cols-3 mb-4 bg-gradient-to-r from-blue-50 to-purple-50">
            {[
              { value: "adherence", label: "Adherence Trends" },
              { value: "medications", label: "Medication Analysis" },
              { value: "prescriptions", label: "Recent Prescriptions" }
            ].map((tab) => (
              <motion.div
                key={tab.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabsTrigger 
                  value={tab.value}
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="adherence">
              <Card>
                <CardHeader>
                  <CardTitle>Medication Adherence Trends</CardTitle>
                  <CardDescription>Your weekly medication adherence pattern</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adherenceData}>
                          <defs>
                            <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value) => [`${value}%`, "Adherence Rate"]} />
                          <Bar dataKey="rate" name="Adherence Rate" fill="url(#colorAdherence)">
                            {adherenceData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.rate < 90 ? "#f59e0b" : "#10b981"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex flex-col justify-center">
                      <motion.div 
                        className="text-center mb-6"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-4xl font-bold text-blue-600">{adherenceProgress}%</div>
                        <p className="text-sm text-muted-foreground">Overall Adherence Rate</p>
                      </motion.div>

                      <div className="space-y-4">
                        {[
                          { label: "Morning Doses", value: 95 },
                          { label: "Afternoon Doses", value: 85 },
                          { label: "Evening Doses", value: 90 }
                        ].map((item, index) => (
                          <motion.div 
                            key={index}
                            whileHover={{ scale: 1.01 }}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm font-medium">{item.label}</span>
                            <div className="flex items-center">
                              <Progress value={item.value} className="w-32 mr-2" />
                              <span className="text-sm font-medium">{item.value}%</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div 
                        className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
                        whileHover={{ scale: 1.01 }}
                      >
                        <p className="text-sm">
                          <AlertCircle className="h-4 w-4 inline mr-1 text-blue-500" />
                          Tip: Setting reminders can help improve your adherence rate.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications">
              <Card>
                <CardHeader>
                  <CardTitle>Medication Distribution</CardTitle>
                  <CardDescription>Analysis of your medication schedule</CardDescription>
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
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            animationBegin={0}
                            animationDuration={1000}
                            animationEasing="ease-out"
                          >
                            {medicationDistribution.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Medication Types</h3>
                        <div className="space-y-2">
                          {[
                            { color: "bg-blue-500", label: "Cardiovascular (2)" },
                            { color: "bg-green-500", label: "Metabolic (1)" },
                            { color: "bg-yellow-500", label: "Antibiotics (1)" },
                            { color: "bg-purple-500", label: "Hormonal (1)" }
                          ].map((item, index) => (
                            <motion.div 
                              key={index}
                              whileHover={{ x: 5 }}
                              className="flex items-center"
                            >
                              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                              <span className="text-sm">{item.label}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Medication Frequency</h3>
                        <div className="space-y-2">
                          {[
                            { label: "Once daily", value: 60, count: "3 meds" },
                            { label: "Twice daily", value: 20, count: "1 med" },
                            { label: "Three times daily", value: 20, count: "1 med" }
                          ].map((item, index) => (
                            <motion.div 
                              key={index}
                              whileHover={{ scale: 1.01 }}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <span className="text-sm">{item.label}</span>
                              <div className="flex items-center">
                                <Progress value={item.value} className="w-32 mr-2" />
                                <span className="text-sm">{item.count}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <motion.div 
                        className="p-4 bg-yellow-50 rounded-lg border border-yellow-100"
                        whileHover={{ scale: 1.01 }}
                      >
                        <p className="text-sm">
                          <AlertCircle className="h-4 w-4 inline mr-1 text-yellow-500" />
                          Reminder: Take medications with food as prescribed by your doctor.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Prescriptions</CardTitle>
                  <CardDescription>Your most recent medication prescriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patientData?.active_prescriptions.slice(0, 4).map((prescription, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
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
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </motion.div>
                            {prescription.next_refill && (
                              <motion.div whileHover={{ scale: 1.05 }}>
                                <Button variant="outline" size="sm">
                                  Request Refill
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div 
                    className="mt-4 flex justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Button variant="outline">View All Prescriptions</Button>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}