"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
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
import { Upload, FileText, Pill, Calendar, User, Search, Plus, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function PrescriptionManagement() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null)

  const togglePrescriptionDetails = (id: string) => {
    setExpandedPrescription(expandedPrescription === id ? null : id)
  }

  // Données de démonstration avec images
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
      pharmacy: "Pharmacie Centrale",
      notes: "Éviter l'alcool pendant le traitement"
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
      notes: "Prise de sang recommandée après 1 mois"
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
      notes: "À prendre uniquement en cas de douleur"
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
      notes: "Éviter les aliments acides pendant le traitement"
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
            </div>
            <DialogFooter>
              <Button type="submit" className="gap-2">
                <Upload className="h-4 w-4" />
                Importer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Carte de filtrage */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Médecin
                </Label>
                <Input id="doctor" placeholder="Filtrer par médecin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medication" className="flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  Médicament
                </Label>
                <Input id="medication" placeholder="Filtrer par médicament" />
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
              Actives
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Archivées
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
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Ordonnances Actives</span>
                </CardTitle>
                <CardDescription>
                  {activePrescriptions.length} ordonnance(s) en cours de validité
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                    {activePrescriptions.map((prescription) => (
                      <motion.tr 
                        key={prescription.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-gray-100"
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
                            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                              Renouveler
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
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
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Ordonnances Archivées</span>
                </CardTitle>
                <CardDescription>
                  {pastPrescriptions.length} ordonnance(s) expirée(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                    {pastPrescriptions.map((prescription) => (
                      <motion.tr 
                        key={prescription.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-gray-100"
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
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Détails de l'ordonnance */}
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
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setExpandedPrescription(null)}
                  className="text-muted-foreground"
                >
                  Fermer
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Colonne 1: Image et informations générales */}
                <div className="space-y-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
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
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Pharmacie</h4>
                    <p>{[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.pharmacy}</p>
                  </div>
                </div>

                {/* Colonne 2: Détails médicaux */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Posologie</h4>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium">
                        {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.dosage}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.frequency}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Instructions</h4>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                      {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.instructions}
                    </p>
                  </div>
                </div>

                {/* Colonne 3: Dates et notes */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Dates</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Émission</p>
                        <p className="font-medium">
                          {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.issueDate}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Expiration</p>
                        <p className="font-medium">
                          {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.expiryDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Notes du médecin</h4>
                    <p className="mt-1 p-3 bg-yellow-50 rounded-lg">
                      {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.notes}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Renouvellements</h4>
                    <p className="mt-1 p-3 bg-green-50 rounded-lg font-medium">
                      {[...activePrescriptions, ...pastPrescriptions].find(p => p.id === expandedPrescription)?.refills || 0} restants
                    </p>
                  </div>
                </div>
              </div>

              {activeTab === "active" && (
                <div className="mt-6 pt-6 border-t flex justify-end gap-2">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Télécharger PDF
                  </Button>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Demander un Renouvellement
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}