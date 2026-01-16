import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import api from "@/utils/axiosRequestInterceptor.ts";
import {FaBookAtlas} from "react-icons/fa6";
import {handleApiError} from "@/utils/handleApiError.ts";


interface RegisterResponse {
  data?: Record<string, unknown>;
  message?: string;
  success?: boolean;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const request: RegisterRequest = {username, email, password};
      const response = await api.post<RegisterResponse | null>("/auth/register", request);
      const responseData = response.data;
      if (responseData?.data?.token) {
        localStorage.setItem("token", responseData.data.token);
        navigate("/dashboard");
        return;
      }
      navigate("/login");
    } catch (error) {
      handleApiError(error, setError);
    }
  }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <form onSubmit={handleSubmit}>
            <FieldGroup className={ "max-w-sm mx-auto"}>
              <div className="flex flex-col items-center gap-2 text-center">
                <FaBookAtlas className="text-6xl"/> 
                <h1 className="text-xl font-bold">Bienvenue sur LearnHub.</h1>
                <FieldDescription>
                 Vous avez déja un compte? <Link to={"/login"}>Connectez vous</Link> 
                </FieldDescription>
              </div>
              <Field>
                <FieldLabel>Nom Utilisateur</FieldLabel>
                <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Courriel</FieldLabel>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />
              </Field>
              <Field>
                <FieldLabel>Mot de passe</FieldLabel>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </Field>
              <FieldLabel>Confirmation</FieldLabel>
              <Field>
              <Input
                  id="password-confirmation"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
              />
              </Field>
              <Field>
                <Button type="submit">Créer un compte</Button>
              </Field>
            </FieldGroup>
          </form>
          {error && <p className="text-red-500">{error}</p>}
        </div>
    )
  }
