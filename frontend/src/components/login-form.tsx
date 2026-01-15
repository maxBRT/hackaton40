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
import axios from "axios";
import { FaBookAtlas } from "react-icons/fa6";
import {handleApiError} from "@/utils/handleApiError.ts";

interface LoginResponse {
  data?: Record<string, string>;
  message?: string;
  success?: boolean;
}

interface LoginRequest {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const request: LoginRequest = { email, password };
      const response = await axios.post<LoginResponse>("/api/auth/login", request);
      const responseData = response.data;
      if (!responseData.success) {
        setError(responseData.message ?? null);
        return;
      }
      if (responseData.data?.token) {
        localStorage.setItem("token", responseData.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      handleApiError(error,  setError);
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup className="max-w-sm mx-auto">
          <div className="flex flex-col items-center gap-2 text-center">
            <FaBookAtlas className="text-6xl"/>
            <h1 className="text-xl font-bold">Bienvenue sur LearnHub.</h1>
            <FieldDescription>
              Pas de compte ? <Link to={"/register"}>Créé un compte</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Courriel</FieldLabel>
            <Input
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>
        </FieldGroup>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
