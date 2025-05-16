// "use client"

// import type React from "react"

// import { useState } from "react"
// import axios from "axios"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { toast } from "@/components/ui/use-toast"
// import { Search, Pill, Loader2, Sparkles, Star, CheckCircle, Zap } from "lucide-react"

// interface Recommendation {
//   Name: string
//   INN: string
//   Class: string
//   Dose_mg: number
//   Indications: string
//   Similarity: number
//   "Clinical Comment": string
// }

// export default function Recommendations() {
//   const [medication, setMedication] = useState("")
//   const [recommendations, setRecommendations] = useState<Recommendation[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [searchPerformed, setSearchPerformed] = useState(false)
//   const [expandedDetails, setExpandedDetails] = useState<string | null>(null)

//   const toggleDetails = (name: string) => {
//     setExpandedDetails(expandedDetails === name ? null : name)
//   }

//   const getAverageSimilarity = () => {
//     if (!Array.isArray(recommendations) || recommendations.length === 0) return "N/A"
//     const average =
//       (recommendations.reduce((acc, curr) => acc + (curr.Similarity || 0), 0) / recommendations.length) * 100
//     return Math.round(average) + "%"
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setRecommendations([])

//     try {
//       const response = await axios.post("http://localhost:8000/rec/recommend", {
//         drug_name: medication,
//         top_n: 5,
//       })

//       console.log("Raw API response:", response.data)

//       const data = (response.data as { recommendations: Recommendation[] }).recommendations

//       if (!Array.isArray(data)) {
//         throw new Error("API response is not an array.")
//       }

//       setRecommendations(data)
//       setSearchPerformed(true)
//       toast({
//         title: "Recommendations found!",
//         description: `We found ${data.length} alternative(s) for "${medication}"`,
//       })
//     } catch (error) {
//       console.error("Error:", error)
//       toast({
//         title: "Error",
//         description: "An error occurred during the search",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getSimilarityColor = (similarity: number) => {
//     if (similarity >= 0.9) return "text-green-600"
//     if (similarity >= 0.8) return "text-blue-600"
//     if (similarity >= 0.7) return "text-yellow-600"
//     return "text-orange-600"
//   }

//   const getSimilarityIcon = (similarity: number) => {
//     if (similarity >= 0.9) return <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
//     if (similarity >= 0.8) return <CheckCircle className="h-4 w-4 fill-green-400 text-green-500" />
//     return <Zap className="h-4 w-4 fill-orange-400 text-orange-500" />
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="space-y-8 p-4 md:p-6 max-w-6xl mx-auto"
//     >
//       {/* Header */}
//       <motion.div
//         initial={{ y: -20 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="flex items-center gap-3"
//       >
//         <Sparkles className="h-8 w-8 text-primary" />
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//           Find Medication Alternatives
//         </h1>
//       </motion.div>

//       {/* Search Card */}
//       <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-white to-blue-50">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Pill className="h-5 w-5 text-primary" />
//             <span>Search for Alternatives</span>
//           </CardTitle>
//           <CardDescription>Find the best alternatives to your current medication</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="text"
//                 value={medication}
//                 onChange={(e) => setMedication(e.target.value)}
//                 placeholder="Example: Paracetamol, Ibuprofen..."
//                 className="pl-10 h-12 text-md border-primary/30 focus-visible:ring-primary"
//               />
//             </div>
//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="h-12 px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md transition-all duration-300"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   <span className="animate-pulse">Analyzing...</span>
//                 </>
//               ) : (
//                 <>
//                   <Sparkles className="mr-2 h-4 w-4" />
//                   Find Alternatives
//                 </>
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Results Section */}
//       <AnimatePresence>
//         {searchPerformed && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-6"
//           >
//             {/* Results Summary */}
//             <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Pill className="h-5 w-5 text-blue-600" />
//                 <div>
//                   <h3 className="font-semibold text-blue-900">
//                     Results for: <span className="text-primary">{medication}</span>
//                   </h3>
//                   <p className="text-sm text-blue-700">{recommendations.length} recommended alternative(s)</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-blue-200">
//                 <Sparkles className="h-4 w-4 text-yellow-500" />
//                 <span className="text-sm font-medium text-blue-800">Average score: {getAverageSimilarity()}</span>
//               </div>
//             </div>

//             {/* Results Display */}
//             <div className="grid gap-4 md:grid-cols-1">
//               {recommendations.map((rec, index) => (
//                 <motion.div
//                   key={rec.Name}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1, duration: 0.3 }}
//                   whileHover={{ scale: 1.01 }}
//                   className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         <Pill className="h-4 w-4 text-primary" />
//                         <h3 className="font-bold text-lg text-gray-900">{rec.Name}</h3>
//                         {index === 0 && (
//                           <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
//                             <Star className="h-3 w-3 fill-green-500 text-green-500" />
//                             Best match
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-600 mt-1">{rec.INN}</p>
//                       <p className="text-sm text-gray-600">{rec.Class}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {getSimilarityIcon(rec.Similarity)}
//                       <span className={`text-sm ${getSimilarityColor(rec.Similarity)}`}>
//                         Similarity: {(rec.Similarity * 100).toFixed(0)}%
//                       </span>
//                     </div>
//                   </div>

//                   {expandedDetails === rec.Name && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="bg-gray-50 p-4"
//                     >
//                       <div className="text-sm text-gray-700">
//                         <p>
//                           <strong>Indications:</strong> {rec.Indications}
//                         </p>
//                         <p>
//                           <strong>Clinical Comment:</strong> {rec["Clinical Comment"]}
//                         </p>
//                         <p>
//                           <strong>Dose:</strong> {rec.Dose_mg} mg
//                         </p>
//                       </div>
//                     </motion.div>
//                   )}
//                   <div
//                     onClick={() => toggleDetails(rec.Name)}
//                     className="cursor-pointer text-sm text-blue-500 px-4 py-2 hover:bg-blue-50"
//                   >
//                     {expandedDetails === rec.Name ? "Collapse" : "View details"}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   )
// }



"use client"

import { useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {
  Search,
  Pill,
  Loader2,
  Sparkles,
  Star,
  CheckCircle,
  Zap
} from "lucide-react"

interface Recommendation {
  Nom: string
  DCI: string
  Classe: string
  Dose_mg: number
  Indications: string
  Similarity: number
  "Commentaire Clinique": string
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

  const getMoyenneSimilarite = () => {
    if (!Array.isArray(recommendations) || recommendations.length === 0) return "N/A"
    const moyenne =
      (recommendations.reduce((acc, curr) => acc + (curr.Similarity || 0), 0) /
        recommendations.length) *
      100
    return Math.round(moyenne) + "%"
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setRecommendations([])

  try {
    const response = await axios.post("http://localhost:8000/rec/recommend", {
      drug_name: medicament,
      top_n: 5
    })

    console.log("Réponse brute de l'API :", response.data)

    const data = (response.data as { recommendations: Recommendation[] }).recommendations // <-- ajuste ce nom ici

    if (!Array.isArray(data)) {
      throw new Error("La réponse de l'API n'est pas un tableau.")
    }

    setRecommendations(data)
    setSearchPerformed(true)
    toast({
      title: "Recommandations trouvées!",
      description: `Nous avons trouvé ${data.length} alternative(s) pour "${medicament}"`
    })
  } catch (error) {
    console.error("Erreur:", error)
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la recherche",
      variant: "destructive"
    })
  } finally {
    setIsLoading(false)
  }
}


  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return "text-green-600"
    if (similarity >= 0.8) return "text-blue-600"
    if (similarity >= 0.7) return "text-yellow-600"
    return "text-orange-600"
  }

  const getSimilarityIcon = (similarity: number) => {
    if (similarity >= 0.9)
      return <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
    if (similarity >= 0.8)
      return <CheckCircle className="h-4 w-4 fill-green-400 text-green-500" />
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
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
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
                  Score moyen: {getMoyenneSimilarite()}
                </span>
              </div>
            </div>

            {/* Results Display */}
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
                      <p className="text-sm text-gray-600 mt-1">{rec.DCI}</p>
                      <p className="text-sm text-gray-600">{rec.Classe}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSimilarityIcon(rec.Similarity)}
                      <span className={`text-sm ${getSimilarityColor(rec.Similarity)}`}>
                        Similarité: {(rec.Similarity * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {expandedDetails === rec.Nom && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 p-4"
                    >
                      <div className="text-sm text-gray-700">
                        <p><strong>Indications:</strong> {rec.Indications}</p>
                        <p><strong>Commentaire Clinique:</strong> {rec["Commentaire Clinique"]}</p>
                        <p><strong>Dose:</strong> {rec.Dose_mg} mg</p>
                      </div>
                    </motion.div>
                  )}
                  <div
                    onClick={() => toggleDetails(rec.Nom)}
                    className="cursor-pointer text-sm text-blue-500 px-4 py-2 hover:bg-blue-50"
                  >
                    {expandedDetails === rec.Nom ? "Réduire" : "Voir les détails"}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}