import API_URL from "./api";

export async function login(
  correo: string,
  contrasena: string
) {
  const response = await fetch(
    `${API_URL}/usuarios/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo,
        contrasena,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }

  return response.json();
}