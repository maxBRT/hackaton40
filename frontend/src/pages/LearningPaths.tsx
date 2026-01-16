// -------------------------------
// Imports des hooks React, de la navigation et des outils HTTP
// -------------------------------
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// -------------------------------
// Imports des composants UI shadcn pour l’affichage des cartes
// -------------------------------
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import axios from "axios";


// -------------------------------
// Interface représentant la structure de la réponse API
// -------------------------------
interface ApiResponse {
  success: boolean;
  data: LearningPath[];
}

// -------------------------------
// Interface représentant un parcours d’apprentissage
// -------------------------------
interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  author: string;
}

// -------------------------------
// Composant principal affichant la liste des parcours d’apprentissage
// -------------------------------
export default function LearningPaths() {
  const navigate = useNavigate();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Effet exécuté au chargement pour vérifier l’authentification et charger les données
  // -------------------------------
  useEffect(() => {
    const load = async () => {

      // -------------------------------
      // Vérification de la présence d’un token avant l’accès à la page
      // -------------------------------
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {

        // -------------------------------
        // Appel API pour récupérer les parcours d’apprentissage
        // -------------------------------
        const response = await axios.get<ApiResponse>("/api/learning-paths");
        const responseData = response.data
        const path = responseData.data

        // -------------------------------
        // Mise à jour de l’état avec les parcours reçus
        // -------------------------------
        setPaths(path ?? []);
      } catch (e) {
        console.error("API ERROR:", e);
      } finally {
        // -------------------------------
        // Fin de l’état de chargement
        // -------------------------------
        setLoading(false);
      }
    };

    load();
  }, []);

  // -------------------------------
  // Affichage d’un message pendant le chargement des données
  // -------------------------------
  if (loading) return <div className="p-6">Chargement...</div>;

  // -------------------------------
  // Rendu principal de la page
  // -------------------------------
  return (
    <div className="p-6">

      {/* -------------------------------
          Titre et description de la page
         ------------------------------- */}
      <h1 className="text-2xl font-bold">Learning paths</h1>
      <p className="text-muted-foreground mt-2">
        Choisis un parcours pour voir les cours disponibles.
      </p>
      
      {/* -------------------------------
          Affichage dynamique des parcours sous forme de cartes
         ------------------------------- */}
      <div className="grid gap-3 mt-6">
        {paths.map((p) => (
          <Link key={p.id} to={`/path/${p.id}`} className="no-underline">
            <Card className="hover:shadow-md transition cursor-pointer">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.description ?? "Aucune description"}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* -------------------------------
          Message affiché si aucun parcours n’est disponible
         ------------------------------- */}
      {paths.length === 0 && (
        <p className="text-muted-foreground mt-6">Aucun parcours trouvé.</p>
      )}
    </div>
  );
}
