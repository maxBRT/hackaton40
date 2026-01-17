import { GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors duration-500"></div>
        <GraduationCap className="h-24 w-24 text-primary relative" />
      </div>
      
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Bienvenue sur <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">LearnHub</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          La plateforme d'apprentissage moderne pour propulser votre carrière de développeur.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
          <Link to="/learning-paths">
            Commencer l'aventure
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8">
          <Link to="/login">
            Espace membre
          </Link>
        </Button>
      </div>
    </div>
  );
}


  
