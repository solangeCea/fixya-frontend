export interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export async function getNotifications(): Promise<Notification[]> {

  // TEMPORAL MOCK
  return [
    {
      id: 1,
      title: "Nueva solicitud",
      message: "Se te asignó un nuevo trabajo.",
      created_at: "Hace 5 minutos",
      read: false,
    },
  ];
}