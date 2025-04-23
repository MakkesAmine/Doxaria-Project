"use client"

import { useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Search, Pill, Loader2, Sparkles, AlertCircle, CheckCircle, Star, Zap, ChevronDown, ChevronUp } from "lucide-react"

interface Recommendation {
  Nom: string
  DCI?: string
  Score?: number
  Similitude?: number
  Details?: {
    Indications?: string
    ContreIndications?: string
    EffetsSecondaires?: string
  }
}

export default function Recommendations() {
  const [medicament, setMedicament] = useState("")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null)

  const toggleDetails = (nom: string) => {
    setExpandedDetails(expandedDetails === nom ? null : nom)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!medicament.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez saisir le nom d'un médicament",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setRecommendations([])

    try {
      // Simulation de données avec scores pour la démo
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockData: Recommendation[] = [
        { 
          Nom: "Paracétamol Vitamine C", 
          DCI: "Paracétamol + Acide ascorbique", 
          Score: 92, 
          Similitude: 0.95,
          Details: {
            Indications: "Douleurs légères à modérées et fièvre",
            ContreIndications: "Allergie au paracétamol, insuffisance hépatique",
            EffetsSecondaires: "Rarement: réactions cutanées"
          }
        },
        { 
          Nom: "Doliprane", 
          DCI: "Paracétamol", 
          Score: 88, 
          Similitude: 0.93,
          Details: {
            Indications: "Traitement symptomatique des douleurs et fièvre",
            ContreIndications: "Hypersensibilité au paracétamol",
            EffetsSecondaires: "Exceptionnel: perturbations hépatiques"
          }
        },
        { 
          Nom: "Efferalgan Vitamine C", 
          DCI: "Paracétamol + Acide ascorbique", 
          Score: 85, 
          Similitude: 0.90,
          Details: {
            Indications: "Douleurs et états fébriles",
            ContreIndications: "Déficit en G6PD",
            EffetsSecondaires: "Très rare: réactions allergiques"
          }
        },
        { 
          Nom: "Dafalgan", 
          DCI: "Paracétamol", 
          Score: 82, 
          Similitude: 0.88,
          Details: {
            Indications: "Douleurs et fièvre",
            ContreIndications: "Insuffisance hépatocellulaire",
            EffetsSecondaires: "À fortes doses: hépatotoxicité"
          }
        },
        { 
          Nom: "Ibuprofène", 
          DCI: "Ibuprofène", 
          Score: 65, 
          Similitude: 0.70,
          Details: {
            Indications: "Douleurs inflammatoires",
            ContreIndications: "Ulcère gastroduodénal",
            EffetsSecondaires: "Troubles digestifs fréquents"
          }
        }
      ]

      setRecommendations(mockData)
      setSearchPerformed(true)

      toast({
        title: "Recommandations trouvées!",
        description: `Nous avons trouvé ${mockData.length} alternative(s) pour "${medicament}"`,
      })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-orange-600"
  }

  const getSimilitudeIcon = (similitude: number) => {
    if (similitude >= 0.9) return <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
    if (similitude >= 0.8) return <CheckCircle className="h-4 w-4 fill-green-400 text-green-500" />
    return <Zap className="h-4 w-4 fill-orange-400 text-orange-500" />
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Trouver des Alternatives Médicamenteuses
        </h1>
      </motion.div>

      {/* Search Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              <span>Recherche d'Alternatives</span>
            </CardTitle>
            <CardDescription>
              Trouvez les meilleures alternatives à votre médicament actuel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={medicament}
                  onChange={(e) => setMedicament(e.target.value)}
                  placeholder="Exemple: Paracétamol, Ibuprofène..."
                  className="pl-10 h-12 text-md border-primary/30 focus-visible:ring-primary"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-12 px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="animate-pulse">Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Trouver des Alternatives
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {searchPerformed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Results Summary */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Pill className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Résultats pour: <span className="text-primary">{medicament}</span>
                  </h3>
                  <p className="text-sm text-blue-700">
                    {recommendations.length} alternative(s) recommandée(s)
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-blue-200">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-blue-800">
                  Score moyen: {Math.round(recommendations.reduce((acc, curr) => acc + (curr.Score || 0), 0) / recommendations.length)}%
                </span>
              </div>
            </motion.div>

            {/* Results Display */}
            {recommendations.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-1">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.Nom}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                    className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Medicament Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <h3 className="font-bold text-lg text-gray-900">{rec.Nom}</h3>
                          {index === 0 && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star className="h-3 w-3 fill-green-500 text-green-500" />
                              Meilleur match
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{rec.DCI || "DCI non spécifiée"}</p>
                      </div>

                      {/* Score Indicators */}
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Score */}
                        <div className="flex items-center gap-2">
                          <div className="relative w-12 h-12">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={rec.Score && rec.Score >= 90 ? "#10B981" : rec.Score && rec.Score >= 80 ? "#3B82F6" : "#F59E0B"}
                                strokeWidth="3"
                                strokeDasharray={`${rec.Score}, 100`}
                              />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                              <span className={`text-xs font-bold ${getScoreColor(rec.Score || 0)}`}>
                                {rec.Score}%
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Score</span>
                            <span className="text-sm font-medium">{rec.Score && rec.Score >= 90 ? "Excellent" : rec.Score && rec.Score >= 80 ? "Bon" : "Moyen"}</span>
                          </div>
                        </div>

                        {/* Similitude */}
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-50 p-2 rounded-full">
                            {getSimilitudeIcon(rec.Similitude || 0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Similitude</span>
                            <span className="text-sm font-medium">
                              {(rec.Similitude && (rec.Similitude * 100).toFixed(0)) || 0}%
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-primary text-primary hover:bg-primary/10 flex items-center gap-1"
                          onClick={() => toggleDetails(rec.Nom)}
                        >
                          {expandedDetails === rec.Nom ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Masquer
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Détails
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Detailed Information Section */}
                    <AnimatePresence>
                      {expandedDetails === rec.Nom && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t p-4 bg-gray-50">
                            <h4 className="font-medium mb-3 text-primary flex items-center gap-2">
                              <Pill className="h-4 w-4" />
                              Fiche d'information: {rec.Nom}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="space-y-2">
                                <h5 className="font-semibold text-gray-700 flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  Indications
                                </h5>
                                <p className="text-gray-600">{rec.Details?.Indications || "Non spécifié"}</p>
                              </div>
                              <div className="space-y-2">
                                <h5 className="font-semibold text-gray-700 flex items-center gap-1">
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                  Contre-indications
                                </h5>
                                <p className="text-gray-600">{rec.Details?.ContreIndications || "Non spécifié"}</p>
                              </div>
                              <div className="space-y-2">
                                <h5 className="font-semibold text-gray-700 flex items-center gap-1">
                                  <Zap className="h-4 w-4 text-yellow-500" />
                                  Effets secondaires
                                </h5>
                                <p className="text-gray-600">{rec.Details?.EffetsSecondaires || "Non spécifié"}</p>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex flex-wrap gap-2">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Score: {rec.Score}%
                                </span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Similitude: {(rec.Similitude && (rec.Similitude * 100).toFixed(0)) || 0}%
                                </span>
                                {index === 0 && (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                    Meilleure recommandation
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="py-12 text-center bg-white rounded-lg border border-dashed border-gray-200"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Aucune alternative trouvée
                </h3>
                <p className="text-muted-foreground mb-4">
                  Essayez avec un autre nom de médicament ou vérifiez l'orthographe.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    onClick={() => setMedicament("")}
                    className="border-primary text-primary"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Nouvelle recherche
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}