"use server";
import { z } from "zod";
import { registerUserService } from "@/services/authService";

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

  console.log("#############");
  console.log("User Registered Successfully", responseData.jwt);
  console.log("#############");

  return {
    ...prevState,
    data: "ok",
  };
}
