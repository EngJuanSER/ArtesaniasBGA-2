"use client";

import Link from "next/link";

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

export function SigninForm() {
  return (
    <div className="max-w-md mx-auto flex items-center justify-center py-5">
      <form>
        <Card className="bg-popover border-primary">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-primary">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus datos para iniciar sesión en tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-primary">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="nombre de usuario o correo electrónico"
                className="border-primary"
              />
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
            </div>
          </CardContent>
          <CardFooter className="flex flex-col text-primary">
            <button className="w-full">Iniciar Sesión</button>
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