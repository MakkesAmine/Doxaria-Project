"use client";

import axios from 'axios';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Pill, AlertCircle, HeartPulse, Clock, Info, Filter, X, ChevronDown, Loader2, PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Medication {
  id: string;
  Nom: string;
  Dosage: string;
  Forme: string;
  Classe: string;
  Laboratoire: string;
  Duree_de_conservation: number;
  Conditionnement_primaire: string;
  contre_indication: string;
  side_effect: string[];
  Indications: string[];
}

export default function MedicationsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    forme: "",
    classe: "",
    laboratoire: ""
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    Nom: "",
    Dosage: "",
    Forme: "",
    Classe: "",
    Laboratoire: "",
    Duree_de_conservation: 0,
    Conditionnement_primaire: "",
    contre_indication: "",
    side_effect: [],
    Indications: []
  });
  const [sideEffectInput, setSideEffectInput] = useState("");
  const [indicationInput, setIndicationInput] = useState("");
  const { toast } = useToast();
  
  const itemsPerPage = 8;

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/drug/medicaments/');
      const limitedMeds = (response.data as Medication[]).slice(0, 100);
      setMedications(limitedMeds);
      setFilteredMedications(limitedMeds);
    } catch (error) {
      console.error("Erreur lors de la récupération des médicaments", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les médicaments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = medications;
    
    if (searchTerm) {
      results = results.filter(med => 
        med.Nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.Classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.Laboratoire.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeFilters.forme) {
      results = results.filter(med => med.Forme === activeFilters.forme);
    }
    if (activeFilters.classe) {
      results = results.filter(med => med.Classe === activeFilters.classe);
    }
    if (activeFilters.laboratoire) {
      results = results.filter(med => med.Laboratoire === activeFilters.laboratoire);
    }
    
    setFilteredMedications(results);
    setCurrentPage(1);
  }, [searchTerm, activeFilters, medications]);

  const totalPages = Math.ceil(filteredMedications.length / itemsPerPage);
  const currentMedications = filteredMedications.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const uniqueFormes = [...new Set(medications.map(m => m.Forme))].filter(Boolean);
  const uniqueClasses = [...new Set(medications.map(m => m.Classe))].filter(Boolean);
  const uniqueLaboratoires = [...new Set(medications.map(m => m.Laboratoire))].filter(Boolean);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMedicationClick = (medication: Medication) => {
    setSelectedMedication(medication);
  };

  const clearFilters = () => {
    setActiveFilters({
      forme: "",
      classe: "",
      laboratoire: ""
    });
    setSearchTerm("");
  };

  const hasActiveFilters = Object.values(activeFilters).some(Boolean) || searchTerm;

  const handleAddMedication = async () => {
    try {
      setLoading(true);
      const response = await axios.post<Medication>('http://localhost:8000/drug/medicaments/', newMedication);
      
      setMedications([...medications, response.data]);
      setNewMedication({
        Nom: "",
        Dosage: "",
        Forme: "",
        Classe: "",
        Laboratoire: "",
        Duree_de_conservation: 0,
        Conditionnement_primaire: "",
        contre_indication: "",
        side_effect: [],
        Indications: []
      });
      
      setIsAddDialogOpen(false);
      toast({
        title: "Succès",
        description: "Médicament ajouté avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du médicament", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le médicament",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSideEffect = () => {
    if (sideEffectInput.trim()) {
      setNewMedication({
        ...newMedication,
        side_effect: [...(newMedication.side_effect || []), sideEffectInput]
      });
      setSideEffectInput("");
    }
  };

  const removeSideEffect = (index: number) => {
    setNewMedication({
      ...newMedication,
      side_effect: (newMedication.side_effect || []).filter((_, i) => i !== index)
    });
  };

  const addIndication = () => {
    if (indicationInput.trim()) {
      setNewMedication({
        ...newMedication,
        Indications: [...(newMedication.Indications || []), indicationInput]
      });
      setIndicationInput("");
    }
  };

  const removeIndication = (index: number) => {
    setNewMedication({
      ...newMedication,
      Indications: (newMedication.Indications || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Pharmacopée Numérique
          </h1>
          <p className="text-muted-foreground">Base de données des médicaments</p>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Badge variant="outline" className="bg-blue-50">
              <Pill className="h-4 w-4 mr-1 text-blue-500" />
              {medications.length} Médicaments
            </Badge>
          </motion.div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Ajouter un médicament
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Nouveau médicament
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations du médicament à ajouter
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nom du médicament</Label>
                  <Input 
                    value={newMedication.Nom || ""} 
                    onChange={(e) => setNewMedication({...newMedication, Nom: e.target.value})}
                    placeholder="Paracétamol"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Dosage</Label>
                  <Input 
                    value={newMedication.Dosage || ""} 
                    onChange={(e) => setNewMedication({...newMedication, Dosage: e.target.value})}
                    placeholder="500mg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Forme pharmaceutique</Label>
                  <Input 
                    value={newMedication.Forme || ""} 
                    onChange={(e) => setNewMedication({...newMedication, Forme: e.target.value})}
                    placeholder="Comprimé"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Classe thérapeutique</Label>
                  <Input 
                    value={newMedication.Classe || ""} 
                    onChange={(e) => setNewMedication({...newMedication, Classe: e.target.value})}
                    placeholder="Antalgique"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Laboratoire</Label>
                  <Input 
                    value={newMedication.Laboratoire || ""} 
                    onChange={(e) => setNewMedication({...newMedication, Laboratoire: e.target.value})}
                    placeholder="Laboratoire X"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Durée de conservation (mois)</Label>
                  <Input 
                    type="number" 
                    value={newMedication.Duree_de_conservation || 0} 
                    onChange={(e) => setNewMedication({...newMedication, Duree_de_conservation: parseInt(e.target.value) || 0})}
                    placeholder="24"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Conditionnement primaire</Label>
                  <Input 
                    value={newMedication.Conditionnement_primaire || ""} 
                    onChange={(e) => setNewMedication({...newMedication, Conditionnement_primaire: e.target.value})}
                    placeholder="Boîte de 30 comprimés"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Contre-indications</Label>
                  <Textarea 
                    value={newMedication.contre_indication || ""} 
                    onChange={(e) => setNewMedication({...newMedication, contre_indication: e.target.value})}
                    placeholder="Allergie au paracétamol, insuffisance hépatique..."
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Effets secondaires</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={sideEffectInput} 
                      onChange={(e) => setSideEffectInput(e.target.value)}
                      placeholder="Nausées, maux de tête..."
                      onKeyDown={(e) => e.key === 'Enter' && addSideEffect()}
                    />
                    <Button type="button" onClick={addSideEffect}>
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(newMedication.side_effect || []).map((effect, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {effect}
                        <button onClick={() => removeSideEffect(index)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Indications thérapeutiques</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={indicationInput} 
                      onChange={(e) => setIndicationInput(e.target.value)}
                      placeholder="Douleur légère à modérée..."
                      onKeyDown={(e) => e.key === 'Enter' && addIndication()}
                    />
                    <Button type="button" onClick={addIndication}>
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(newMedication.Indications || []).map((indication, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {indication}
                        <button onClick={() => removeIndication(index)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddMedication} 
                  disabled={loading || !newMedication.Nom || !newMedication.Dosage}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Ajouter le médicament
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                <span>Recherche avancée</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </CardTitle>
            <CardDescription>
              Trouvez le médicament exact dont vous avez besoin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, classe ou laboratoire..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <Label>Forme pharmaceutique</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={activeFilters.forme}
                        onChange={(e) => setActiveFilters({...activeFilters, forme: e.target.value})}
                      >
                        <option value="">Toutes les formes</option>
                        {uniqueFormes.map((forme) => (
                          <option key={forme} value={forme}>{forme}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Classe thérapeutique</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={activeFilters.classe}
                        onChange={(e) => setActiveFilters({...activeFilters, classe: e.target.value})}
                      >
                        <option value="">Toutes les classes</option>
                        {uniqueClasses.map((classe) => (
                          <option key={classe} value={classe}>{classe}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Laboratoire</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={activeFilters.laboratoire}
                        onChange={(e) => setActiveFilters({...activeFilters, laboratoire: e.target.value})}
                      >
                        <option value="">Tous les laboratoires</option>
                        {uniqueLaboratoires.map((lab) => (
                          <option key={lab} value={lab}>{lab}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <Badge 
                  variant="outline" 
                  className="bg-blue-50 cursor-pointer hover:bg-blue-100"
                  onClick={clearFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Effacer tous les filtres
                </Badge>
                
                {searchTerm && (
                  <Badge className="flex items-center gap-1">
                    Recherche: {searchTerm}
                    <button onClick={() => setSearchTerm("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {activeFilters.forme && (
                  <Badge className="flex items-center gap-1">
                    Forme: {activeFilters.forme}
                    <button onClick={() => setActiveFilters({...activeFilters, forme: ""})}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {activeFilters.classe && (
                  <Badge className="flex items-center gap-1">
                    Classe: {activeFilters.classe}
                    <button onClick={() => setActiveFilters({...activeFilters, classe: ""})}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {activeFilters.laboratoire && (
                  <Badge className="flex items-center gap-1">
                    Lab: {activeFilters.laboratoire}
                    <button onClick={() => setActiveFilters({...activeFilters, laboratoire: ""})}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Résultats ({filteredMedications.length})
            </CardTitle>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[200px]">Nom</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Forme</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Laboratoire</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMedications.length > 0 ? (
                      currentMedications.map((medication) => (
                        <motion.tr
                          key={medication.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                          className="border-t"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-blue-500" />
                              {medication.Nom}
                            </div>
                          </TableCell>
                          <TableCell>{medication.Dosage}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{medication.Forme}</Badge>
                          </TableCell>
                          <TableCell>{medication.Classe}</TableCell>
                          <TableCell>{medication.Laboratoire}</TableCell>
                          <TableCell className="text-right">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleMedicationClick(medication)}
                                className="bg-blue-50 hover:bg-blue-100"
                              >
                                Détails
                              </Button>
                            </motion.div>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Search className="h-8 w-8" />
                            <p>Aucun médicament trouvé</p>
                            {hasActiveFilters && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={clearFilters}
                                className="text-blue-600"
                              >
                                Effacer les filtres
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6"
                >
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={cn(
                            "cursor-pointer",
                            currentPage === 1 && "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink 
                              onClick={() => handlePageChange(pageNum)} 
                              isActive={pageNum === currentPage}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={cn(
                            "cursor-pointer",
                            currentPage === totalPages && "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Medication Details Dialog */}
      <AnimatePresence>
        {selectedMedication && (
          <Dialog open={!!selectedMedication} onOpenChange={() => setSelectedMedication(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col h-full"
              >
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="flex items-center gap-3 text-2xl">
                        <Pill className="h-6 w-6 text-blue-500" />
                        {selectedMedication.Nom} {selectedMedication.Dosage}
                      </DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedMedication.Classe}</Badge>
                        <span>•</span>
                        <span>{selectedMedication.Laboratoire}</span>
                      </DialogDescription>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedMedication.Duree_de_conservation} mois conservation
                    </Badge>
                  </div>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 py-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-blue-700">
                            <Info className="h-5 w-5" />
                            Informations générales
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Forme pharmaceutique:</span>
                              <span className="font-medium">{selectedMedication.Forme}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Conditionnement:</span>
                              <span className="font-medium">{selectedMedication.Conditionnement_primaire}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-green-700">
                            <HeartPulse className="h-5 w-5" />
                            Indications thérapeutiques
                          </h4>
                          <ul className="list-disc pl-5 space-y-2">
                            {selectedMedication.Indications.map((indication, index) => (
                              <li key={index} className="text-sm">{indication}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-yellow-700">
                            <AlertCircle className="h-5 w-5" />
                            Contre-indications
                          </h4>
                          <p className="text-sm">{selectedMedication.contre_indication || "Aucune contre-indication spécifique mentionnée."}</p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-red-700">
                            <AlertCircle className="h-5 w-5" />
                            Effets secondaires
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedMedication.side_effect.length > 0 ? (
                              selectedMedication.side_effect.map((effect, index) => (
                                <Badge key={index} variant="outline" className="bg-white">
                                  {effect}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">Aucun effet secondaire spécifique mentionné.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="px-6 py-3 border-t flex justify-end">
                  <Button 
                    onClick={() => setSelectedMedication(null)}
                    variant="outline"
                  >
                    Fermer
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}