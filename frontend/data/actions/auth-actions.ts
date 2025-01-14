"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  registerUserService,
  loginUserService,
} from "@/services/authService";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 semana
  path: "/",
  domain: process.env.NODE_ENV === 'production' ? 'localhost' : '.app.github.dev',
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const schemaRegister = z.object({
  username: z.string({
    required_error: "El nombre de usuario es requerido",
  }).min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres",
  }).max(20, {
    message: "El nombre de usuario debe tener entre 3 y 20 caracteres",
  }),
  password: z.string({
    required_error: "La contraseña es requerida",
  }).min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }).max(100, {
    message: "La contraseña debe tener entre 6 y 100 caracteres",
  }),
  email: z.string({
    required_error: "El correo electrónico es requerido",
  }).email({
    message: "Por favor, introduce una dirección de correo electrónico válida",
  }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Campos faltantes. Fallo al registrar.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Fallo al registrar.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);

  redirect("/?registered=ok");
}

const schemaLogin = z.object({
  identifier: z
    .string()
    .min(3, {
      message: "El identificador debe tener al menos 3 caracteres",
    })
    .max(20, {
      message: "Por favor, introduce un nombre de usuario o correo electrónico válido",
    }),
  password: z
    .string()
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .max(100, {
      message: "La contraseña debe tener entre 6 y 100 caracteres",
    }),
});

export async function loginUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaLogin.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Campos faltantes. Fallo al iniciar sesión.",
    };
  }

  const responseData = await loginUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Fallo al iniciar sesión.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);

  redirect("/?logged=ok");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...config, maxAge: 0 });
  redirect("/");
}
