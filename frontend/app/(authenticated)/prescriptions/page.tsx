"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { CalendarDays , Droplets } from "lucide-react";

import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, FileText, Pill, Calendar, User, Search, Plus, ChevronDown, 
  ChevronUp, Image as ImageIcon, X, ZoomIn, MapPin, Activity, 
  Repeat, ClipboardList, AlertTriangle, Circle, Clock, 
  MessageSquare, Phone, RefreshCw, Download, AlertCircle,
  Check, History, Printer, Share2, Bell
} from "lucide-react"
import Image from "next/image"

export default function PrescriptionManagement() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  const togglePrescriptionDetails = (id: string) => {
    setExpandedPrescription(expandedPrescription === id ? null : id)
  }

  // Données de démonstration enrichies
  const activePrescriptions = [
    {
      id: "1",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 fois par jour",
      doctor: "Dr. Sophie Martin",
      issueDate: "15/05/2023",
      expiryDate: "15/06/2023",
      status: "active",
      instructions: "Prendre avec les repas. Compléter le traitement même en cas d'amélioration.",
      refills: 2,
      prescriptionImage: "/prescription1.jpg",
      doctorSpecialty: "Médecin généraliste",
      notes: "Éviter l'alcool pendant le traitement",
      sideEffects: ["Nausées possibles", "Réactions allergiques rares"],
      history: [
        { date: "15/05/2023", event: "Ordonnance délivrée", pharmacy: "Pharmacie Centrale" },
        { date: "20/05/2023", event: "Première délivrance", pharmacy: "Pharmacie Centrale" }
      ]
    },
    {
      id: "2",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "1 fois par jour",
      doctor: "Dr. Jean Dupont",
      issueDate: "10/05/2023",
      expiryDate: "10/11/2023",
      status: "active",
      instructions: "Prendre le matin. Surveiller régulièrement la tension artérielle.",
      refills: 5,
      prescriptionImage: "/prescription2.jpg",
      doctorSpecialty: "Cardiologue",
      pharmacy: "Pharmacie du Quartier",
      notes: "Prise de sang recommandée après 1 mois",
      sideEffects: ["Vertiges possibles", "Toux sèche"],
      history: [
        { date: "10/05/2023", event: "Ordonnance délivrée", pharmacy: "Pharmacie du Quartier" },
        { date: "15/05/2023", event: "Première délivrance", pharmacy: "Pharmacie du Quartier" }
      ]
    }
  ]

  const pastPrescriptions = [
    {
      id: "3",
      medication: "Ibuprofène",
      dosage: "400mg",
      frequency: "Si nécessaire",
      doctor: "Dr. Marie Lambert",
      issueDate: "15/01/2023",
      expiryDate: "15/02/2023",
      status: "expired",
      instructions: "Prendre avec un verre d'eau. Ne pas dépasser 1200mg par jour.",
      refills: 0,
      prescriptionImage: "/prescription3.jpg",
      doctorSpecialty: "Rhumatologue",
      pharmacy: "Pharmacie des Ternes",
      notes: "À prendre uniquement en cas de douleur",
      sideEffects: ["Brûlures d'estomac possibles", "Vertiges"],
      history: [
        { date: "15/01/2023", event: "Ordonnance délivrée", pharmacy: "Pharmacie des Ternes" },
        { date: "20/01/2023", event: "Dernière délivrance", pharmacy: "Pharmacie des Ternes" }
      ]
    },
    {
      id: "4",
      medication: "Omeprazole",
      dosage: "20mg",
      frequency: "1 fois par jour",
      doctor: "Dr. Alain Petit",
      issueDate: "10/02/2023",
      expiryDate: "10/03/2023",
      status: "expired",
      instructions: "Prendre avant le petit déjeuner. Durée du traitement : 14 jours.",
      refills: 0,
      prescriptionImage: "/prescription4.jpg",
      doctorSpecialty: "Gastro-entérologue",
      pharmacy: "Pharmacie Saint-Honoré",
      notes: "Éviter les aliments acides pendant le traitement",
      sideEffects: ["Maux de tête légers", "Nausées occasionnelles"],
      history: [
        { date: "10/02/2023", event: "Ordonnance délivrée", pharmacy: "Pharmacie Saint-Honoré" },
        { date: "12/02/2023", event: "Dernière délivrance", pharmacy: "Pharmacie Saint-Honoré" }
      ]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
      case "expired":
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Expirée</span>
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Inconnu</span>
    }
  }

  const filteredPrescriptions = (prescriptions: typeof activePrescriptions) => {
    return prescriptions.filter(prescription => {
      const matchesSearch = prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDoctor = selectedDoctor ? prescription.doctor === selectedDoctor : true
      const matchesDate = selectedDate ? prescription.issueDate === selectedDate : true
      
      return matchesSearch && matchesDoctor && matchesDate
    })
  }

  const allDoctors = [...new Set([...activePrescriptions, ...pastPrescriptions].map(p => p.doctor))]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-6"
    >
      {/* En-tête avec bouton d'upload */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Ordonnances
          </h1>
          <p className="text-muted-foreground">Consultez et gérez toutes vos ordonnances médicales</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            Historique
          </Button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-shadow">
                <Plus className="h-4 w-4" />
                Nouvelle Ordonnance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Importer une Ordonnance</span>
                </DialogTitle>
                <DialogDescription>
                  Téléversez une photo ou un PDF de votre ordonnance pour l'ajouter à vos dossiers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="prescription" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Fichier d'ordonnance
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input id="prescription" type="file" accept="image/*,.pdf" className="cursor-pointer" />
                  </div>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="doctor" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Médecin prescripteur
                  </Label>
                  <Input id="doctor" placeholder="Nom du médecin" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date de prescription
                  </Label>
                  <Input id="date" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Importer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Carte de filtrage améliorée */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <span>Filtrer les Ordonnances</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Recherche
                </Label>
                <Input 
                  id="search" 
                  placeholder="Médicament ou médecin..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Médecin
                </Label>
                <select
                  id="doctor"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">Tous les médecins</option>
                  {allDoctors.map(doctor => (
                    <option key={doctor} value={doctor}>{doctor}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Statut
                </Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actives</option>
                  <option value="expired">Expirées</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets */}
      <Tabs 
        defaultValue="active" 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Actives ({activePrescriptions.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Archivées ({pastPrescriptions.length})
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Ordonnances actives */}
        <TabsContent value="active">
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>Ordonnances Actives</span>
                    </CardTitle>
                    <CardDescription>
                      {filteredPrescriptions(activePrescriptions).length} ordonnance(s) en cours de validité
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Printer className="h-4 w-4" />
                      Imprimer
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Partager
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredPrescriptions(activePrescriptions).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-muted-foreground">
                    <FileText className="h-12 w-12" />
                    <p>Aucune ordonnance active trouvée</p>
                    <Button onClick={() => {
                      setSearchTerm("")
                      setSelectedDoctor("")
                      setSelectedDate("")
                    }}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Ordonnance</TableHead>
                        <TableHead>Médicament</TableHead>
                        <TableHead>Médecin</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrescriptions(activePrescriptions).map((prescription) => (
                        <motion.tr 
                          key={prescription.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <TableCell>
                            <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                              <Image
                                src={prescription.prescriptionImage}
                                alt={`Ordonnance pour ${prescription.medication}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-primary" />
                              <div>
                                <p>{prescription.medication}</p>
                                <p className="text-xs text-muted-foreground">{prescription.dosage} - {prescription.frequency}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p>{prescription.doctor}</p>
                            <p className="text-xs text-muted-foreground">{prescription.doctorSpecialty}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{prescription.issueDate}</span>
                              <span className="text-xs text-muted-foreground">Exp: {prescription.expiryDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(prescription.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-1"
                                onClick={() => togglePrescriptionDetails(prescription.id)}
                              >
                                {expandedPrescription === prescription.id ? (
                                  <>
                                    <ChevronUp className="h-4 w-4" />
                                    Réduire
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4" />
                                    Détails
                                  </>
                                )}
                              </Button>
                              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
                                <RefreshCw className="h-4 w-4" />
                                Renouveler
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Ordonnances archivées */}
        <TabsContent value="past">
          <motion.div
            key="past"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>Ordonnances Archivées</span>
                    </CardTitle>
                    <CardDescription>
                      {filteredPrescriptions(pastPrescriptions).length} ordonnance(s) expirée(s)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredPrescriptions(pastPrescriptions).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-muted-foreground">
                    <Calendar className="h-12 w-12" />
                    <p>Aucune ordonnance archivée trouvée</p>
                    <Button onClick={() => {
                      setSearchTerm("")
                      setSelectedDoctor("")
                      setSelectedDate("")
                    }}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Ordonnance</TableHead>
                        <TableHead>Médicament</TableHead>
                        <TableHead>Médecin</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrescriptions(pastPrescriptions).map((prescription) => (
                        <motion.tr 
                          key={prescription.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <TableCell>
                            <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                              <Image
                                src={prescription.prescriptionImage}
                                alt={`Ordonnance pour ${prescription.medication}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-primary" />
                              <div>
                                <p>{prescription.medication}</p>
                                <p className="text-xs text-muted-foreground">{prescription.dosage} - {prescription.frequency}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p>{prescription.doctor}</p>
                            <p className="text-xs text-muted-foreground">{prescription.doctorSpecialty}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{prescription.issueDate}</span>
                              <span className="text-xs text-muted-foreground">Exp: {prescription.expiryDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(prescription.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="gap-1"
                              onClick={() => togglePrescriptionDetails(prescription.id)}
                            >
                              {expandedPrescription === prescription.id ? (
                                <>
                                  <ChevronUp className="h-4 w-4" />
                                  Réduire
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" />
                                  Détails
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Détails de l'ordonnance - Version enrichie */}
      <AnimatePresence>
        {expandedPrescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg overflow-hidden bg-white shadow-lg"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.medication}
                  </h3>
                  <p className="text-muted-foreground">
                    Prescrit par {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.doctor}
                    <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.doctorSpecialty}
                    </span>
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setExpandedPrescription(null)}
                  className="text-muted-foreground hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Colonne 1: Image et informations générales */}
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="relative w-full h-48 rounded-lg overflow-hidden border shadow-sm cursor-pointer"
                  >
                    <Image
                      src={[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.prescriptionImage || ""}
                      alt={`Ordonnance complète`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                      <span className="text-white text-sm flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        Ordonnance originale
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm">
                      <ZoomIn className="h-5 w-5 text-primary" />
                    </div>
                  </motion.div>
                  
                  <div className="space-y-3">
                    
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm text-muted-foreground">Statut</h4>
                      <div className="mt-1 flex items-center gap-2">
                        {getStatusBadge([...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.status || "")}
                        <span className="text-xs text-muted-foreground">
  {expandedPrescription && (
    activePrescriptions.some(p => p.id === expandedPrescription)
      ? "Valide jusqu'au " + activePrescriptions.find(p => p.id === expandedPrescription)?.expiryDate
      : "Expirée depuis le " + pastPrescriptions.find(p => p.id === expandedPrescription)?.expiryDate
  )}
</span>
</div>

                    </div>
                
                  </div>
                </div>

                {/* Colonne 2: Détails médicaux */}
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <h4 className="font-medium text-sm text-blue-600 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Posologie
                    </h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Droplets className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.dosage}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.frequency}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Repeat className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.refills || 0} renouvellements restants
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Valables jusqu'à l'expiration
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="p-4 bg-purple-50 rounded-lg border border-purple-100"
                  >
                    <h4 className="font-medium text-sm text-purple-600 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Instructions
                    </h4>
                    <p className="mt-3 pl-2 border-l-2 border-purple-200 italic">
                      "{[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.instructions}"
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="p-4 bg-amber-50 rounded-lg border border-amber-100"
                  >
                    <h4 className="font-medium text-sm text-amber-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Effets secondaires
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm">
                      {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.sideEffects.map((effect, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1">
                            <Circle className="h-2 w-2 text-amber-500" />
                          </div>
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Colonne 3: Historique et actions */}
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="p-4 bg-white rounded-lg border shadow-sm"
                  >
                    <h4 className="font-medium text-sm text-gray-600 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Dates importantes
                    </h4>
                    <div className="mt-3 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 rounded-full">
                          <Calendar className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Date de prescription</p>
                          <p className="text-sm text-muted-foreground">
                            {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.issueDate}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-50 rounded-full">
                          <Calendar className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium">Date d'expiration</p>
                          <p className="text-sm text-muted-foreground">
                            {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.expiryDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="p-4 bg-white rounded-lg border shadow-sm"
                  >
                    <h4 className="font-medium text-sm text-gray-600 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Notes
                    </h4>
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <p className="italic">
                        "{[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.notes}"
                      </p>
                    </div>
                  </motion.div>
                  
                  <div className="space-y-2">
                    {activeTab === "active" ? (
                      <>
                        <Button className="w-full gap-2" variant="default">
                          <Phone className="h-4 w-4" />
                          Contacter le médecin
                        </Button>
                        <Button className="w-full gap-2" variant="outline">
                          <FileText className="h-4 w-4" />
                          Télécharger PDF
                        </Button>
                        <Button className="w-full gap-2" variant="outline">
                          <RefreshCw className="h-4 w-4" />
                          Demander renouvellement
                        </Button>
                        <Button className="w-full gap-2" variant="outline">
                          <Bell className="h-4 w-4" />
                          Programmer un rappel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="w-full gap-2" variant="outline">
                          <FileText className="h-4 w-4" />
                          Télécharger PDF
                        </Button>
                        <Button className="w-full gap-2" variant="outline">
                          <Share2 className="h-4 w-4" />
                          Partager
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline pour les ordonnances actives */}
              {activeTab === "active" && (
                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-medium flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4" />
                    Historique des prises
                  </h4>
                  
                  <div className="relative">
                    {/* Ligne de timeline */}
                    <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-6">
                      {/* Événement 1 */}
                      <div className="relative pl-10">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center shadow-sm">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">Prise du matin</p>
                            <span className="text-xs text-muted-foreground">Aujourd'hui, 08:15</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Confirmée par rappel mobile</p>
                        </div>
                      </div>
                      
                      {/* Événement 2 */}
                      <div className="relative pl-10">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-yellow-100 border-2 border-white flex items-center justify-center shadow-sm">
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">Prise du midi</p>
                            <span className="text-xs text-muted-foreground">Aujourd'hui, 12:30</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">En attente de confirmation</p>
                        </div>
                      </div>
                      
                      {/* Événement 3 */}
                      <div className="relative pl-10">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-red-100 border-2 border-white flex items-center justify-center shadow-sm">
                          <X className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">Prise du soir</p>
                            <span className="text-xs text-muted-foreground">Hier, 19:45</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Oubliée - Rappel envoyé</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}