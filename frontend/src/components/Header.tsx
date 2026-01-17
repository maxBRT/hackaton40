import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  LogOut, 
  LogIn,
  Home
} from "lucide-react";

export default function Header() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };
        
        window.addEventListener("auth-change", handleStorageChange);
        
        return () => {
            window.removeEventListener("auth-change", handleStorageChange);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <span className="font-bold text-xl tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                LearnHub
                            </span>
                        </Link>
                        
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                <Home className="h-4 w-4" />
                                Accueil
                            </Link>
                            {token && (
                                <>
                                    <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    <Link to="/learning-paths" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                        <BookOpen className="h-4 w-4" />
                                        Parcours
                                    </Link>
                                    <Link to="/forum" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                        <MessageSquare className="h-4 w-4" />
                                        Forum
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {token ? (
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={logout}
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Déconnexion</span>
                                </Button>
                            </div>
                        ) : (
                            <Button asChild variant="default" size="sm" className="shadow-sm">
                                <Link to="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Connexion
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}