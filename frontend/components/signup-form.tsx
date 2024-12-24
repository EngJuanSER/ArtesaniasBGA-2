"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerUserAction } from "@/data/actions/auth-actions";

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

const INITIAL_STATE = {
  data: null,
};

export function SignupForm() {
  const [formState, formAction] = useActionState(
    registerUserAction,
    INITIAL_STATE
  );

  return (
    <div className="max-w-md mx-auto flex items-center justify-center py-5">
      <form action={formAction}>
        <Card className="bg-popover border-primary">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-primary">Registrarse</CardTitle>
            <CardDescription>
              Ingresa tus datos para crear una nueva cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-primary">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="nombre de usuario"
                className="border-primary"
              />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div className="space-y-2 text-primary">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                className="border-primary"
              />
              <ZodErrors error={formState?.zodErrors?.email} />
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
          <CardFooter className="flex flex-col">
            <button className="w-full text-primary">Registrarse</button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          ¿Ya tienes una cuenta?
          <Link className="underline ml-2" href="signin">
            Iniciar sesión
          </Link>
        </div>
      </form>
    </div>
  );
}