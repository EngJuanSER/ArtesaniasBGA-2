"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginUserAction } from "@/data/actions/auth-actions";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ZodErrors } from "@/components/zod-errors";
import { StrapiErrors } from "@/components/strapi-errors";
import { SubmitButton } from "@/components/submit-button";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  data: null,
  message: null,
};

export function SigninForm() {

  const [formState, formAction] = useActionState(loginUserAction, INITIAL_STATE);

  return (
    <div className="max-w-md mx-auto flex items-center justify-center py-5">
      <form action={formAction}>
        <Card className="bg-popover border-primary">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-primary">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus datos para iniciar sesión en tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-primary">
              <Label htmlFor="identifier">Correo Electrónico</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="nombre de usuario o correo electrónico"
                className="border-primary"
              />
              <ZodErrors error={formState?.zodErrors?.identifier} />
            </div>
            <div className="space-y-2 text-primary">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="contraseña"
                className="border-primary"
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col text-primary">
            <SubmitButton
              className="w-full"
              text="Iniciar Sesión"
              loadingText="Cargando"
            />
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm text-primary">
          ¿No tienes una cuenta?
          <Link className="underline ml-2" href="signup">
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  );
}