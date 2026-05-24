import API_URL from "./api";

export async function getUsers() {
  const response = await fetch(
    `${API_URL}/usuarios/`
  );

  if (!response.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return response.json();
}

export async function createUser(data: any) {
  const response = await fetch(
    `${API_URL}/usuarios/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Error al registrar usuario");
  }

  return response.json();
}