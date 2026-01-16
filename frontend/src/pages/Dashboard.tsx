import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type MePayload = {
  userId: string
  username: string
  userEmail: string
  role: string
  currentExp: number
  userCourses: any[]
  lessonProgresses: any[]
}

type MeResponse = {
  success: boolean
  message: string
  data: MePayload
}

export default function Dashboard() {
  const navigate = useNavigate()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [me, setMe] = useState<MeResponse | null>(null)

  useEffect(() => {
    const fetchMe = async () => {
      setError(null)
      setLoading(true)

      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }

        const response = await axios.get<MeResponse>("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setMe(response.data)
      } catch (err: any) {
        console.error(err?.message ?? err)
        setError(err?.message ?? "Erreur lors du chargement des données.")
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [navigate])

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const user = me?.data
  const coursesCount = user?.userCourses?.length ?? 0
  const lessonsCount = user?.lessonProgresses?.length ?? 0

  const completedLessons = user?.lessonProgresses?.filter(
    (lp) => lp?.isCompleted === true || lp?.completed === true || lp?.status === "COMPLETED"
  ).length ?? 0

  const completionPct =
    lessonsCount === 0 ? 0 : Math.round((completedLessons / lessonsCount) * 100)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            {loading ? "Chargement..." : "Connecté ✅"}
          </p>
        </div>

        <Button variant="destructive" onClick={logout}>
          Se déconnecter
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Errors */}
      {error && (
        <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Top stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expérience
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {user?.currentExp ?? 0} XP
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cours suivis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {coursesCount}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leçons complétées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold">
              {completedLessons}/{lessonsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionPct}% terminé
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Profil */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Nom :</span>{" "}
              <span className="font-medium">{user?.username ?? "..."}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email :</span>{" "}
              <span className="font-medium">{user?.userEmail ?? "..."}</span>
            </div>
            <div>
              <span className="text-muted-foreground">User ID :</span>{" "}
              <span className="font-mono text-xs">{user?.userId ?? "..."}</span>
            </div>

            <div className="pt-2">
              <Button variant="outline" onClick={() => navigate("/learning-paths")}>
                Voir les learning paths
              </Button>
              <Button className="ml-2" onClick={() => navigate("/forum")}>
                Aller au forum
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progression */}
        <Card>
          <CardHeader>
            <CardTitle>Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cours</span>
              <span className="font-medium">{coursesCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Leçons</span>
              <span className="font-medium">{lessonsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Terminées</span>
              <span className="font-medium">{completedLessons}</span>
            </div>
            <Separator className="my-2" />
            <p className="text-muted-foreground">
              Objectif : terminer au moins 1 leçon aujourd’hui.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lists */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mes cours</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {coursesCount === 0 ? (
              <p className="text-muted-foreground">Aucun cours pour l’instant.</p>
            ) : (
              <ul className="list-disc pl-5">
                {user!.userCourses.slice(0, 5).map((c, idx) => (
                  <li key={c?.id ?? idx}>
                    {c?.title ?? c?.name ?? `Cours #${idx + 1}`}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières leçons</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {lessonsCount === 0 ? (
              <p className="text-muted-foreground">Aucune leçon suivie.</p>
            ) : (
              <ul className="list-disc pl-5">
                {user!.lessonProgresses.slice(0, 5).map((lp, idx) => (
                  <li key={lp?.id ?? idx}>
                    {lp?.lessonTitle ?? lp?.title ?? `Leçon #${idx + 1}`}{" "}
                    <span className="text-muted-foreground">
                      ({lp?.status ?? (lp?.isCompleted ? "COMPLETED" : "IN_PROGRESS")})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
