import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}

type LessonItem = {
  id: string
  title: string
  content: string
  moduleId: string
  position: number
  difficulty: string
  createdAt: string
  updatedAt: string
}

export default function Course() {
  const { id: courseId } = useParams()
  const navigate = useNavigate()

  const token = useMemo(() => localStorage.getItem("token"), [])
  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  )

  const [lessons, setLessons] = useState<LessonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!token) {
        navigate("/login")
        return
      }
      if (!courseId) {
        setError("Course ID manquant dans l'URL.")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const res = await axios.get<ApiResponse<LessonItem[]>>(
          `/api/lessons?courseId=${courseId}`,
          { headers: authHeaders }
        )

        if (!res.data?.success) {
          throw new Error(res.data?.message ?? "Impossible de charger les leçons.")
        }

        // tri par position
        const sorted = [...res.data.data].sort((a, b) => a.position - b.position)
        setLessons(sorted)
      } catch (e: any) {
        console.error(e)
        setError(
          e?.response?.data?.message ??
            e?.message ??
            "Erreur lors du chargement des leçons."
        )
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [token, courseId, authHeaders, navigate])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Cours</h1>
          <p className="mt-1 text-muted-foreground">
            Leçons disponibles pour ce cours
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leçons</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {loading && (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {!loading && !error && lessons.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucune leçon trouvée pour ce cours.
            </p>
          )}

          {!loading &&
            !error &&
            lessons.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {l.position}. {l.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Difficulté : {l.difficulty} • Module : {l.moduleId}
                  </p>
                </div>

                <Button onClick={() => navigate(`/lesson/${l.id}`)}>
                  Ouvrir
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
